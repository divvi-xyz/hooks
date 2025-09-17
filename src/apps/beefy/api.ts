import got from '../../utils/got'
import { Address } from 'viem'
import { NetworkId } from '../../types/networkId'
import { LRUCache } from 'lru-cache'

export type BeefyVault = {
  id: string
  name: string
  type: string // cowcentrated, gov
  subType?: string
  token: string
  tokenAddress: Address | undefined
  tokenDecimals: number
  tokenProviderId: string
  earnedToken: string
  earnContractAddress: Address
  status: string
  platformId: string
  assets: string[]
  risks: string[]
  strategyTypeId: string
  network: string
  chain: string
  zaps: any[]
  isGovVault: boolean
  oracle: string
  oracleId: string
  createdAt: number
}

export type BaseBeefyVault = BeefyVault & {
  earnedTokenAddress: Address
  depositTokenAddresses: string[]
  strategy: Address
  pricePerFullShare: string
}

export type GovVault = BeefyVault & {
  type: 'gov'
  isGovVault: true
  earnedTokenAddress: Address[]
}

export type BeefyTvl = Record<number, Record<string, number | undefined>>

export type BeefyApyBreakdown = Record<
  string,
  Record<string, number> | undefined
>

export type BeefyPrices = Record<string, number | undefined>

export const NETWORK_ID_TO_BEEFY_BLOCKCHAIN_ID: Record<
  NetworkId,
  string | null
> = {
  [NetworkId['celo-mainnet']]: 'celo',
  [NetworkId['ethereum-mainnet']]: 'ethereum',
  [NetworkId['arbitrum-one']]: 'arbitrum',
  [NetworkId['op-mainnet']]: 'optimism',
  [NetworkId['polygon-pos-mainnet']]: 'polygon',
  [NetworkId['base-mainnet']]: 'base',
  [NetworkId['celo-alfajores']]: null,
  [NetworkId['ethereum-sepolia']]: null,
  [NetworkId['arbitrum-sepolia']]: null,
  [NetworkId['op-sepolia']]: null,
  [NetworkId['polygon-pos-amoy']]: null,
  [NetworkId['base-sepolia']]: null,
}

const NETWORK_ID_TO_CHAIN_ID: {
  [networkId in NetworkId]: number
} = {
  [NetworkId['ethereum-mainnet']]: 1,
  [NetworkId['arbitrum-one']]: 42161,
  [NetworkId['op-mainnet']]: 10,
  [NetworkId['celo-mainnet']]: 42220,
  [NetworkId['polygon-pos-mainnet']]: 137,
  [NetworkId['base-mainnet']]: 8453,
  [NetworkId['ethereum-sepolia']]: 11155111,
  [NetworkId['arbitrum-sepolia']]: 421614,
  [NetworkId['op-sepolia']]: 11155420,
  [NetworkId['celo-alfajores']]: 44787,
  [NetworkId['polygon-pos-amoy']]: 80002,
  [NetworkId['base-sepolia']]: 84532,
}

const cache = new LRUCache({
  max: 50, // Prevent excessive memory consumption
  ttl: 10 * 60 * 1000, // 10 minutes
})

const CACHE_KEYS = {
  VAULTS: (networkId: NetworkId) => `beefy:vaults:${networkId}`,
  GOV_VAULTS: (networkId: NetworkId) => `beefy:gov-vaults:${networkId}`,
  PRICES: (networkId: NetworkId) => `beefy:prices:${networkId}`,
  APY_BREAKDOWN: () => 'beefy:apy-breakdown',
  TVL: () => 'beefy:tvl',
} as const

export async function getBeefyVaults(
  networkId: NetworkId,
): Promise<{ vaults: BaseBeefyVault[]; govVaults: GovVault[] }> {
  const vaultsKey = CACHE_KEYS.VAULTS(networkId)
  const govVaultsKey = CACHE_KEYS.GOV_VAULTS(networkId)

  let vaults = cache.get(vaultsKey) as BaseBeefyVault[] | undefined
  let govVaults = cache.get(govVaultsKey) as GovVault[] | undefined

  if (!vaults || !govVaults) {
    const [vaultsResponse, govVaultsResponse] = await Promise.all([
      got
        .get(
          `https://api.beefy.finance/harvestable-vaults/${NETWORK_ID_TO_BEEFY_BLOCKCHAIN_ID[networkId]}`,
        )
        .json<BaseBeefyVault[]>(),
      got
        .get(
          `https://api.beefy.finance/gov-vaults/${NETWORK_ID_TO_BEEFY_BLOCKCHAIN_ID[networkId]}`,
        )
        .json<GovVault[]>(),
    ])

    // Cache the responses
    cache.set(vaultsKey, vaultsResponse)
    cache.set(govVaultsKey, govVaultsResponse)

    vaults = vaultsResponse
    govVaults = govVaultsResponse
  }

  return {
    vaults,
    govVaults,
  }
}

export async function getBeefyPrices(
  networkId: NetworkId,
): Promise<BeefyPrices> {
  const pricesKey = CACHE_KEYS.PRICES(networkId)

  let prices = cache.get(pricesKey) as BeefyPrices | undefined

  if (!prices) {
    const [lpsPrices, tokenPrices, tokens] = await Promise.all([
      got.get(`https://api.beefy.finance/lps`).json<BeefyPrices>(),
      got.get(`https://api.beefy.finance/prices`).json<BeefyPrices>(),
      got
        .get(
          `https://api.beefy.finance/tokens/${NETWORK_ID_TO_BEEFY_BLOCKCHAIN_ID[networkId]}`,
        )
        .json<
          Record<
            string, // oracleId
            {
              // These are the fields we need, but there are more
              address: string
              oracle: string // examples: 'lps', 'tokens'
              oracleId: string
            }
          >
        >(),
    ])

    // Combine lps prices with token prices
    prices = {
      ...lpsPrices,
      ...Object.fromEntries(
        Object.entries(tokens)
          .filter(([, { oracle }]) => oracle === 'tokens')
          .map(([, { address, oracleId }]) => [
            address.toLowerCase(),
            tokenPrices[oracleId],
          ]),
      ),
    }

    // Cache the response
    cache.set(pricesKey, prices)
  }

  return prices
}

export async function getApyBreakdown() {
  const cacheKey = CACHE_KEYS.APY_BREAKDOWN()

  let apyBreakdown = cache.get(cacheKey) as BeefyApyBreakdown | undefined

  if (!apyBreakdown) {
    // Fetch from API if not in cache
    apyBreakdown = await got
      .get(`https://api.beefy.finance/apy/breakdown/`)
      .json<BeefyApyBreakdown>()

    // Cache the response
    cache.set(cacheKey, apyBreakdown)
  }

  return apyBreakdown
}

export async function getTvls(
  networkId: NetworkId,
): Promise<Record<string, number | undefined>> {
  const cacheKey = CACHE_KEYS.TVL()

  let tvl = cache.get(cacheKey) as BeefyTvl | undefined

  if (!tvl) {
    tvl = await got.get(`https://api.beefy.finance/tvl/`).json<BeefyTvl>()

    // Cache the response
    cache.set(cacheKey, tvl)
  }

  return tvl[NETWORK_ID_TO_CHAIN_ID[networkId]] ?? {}
}
