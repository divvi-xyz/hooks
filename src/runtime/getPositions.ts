import got from 'got'
import BigNumber from 'bignumber.js'
import {
  Address,
  Chain,
  ContractFunctionExecutionError,
  createPublicClient,
  http,
} from 'viem'
import {
  celo,
  optimism,
  celoAlfajores,
  optimismSepolia,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  mainnet,
} from 'viem/chains'
import { erc20Abi } from '../abis/erc-20'
import {
  AbstractToken,
  AppInfo,
  AppTokenPosition,
  AppTokenPositionDefinition,
  ContractPosition,
  ContractPositionDefinition,
  DisplayProps,
  Position,
  PositionDefinition,
  PricePerShareContext,
  Token,
} from '../types/positions'
import {
  DecimalNumber,
  toDecimalNumber,
  toSerializedDecimalNumber,
} from '../types/numbers'
import { getHooks } from './getHooks'
import { logger } from '../log'
import { NetworkId } from '../api/networkId'

interface RawTokenInfo {
  address?: string
  name: string
  symbol: string
  decimals: number
  imageUrl: string
  tokenId: string
  networkId: NetworkId
  isNative?: boolean
  priceUsd?: string
}

interface TokenInfo extends Omit<AbstractToken, 'balance'> {
  imageUrl: string
}

type TokensInfo = Record<string, TokenInfo | undefined>

type DefinitionsByAddress = Record<string, AppPositionDefinition | undefined>

type AppPositionDefinition = PositionDefinition & {
  appId: string
}

const networkIdToViemChain: Record<NetworkId, Chain> = {
  [NetworkId['celo-mainnet']]: celo,
  [NetworkId['ethereum-mainnet']]: mainnet,
  [NetworkId['arbitrum-one']]: arbitrum,
  [NetworkId['op-mainnet']]: optimism,
  [NetworkId['celo-alfajores']]: celoAlfajores,
  [NetworkId['ethereum-sepolia']]: sepolia,
  [NetworkId['arbitrum-sepolia']]: arbitrumSepolia,
  [NetworkId['op-sepolia']]: optimismSepolia,
}

function getClient(networkId: NetworkId) {
  return createPublicClient({
    chain: networkIdToViemChain[networkId],
    transport: http(),
  })
}

async function getBaseTokensInfo(
  getTokensInfoUrl: string,
): Promise<TokensInfo> {
  // Get base tokens
  const data = await got
    .get(getTokensInfoUrl)
    .json<{ tokens: Record<string, RawTokenInfo> }>()

  // Map to TokenInfo
  const tokensInfo: TokensInfo = {}
  for (const [_tokenId, tokenInfo] of Object.entries(data.tokens)) {
    if (!tokenInfo.address) {
      continue
    }
    tokensInfo[tokenInfo.address] = {
      networkId: tokenInfo.networkId,
      address: tokenInfo.address,
      symbol: tokenInfo.symbol,
      decimals: tokenInfo.decimals,
      imageUrl: tokenInfo.imageUrl,
      priceUsd: toSerializedDecimalNumber(tokenInfo.priceUsd ?? 0),
    }
  }
  return tokensInfo
}

async function getERC20TokenInfo(
  address: Address,
  networkId: NetworkId,
): Promise<TokenInfo> {
  const erc20Contract = {
    address: address,
    abi: erc20Abi,
  } as const
  const [symbol, decimals] = await getClient(networkId).multicall({
    contracts: [
      {
        ...erc20Contract,
        functionName: 'symbol',
      },
      {
        ...erc20Contract,
        functionName: 'decimals',
      },
    ],
    allowFailure: false,
  })

  return {
    networkId,
    address: address,
    symbol: symbol,
    decimals: decimals,
    imageUrl: '',
    priceUsd: toSerializedDecimalNumber(0), // Should we use undefined?
  }
}

