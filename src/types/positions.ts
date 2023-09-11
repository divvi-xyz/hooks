import { DecimalNumber, SerializedDecimalNumber } from './numbers'

// Interface that authors will implement
export interface PositionsHook {
  getInfo(): AppInfo
  // Get position definitions for a given address
  getPositionDefinitions(
    network: string,
    address: string,
  ): Promise<PositionDefinition[]>
  // Get an app token definition from a token definition
  // This is needed when a position definition has one ore more intermediary app tokens, which are not base tokens.
  // For instance a farm position composed of a LP token.
  // The runtime needs to call this function to resolve such intermediary tokens.
  getAppTokenDefinition?(
    tokenDefinition: TokenDefinition,
  ): Promise<AppTokenPositionDefinition>
}

export interface TokenDefinition {
  address: string
  network: string
}

export type TokenCategory = 'claimable' // We could add more categories later

export interface DisplayPropsContext {
  resolvedTokens: Record<string, Omit<Token, 'balance'>>
}

export interface DisplayProps {
  title: string // Example: CELO / cUSD
  description: string // Example: Pool
  imageUrl: string // Example: https://...
}

export interface AbstractPositionDefinition {
  network: string
  address: string
  displayProps: ((context: DisplayPropsContext) => DisplayProps) | DisplayProps
  tokens: (TokenDefinition & {
    category?: TokenCategory
  })[]

  availableShortcutIds?: string[] // Allows to apply shortcuts to positions
}

export interface PricePerShareContext {
  tokensByAddress: Record<string, Omit<AbstractToken, 'balance'>>
}

export interface AppTokenPositionDefinition extends AbstractPositionDefinition {
  type: 'app-token-definition'
  pricePerShare:
    | ((context: PricePerShareContext) => Promise<DecimalNumber[]>)
    | DecimalNumber[]
}

export interface BalancesContext {
  resolvedTokens: Record<string, Omit<Token, 'balance'>>
}

export interface ContractPositionDefinition extends AbstractPositionDefinition {
  type: 'contract-position-definition'
  balances:
    | ((context: BalancesContext) => Promise<DecimalNumber[]>)
    | DecimalNumber[]
}

export type PositionDefinition =
  | AppTokenPositionDefinition
  | ContractPositionDefinition

// Generic info about the app
// Note: this could be used for dapp listing too
export interface AppInfo {
  id: string // Example: ubeswap
  name: string // Example: Ubeswap
  description: string // Example: Decentralized exchange on Celo
}

export interface AbstractPosition {
  address: string // Example: 0x...
  network: string // Example: celo
  appId: string // Example: ubeswap
  appName: string // Example: Ubeswap
  /**
   * @deprecated replaced by displayProps
   */
  label: string // Example: Pool
  displayProps: DisplayProps
  tokens: (Token & { category?: TokenCategory })[]
  availableShortcutIds: string[] // Allows to apply shortcuts to positions
}

export interface AbstractToken {
  address: string // Example: 0x...
  network: string // Example: celo

  // These would be resolved dynamically
  symbol: string // Example: cUSD
  decimals: number // Example: 18
  priceUsd: SerializedDecimalNumber // Example: "1.5"
  balance: SerializedDecimalNumber // Example: "200", would be negative for debt
}

export interface BaseToken extends AbstractToken {
  type: 'base-token'
}

export interface AppTokenPosition extends AbstractPosition, AbstractToken {
  type: 'app-token'
  supply: SerializedDecimalNumber // Example: "1000"
  // Price ratio between the token and underlying token(s)
  pricePerShare: SerializedDecimalNumber[]
}

export interface ContractPosition extends AbstractPosition {
  type: 'contract-position'
  // This would be derived from the underlying tokens
  balanceUsd: SerializedDecimalNumber
}

export type Token = BaseToken | AppTokenPosition
export type Position = AppTokenPosition | ContractPosition
