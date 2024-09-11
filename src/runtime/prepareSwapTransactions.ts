import { z } from 'zod'
import { tokenAmountWithMetadata, Transaction } from '../types/shortcuts'
import { EvmContractCall, Hook as SquidHook } from '@0xsquid/squid-types'
import { NetworkId } from '../types/networkId'
import { Address, encodeFunctionData, erc20Abi, parseUnits } from 'viem'
import {
  simulateTransactions,
  UnsupportedSimulateRequest,
} from './simulateTransactions'
import { logger } from '../log'
import { getConfig } from '../config'
import got, { HTTPError } from 'got'
import { getClient } from './client'

interface SwapTransaction {
  swapType: 'same-chain' // only supporting same-chain swaps for now
  chainId: number
  buyAmount: string
  sellAmount: string
  buyTokenAddress: string
  sellTokenAddress: string
  // be careful -- price means different things when using sellAmount vs buyAmount
  price: string
  guaranteedPrice: string
  appFeePercentageIncludedInPrice: string | undefined
  /**
   * In percentage, between 0 and 100
   */
  estimatedPriceImpact: string | null
  gas: string
  estimatedGasUse: string | null | undefined
  to: Address
  value: string
  data: `0x${string}`
  from: Address
  allowanceTarget: Address
}

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
  swapToTokenAddress: swapToAddress,
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
}): Promise<Transaction[]> {
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
    buyToken: swapToAddress,
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

  // TODO(ACT-1354): figure out a way to return swap details
  return transactions
}