function tokenWithUnderlyingBalance<T extends Token>(
  token: Omit<T, 'balance'>,
  balance: DecimalNumber,
  pricePerShare: DecimalNumber,
): T {
  const underlyingBalance = new BigNumber(balance).times(
    pricePerShare,
  ) as DecimalNumber

  const appToken =
    token.type === 'app-token'
      ? (token as unknown as AppTokenPosition)
      : undefined

  return {
    ...token,
    ...(appToken && {
      tokens: appToken.tokens.map((underlyingToken, i) => {
        return tokenWithUnderlyingBalance(
          underlyingToken,
          underlyingBalance,
          new BigNumber(appToken.pricePerShare[i]) as DecimalNumber,
        )
      }),
    }),
    balance: toSerializedDecimalNumber(
      underlyingBalance.toFixed(token.decimals, BigNumber.ROUND_DOWN),
    ),
  } as T
}

function getDisplayProps(
  positionDefinition: PositionDefinition,
  resolvedTokens: Record<string, Omit<Token, 'balance'>>,
): DisplayProps {
  if (typeof positionDefinition.displayProps === 'function') {
    return positionDefinition.displayProps({ resolvedTokens })
  } else {
    return positionDefinition.displayProps
  }
}

async function resolveAppTokenPosition(
  address: string,
  positionDefinition: AppTokenPositionDefinition & { appId: string },
  tokensByAddress: TokensInfo,
  resolvedTokens: Record<string, Omit<Token, 'balance'>>,
  appInfo: AppInfo,
): Promise<AppTokenPosition> {
  let pricePerShare: DecimalNumber[]
  if (typeof positionDefinition.pricePerShare === 'function') {
    pricePerShare = await positionDefinition.pricePerShare({
      tokensByAddress,
    } as PricePerShareContext)
  } else {
    pricePerShare = positionDefinition.pricePerShare
  }

  let priceUsd = new BigNumber(0)
  for (let i = 0; i < positionDefinition.tokens.length; i++) {
    const token = positionDefinition.tokens[i]
    const tokenInfo = tokensByAddress[token.address]!
    priceUsd = priceUsd.plus(pricePerShare[i].times(tokenInfo.priceUsd))
  }

  const positionTokenInfo = tokensByAddress[positionDefinition.address]!

  const appTokenContract = {
    address: positionDefinition.address as Address,
    abi: erc20Abi,
  } as const
  const [balance, totalSupply] = await getClient(
    positionDefinition.networkId,
  ).multicall({
    contracts: [
      {
        ...appTokenContract,
        functionName: 'balanceOf',
        args: [address as Address], // TODO: this is incorrect for intermediary app tokens
      },
      {
        ...appTokenContract,
        functionName: 'totalSupply',
      },
    ],
    allowFailure: false,
  })

  const displayProps = getDisplayProps(positionDefinition, resolvedTokens)

  const position: AppTokenPosition = {
    type: 'app-token',
    networkId: positionDefinition.networkId,
    address: positionDefinition.address,
    appId: positionDefinition.appId,
    appName: appInfo.name,
    symbol: positionTokenInfo.symbol,
    decimals: positionTokenInfo.decimals,
    label: displayProps.title,
    displayProps,
    tokens: positionDefinition.tokens.map((token, i) =>
      tokenWithUnderlyingBalance(
        resolvedTokens[token.address],
        toDecimalNumber(balance, positionTokenInfo.decimals),
        pricePerShare[i],
      ),
    ),
    pricePerShare: pricePerShare.map(toSerializedDecimalNumber),
    priceUsd: toSerializedDecimalNumber(priceUsd),
    balance: toSerializedDecimalNumber(
      toDecimalNumber(balance, positionTokenInfo.decimals),
    ),
    supply: toSerializedDecimalNumber(
      toDecimalNumber(totalSupply, positionTokenInfo.decimals),
    ),
    availableShortcutIds: positionDefinition.availableShortcutIds ?? [],
  }

  return position
}

