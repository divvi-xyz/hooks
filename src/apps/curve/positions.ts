import { Address } from 'viem'
import got from 'got'
import {
  AppTokenPositionDefinition,
  PositionsHook,
  TokenDefinition,
  UnknownAppTokenError,
} from '../../types/positions'
import { curveTripoolAbi } from './abis/curve-tripool'
import { curvePoolAbi } from './abis/curve-pool'
import { DecimalNumber, toDecimalNumber } from '../../types/numbers'
import { NetworkId } from '../../types/networkId'
import { getClient } from '../../runtime/client'
import { getTokenId } from '../../runtime/getTokenId'

interface CurveApiResponse {
  success: boolean
  data: {
    // this has more fields, but only including fields we use
    poolData: {
      address: Address
      lpTokenAddress: Address
      implementation: string
      coins: any[]
    }[]
  }
}

type PoolSize = number

const NETWORK_ID_TO_CURVE_BLOCKCHAIN_ID: Record<NetworkId, string | null> = {
  [NetworkId['celo-mainnet']]: 'celo',
  [NetworkId['ethereum-mainnet']]: 'ethereum',
  [NetworkId['arbitrum-one']]: 'arbitrum',
  [NetworkId['op-mainnet']]: 'optimism',
  [NetworkId['ethereum-sepolia']]: null,
  [NetworkId['arbitrum-sepolia']]: null,
  [NetworkId['op-sepolia']]: null,
  [NetworkId['celo-alfajores']]: null,
}

export async function getAllCurvePools(
  networkId: NetworkId,
): Promise<{ address: Address; size: PoolSize }[]> {
  const blockchainId = NETWORK_ID_TO_CURVE_BLOCKCHAIN_ID[networkId]
  if (!blockchainId) {
    return []
  }
  const { data } = await got
    .get(`https://api.curve.fi/v1/getPools/all/${blockchainId}`)
    .json<CurveApiResponse>()

  return data.poolData.map((poolInfo) => ({
    address: poolInfo.lpTokenAddress,
    size: poolInfo.coins.length,
  }))
}

export async function getPoolPositionDefinitions(
  networkId: NetworkId,
  address: Address,
) {
  const pools = await getAllCurvePools(networkId)

  // call balanceOf to check if user has balance on a pool
  const client = getClient(networkId)
  const result = await client.multicall({
    contracts: pools.map(
      (pool) =>
        ({
          address: pool.address,
          abi: pool.size === 3 ? curveTripoolAbi : curvePoolAbi,
          functionName: 'balanceOf',
          args: [address],
        }) as const,
    ),
    allowFailure: false,
  })

  const userPools = pools
    .map((pool, i) => ({ ...pool, balance: result[i] }))
    .filter((pool) => pool.balance > 0)

  return await Promise.all(
    userPools.map((pool) =>
      getPoolPositionDefinition(networkId, pool.address, pool.size),
    ),
  )
}

async function getPoolPositionDefinition(
  networkId: NetworkId,
  poolAddress: Address,
  poolSize: PoolSize,
) {
  const poolTokenContract = {
    address: poolAddress,
    abi: poolSize === 3 ? curveTripoolAbi : curvePoolAbi,
  }
  const client = getClient(networkId)
  const tokenAddresses = await client.multicall({
    contracts: Array.from({ length: poolSize }, (_, index) =>
      BigInt(index),
    ).map(
      (n) =>
        ({
          ...poolTokenContract,
          functionName: 'coins',
          args: [n],
        }) as const,
    ),
    allowFailure: false,
  })

  const position: AppTokenPositionDefinition = {
    type: 'app-token-definition',
    networkId,
    address: poolAddress.toLowerCase(),
    tokens: tokenAddresses.map((token) => ({
      address: token.toLowerCase(),
      networkId,
    })),
    displayProps: ({ resolvedTokensByTokenId }) => {
      const tokenSymbols = tokenAddresses.map(
        (tokenAddress) =>
          resolvedTokensByTokenId[
            getTokenId({
              networkId,
              address: tokenAddress,
            })
          ].symbol,
      )
      return {
        title: tokenSymbols.join(' / '),
        description: 'Pool',
        imageUrl:
          'https://raw.githubusercontent.com/valora-inc/dapp-list/main/assets/curve.png',
      }
    },
    pricePerShare: async ({ tokensByTokenId }) => {
      const [totalSupply, ...balances] = await client.multicall({
        contracts: [
          { ...poolTokenContract, functionName: 'totalSupply' } as any,
          // get_balances can be used for older pool versions like 0.3.1 (example: https://celoscan.io/address/0xAF7Ee5Ba02dC9879D24cb16597cd854e13f3aDa8#readContract )
          //   but not in new versions like 0.3.7 (example: https://etherscan.io/address/0x21e27a5e5513d6e65c4f830167390997aa84843a#code )
          ...Array.from({ length: poolSize }, (_, index) => BigInt(index)).map(
            (n) =>
              ({
                ...poolTokenContract,
                functionName: 'balances',
                args: [n],
              }) as const,
          ),
        ],
        allowFailure: false,
      })
      const poolTokenId = getTokenId({
        address: poolAddress,
        isNative: false,
        networkId,
      })
      const poolToken = tokensByTokenId[poolTokenId]
      const tokens = tokenAddresses.map(
        (tokenAddress) =>
          tokensByTokenId[
            getTokenId({
              address: tokenAddress,
              networkId,
            })
          ],
      )
      const reserves = balances.map((balance, index) =>
        toDecimalNumber(balance, tokens[index].decimals),
      )
      const supply = toDecimalNumber(totalSupply, poolToken.decimals)
      const pricePerShare = reserves.map((r) => r.div(supply) as DecimalNumber)
      return pricePerShare
    },
  }

  return position
}

const hook: PositionsHook = {
  getInfo() {
    return {
      id: 'curve',
      name: 'Curve',
      description: 'Curve pools',
    }
  },
  async getPositionDefinitions(networkId, address) {
    if (!address) {
      return []
    }
    return getPoolPositionDefinitions(networkId, address as Address)
  },
  async getAppTokenDefinition({ networkId, address }: TokenDefinition) {
    // Assume that the address is a pool address
    const pools = await getAllCurvePools(networkId)
    const pool = pools.find((pool) => pool.address === address)
    if (!pool) {
      throw new UnknownAppTokenError({ networkId, address })
    }
    return await getPoolPositionDefinition(
      networkId,
      address as Address,
      pool.size,
    )
  },
}

export default hook
