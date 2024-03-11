import {NetworkId} from "../api/networkId";

export interface ShortcutsHook {
  getShortcutDefinitions(): ShortcutDefinition[]
}

export interface ShortcutDefinition {
  id: string // Example: claim-reward
  name: string // Example: Claim
  description: string // Example: Claim your reward
  networks: string[] // Example: ['celo']
  category?: 'claim' // We'll add more categories later
  onTrigger: (
    networkId: NetworkId,
    address: string,
    positionAddress: string,
  ) => Promise<Transaction[]> // 0, 1 or more transactions to sign by the user
}

export type Transaction = {
  networkId: NetworkId
  from: string
  to: string
  data: string
}