async function resolveContractPosition(
  _address: string,
  positionDefinition: ContractPositionDefinition & { appId: string },
  _tokensByAddress: TokensInfo,
  resolvedTokens: Record<string, Omit<Token, 'balance'>>,
  appInfo: AppInfo,
): Promise<ContractPosition> {
  let balances: DecimalNumber[]
  if (typeof positionDefinition.balances === 'function') {
    balances = await positionDefinition.balances({
      resolvedTokens,
    })
  } else {
    balances = positionDefinition.balances
  }

  const tokens = positionDefinition.tokens.map((token, i) =>
    tokenWithUnderlyingBalance(
      {
        ...resolvedTokens[token.address],
        ...(token.category && { category: token.category }),
      },
      balances[i],
      new BigNumber(1) as DecimalNumber,
    ),
  )

  let balanceUsd = new BigNumber(0)
  for (let i = 0; i < positionDefinition.tokens.length; i++) {
    const token = positionDefinition.tokens[i]
    const tokenInfo = resolvedTokens[token.address]
    balanceUsd = balanceUsd.plus(balances[i].times(tokenInfo.priceUsd))
  }

  const displayProps = getDisplayProps(positionDefinition, resolvedTokens)

  const position: ContractPosition = {
    type: 'contract-position',
    address: positionDefinition.address,
    networkId: positionDefinition.networkId,
    appId: positionDefinition.appId,
    appName: appInfo.name,
    label: displayProps.title,
    displayProps,
    tokens: tokens,
    balanceUsd: toSerializedDecimalNumber(balanceUsd),
    availableShortcutIds: positionDefinition.availableShortcutIds ?? [],
  }

  return position
}

function addAppId<T>(definition: T, appId: string) {
  return {
    ...definition,
    appId,
  }
}

function addSourceAppId<T>(definition: T, sourceAppId: string) {
  return {
    ...definition,
    sourceAppId,
  }
}

