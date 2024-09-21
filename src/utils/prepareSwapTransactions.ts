import { z } from 'zod'
import {
  tokenAmountWithMetadata,
  Transaction,
  TriggerOutputShape,
} from '../types/shortcuts'
import { EvmContractCall, Hook as SquidHook } from '@0xsquid/squid-types'
import { NetworkId } from '../types/networkId'
import { Address, encodeFunctionData, erc20Abi, parseUnits } from 'viem'
import {
  simulateTransactions,
  UnsupportedSimulateRequest,
} from '../runtime/simulateTransactions'
import { logger } from '../log'
import { getConfig } from '../config'
import got from './got'
import { HTTPError } from 'got'
import { getClient } from '../runtime/client'
import { SwapTransaction } from '../types/swaps'

type GetSwapQuoteResponse = {
  unvalidatedSwapTransaction?: SwapTransaction
  details: {
    swapProvider?: string
  }
  errors: {
    provider: string
    error: {
      message: string
      details: unknown
    }
  }[]
}

export async function prepareSwapTransactions({
  swapFromToken,
  postHook,
  swapToTokenAddress,
  networkId,
  walletAddress,
  simulatedGasPadding,
}: {
  swapFromToken: z.infer<typeof tokenAmountWithMetadata>
  postHook: Omit<
    SquidHook,
    'fundAmount' | 'fundToken' | 'provider' | 'logoURI' | 'calls'
  > & { calls: EvmContractCall[] } // we don't support CosmosCall
  swapToTokenAddress: Address
  networkId: NetworkId
  walletAddress: Address
  simulatedGasPadding?: bigint[]
}): Promise<TriggerOutputShape<'swap-deposit'>> {
  let postHookWithSimulatedGas = postHook

  try {
    const simulatedTransactions = await simulateTransactions({
      networkId,
      transactions: postHook.calls.map((call) => ({
        networkId,
        from: walletAddress,
        to: call.target,
        data: call.callData,
      })),
    })

    postHookWithSimulatedGas = {
      ...postHook,
      calls: postHook.calls.map((call, index) => {
        return {
          ...call,
          estimatedGas: (
            BigInt(simulatedTransactions[index].gasNeeded) +
            (simulatedGasPadding?.[index] ?? 0n)
          ).toString(),
        }
      }),
    }
  } catch (error) {
    if (!(error instanceof UnsupportedSimulateRequest)) {
      logger.warn(error, 'Unexpected error during simulateTransactions')
    }
    // use default already set in the postHook, no changes needed
  }

  const amountToSwap = parseUnits(swapFromToken.amount, swapFromToken.decimals)

  const swapParams = {
    buyToken: swapToTokenAddress,
    buyIsNative: false,
    buyNetworkId: networkId,
    ...(swapFromToken.address && { sellToken: swapFromToken.address }),
    sellIsNative: swapFromToken.isNative,
    sellNetworkId: networkId,
    sellAmount: amountToSwap.toString(),
    slippagePercentage: '1',
    postHook: postHookWithSimulatedGas,
    userAddress: walletAddress,
  }

  const url = getConfig().GET_SWAP_QUOTE_URL

  let swapQuote: GetSwapQuoteResponse

  try {
    swapQuote = await got
      .post(url, { json: swapParams })
      .json<GetSwapQuoteResponse>()
  } catch (err) {
    if (err instanceof HTTPError) {
      logger.warn(
        {
          err,
          response: err.response.body,
          swapParams,
        },
        'Got a non-2xx response from getSwapQuote',
      )
    } else {
      logger.warn({ err, swapParams }, 'Error getting swap quote')
    }
    throw err
  }

  if (!swapQuote.unvalidatedSwapTransaction) {
    logger.warn(
      {
        swapParams,
        swapQuote,
      },
      'No unvalidatedSwapTransaction in swapQuote',
    )
    throw new Error('Unable to get swap quote')
  }

  const client = getClient(networkId)

  const transactions: Transaction[] = []

  if (!swapFromToken.isNative && swapFromToken.address) {
    const { allowanceTarget } = swapQuote.unvalidatedSwapTransaction
    const approvedAllowanceForSpender = await client.readContract({
      address: swapFromToken.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [walletAddress, allowanceTarget],
    })

    if (approvedAllowanceForSpender < amountToSwap) {
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [allowanceTarget, amountToSwap],
      })

      const approveTx: Transaction = {
        networkId,
        from: walletAddress,
        to: swapFromToken.address,
        data,
      }
      transactions.push(approveTx)
    }
  }

  const { from, to, data, value, gas, estimatedGasUse } =
    swapQuote.unvalidatedSwapTransaction

  const swapTx: Transaction = {
    networkId,
    from,
    to,
    data,
    value: BigInt(value),
    gas: BigInt(gas),
    estimatedGasUse: estimatedGasUse ? BigInt(estimatedGasUse) : undefined,
  }

  transactions.push(swapTx)

  return {
    transactions,
    dataProps: { swapTransaction: swapQuote.unvalidatedSwapTransaction },
  }
}