// This is the main logic to get positions
export async function getPositions(
  networkId: NetworkId,
  address: string,
  appIds: string[] = [],
  getTokensInfoUrl: string,
) {
  const hooksByAppId = await getHooks(appIds, 'positions')

  // First get all position definitions for the given address
  const definitions = await Promise.all(
    Object.entries(hooksByAppId).map(([appId, hook]) =>
      hook.getPositionDefinitions(networkId, address).then(
        (definitions) => {
          return definitions.map((definition) => addAppId(definition, appId))
        },
        (err) => {
          // In case of an error, log and return an empty array
          // so other positions can still be resolved
          logger.error(
            { err },
            `Failed to get position definitions for ${appId}`,
          )
          return []
        },
      ),
    ),
  ).then((definitions) => definitions.flat())
  logger.debug({ definitions }, 'positions definitions')

  // Get the base tokens info
  const baseTokensInfo = await getBaseTokensInfo(getTokensInfoUrl)

  let unlistedBaseTokensInfo: TokensInfo = {}
  let definitionsToResolve: AppPositionDefinition[] = definitions
  const visitedDefinitions: DefinitionsByAddress = {}
  while (true) {
    // Visit each definition we haven't visited yet
    definitionsToResolve = definitionsToResolve.filter((definition) => {
      if (visitedDefinitions[definition.address]) {
        return false
      }
      visitedDefinitions[definition.address] = definition
      return true
    })

    if (definitionsToResolve.length === 0) {
      logger.debug('No more positions to resolve')
      break
    }

    // Resolve token definitions to tokens
    const allTokenDefinitions = definitionsToResolve.flatMap((position) =>
      position.tokens.map((token) => addSourceAppId(token, position.appId)),
    )

    logger.debug({ allTokenDefinitions }, 'allTokenDefinitions')

    // Get the tokens definitions for which we don't have the base token info or position definition
    const unresolvedTokenDefinitions = allTokenDefinitions.filter(
      (tokenDefinition) =>
        !{ ...baseTokensInfo, ...unlistedBaseTokensInfo }[
          tokenDefinition.address
        ] && !visitedDefinitions[tokenDefinition.address],
    )

    logger.debug({ unresolvedTokenDefinitions }, 'unresolvedTokenDefinitions')

    // Get the token info for the unresolved token definitions
    const newUnlistedBaseTokensInfo: TokensInfo = {}
    const appTokenDefinitions = (
      await Promise.all(
        unresolvedTokenDefinitions.map(async (tokenDefinition) => {
          try {
            // Assume the token is an app token from the hook
            // TODO: We'll probably need to allow hooks to specify the app id themselves
            const { sourceAppId } = tokenDefinition
            const hook = hooksByAppId[sourceAppId]
            if (!hook.getAppTokenDefinition) {
              throw new Error(
                `Positions hook for app '${sourceAppId}' does not implement 'getAppTokenDefinition'. Please implement it to resolve the intermediary app token definition for ${tokenDefinition.address} (${tokenDefinition.networkId}).`,
              )
            }
            const appTokenDefinition = await hook
              .getAppTokenDefinition(tokenDefinition)
              .then((definition) => addAppId(definition, sourceAppId))
            return appTokenDefinition
          } catch (e) {
            if (e instanceof ContractFunctionExecutionError) {
              // Assume the token is an ERC20 token
              const erc20TokenInfo = await getERC20TokenInfo(
                tokenDefinition.address as Address,
                networkId,
              )
              newUnlistedBaseTokensInfo[tokenDefinition.address] =
                erc20TokenInfo
              return
            }
            throw e
          }
        }),
      )
    ).filter((p): p is Exclude<typeof p, null | undefined> => p != null)

    logger.debug({ appTokenDefinitions }, 'appTokenDefinitions')
    logger.debug({ newUnlistedBaseTokensInfo }, 'newUnlistedBaseTokensInfo')

    unlistedBaseTokensInfo = {
      ...unlistedBaseTokensInfo,
      ...newUnlistedBaseTokensInfo,
    }

    // Get the definitions to resolve for the next iteration
    definitionsToResolve = appTokenDefinitions
  }

  logger.debug({
    unlistedBaseTokensInfo,
    visitedPositions: visitedDefinitions,
  })

  const baseTokensByAddress: TokensInfo = {
    ...baseTokensInfo,
    ...unlistedBaseTokensInfo,
  }
  const appTokensInfo = await Promise.all(
    Object.values(visitedDefinitions)
      .filter(
        (position): position is AppPositionDefinition =>
          position?.type === 'app-token-definition' &&
          !baseTokensByAddress[position.address],
      )
      .map((definition) =>
        getERC20TokenInfo(definition.address as Address, definition.networkId),
      ),
  )
  const appTokensByAddress: TokensInfo = {}
  for (const tokenInfo of appTokensInfo) {
    appTokensByAddress[tokenInfo.address] = tokenInfo
  }

  const tokensByAddress = {
    ...baseTokensByAddress,
    ...appTokensByAddress,
  }

  // We now have all the base tokens info and position definitions
  // including intermediary app tokens definitions
  // We can now resolve the positions

  // Start with the base tokens
  const resolvedTokens: Record<string, Omit<Token, 'balance'>> = {}
  for (const token of Object.values(baseTokensByAddress)) {
    if (!token) {
      continue
    }
    resolvedTokens[token.address] = {
      ...token,
      type: 'base-token',
    }
  }

  // TODO: we need to sort the positions by dependencies (tokens)
  // so that we can resolve them in the right order needed
  // Then we can also parallelize the resolution of positions, starting with those with no dependencies

  // For now sort with app tokens first
  const sortedDefinitions = Object.values(visitedDefinitions).sort(
    (a, b) =>
      (a?.type === 'app-token-definition' ? 0 : 1) -
      (b?.type === 'app-token-definition' ? 0 : 1),
  )

  const resolvedPositions: Record<string, Position> = {}
  for (const positionDefinition of sortedDefinitions) {
    if (!positionDefinition) {
      continue
    }

    const type = positionDefinition.type

    logger.debug('Resolving definition', type, positionDefinition.address)

    const appInfo = hooksByAppId[positionDefinition.appId].getInfo()

    let position: Position
    switch (type) {
      case 'app-token-definition':
        position = await resolveAppTokenPosition(
          address,
          positionDefinition,
          tokensByAddress,
          resolvedTokens,
          appInfo,
        )
        resolvedTokens[positionDefinition.address] = position
        break
      case 'contract-position-definition':
        position = await resolveContractPosition(
          address,
          positionDefinition,
          tokensByAddress,
          resolvedTokens,
          appInfo,
        )
        break
      default:
        const assertNever: never = type
        return assertNever
    }

    resolvedPositions[positionDefinition.address] = position
  }

  return definitions.map((definition) => {
    const resolvedPosition = resolvedPositions[definition.address]
    // Sanity check
    if (!resolvedPosition) {
      throw new Error(
        `Could not resolve ${definition.type}: ${definition.address}`,
      )
    }
    return resolvedPosition
  })
}
