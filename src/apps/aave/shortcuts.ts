import { Address, encodeFunctionData, parseUnits, erc20Abi } from 'viem'
import {
  createShortcut,
  ShortcutsHook,
  Transaction,
} from '../../types/shortcuts'
import { NetworkId } from '../../types/networkId'
import { ZodAddressLowerCased } from '../../types/address'
import { z } from 'zod'
import { getClient } from '../../runtime/client'
import { poolV3Abi } from './abis/pool-v3'

// From https://github.com/bgd-labs/aave-address-book/tree/4d208edf7271e0fff0eceed55de535e32dc055d4/src/ts
const AAVE_POOL_V3_ADDRESS_BY_NETWORK_ID: {
  [networkId in NetworkId]: Address | undefined
} = {
  [NetworkId['celo-mainnet']]: undefined,
  [NetworkId['celo-alfajores']]: undefined,
  [NetworkId['ethereum-mainnet']]: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
  [NetworkId['ethereum-sepolia']]: '0x6ae43d3271ff6888e7fc43fd7321a503ff738951',
  [NetworkId['arbitrum-one']]: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
  [NetworkId['arbitrum-sepolia']]: '0xbfc91d59fdaa134a4ed45f7b584caf96d7792eff',
  [NetworkId['op-mainnet']]: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
  [NetworkId['op-sepolia']]: '0xb50201558b00496a145fe76f7424749556e326d8',
}

// Hardcoding for now
const GAS = 1_000_000n

const hook: ShortcutsHook = {
  async getShortcutDefinitions(networkId: NetworkId, _address?: string) {
    const poolContractAddress = AAVE_POOL_V3_ADDRESS_BY_NETWORK_ID[networkId]
    if (!poolContractAddress) {
      return []
    }

    return [
      createShortcut({
        id: 'deposit',
        name: 'Deposit',
        description: 'Lend your assets to earn interest',
        networkIds: [networkId],
        // category: 'deposit',
        triggerInputShape: {
          depositToken: z.object({
            // TODO: consider requiring only tokenId,
            // Right now it would mean more changes in hooks
            address: ZodAddressLowerCased,
            decimals: z.coerce.number(),
            amount: z.string(), // in decimal string
          }),
        },
        async onTrigger({ networkId, address, depositToken }) {
          const walletAddress = address as Address
          const transactions: Transaction[] = []

          // amount in smallest unit
          const amountToSupply = parseUnits(
            depositToken.amount,
            depositToken.decimals,
          )

          const client = getClient(networkId)

          const approvedAllowanceForSpender = await client.readContract({
            address: depositToken.address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [walletAddress, poolContractAddress],
          })

          if (approvedAllowanceForSpender < amountToSupply) {
            const data = encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [poolContractAddress, amountToSupply],
            })

            const approveTx: Transaction = {
              networkId,
              from: walletAddress,
              to: depositToken.address,
              data,
            }
            transactions.push(approveTx)
          }

          const supplyTx: Transaction = {
            networkId,
            from: walletAddress,
            to: poolContractAddress,
            data: encodeFunctionData({
              abi: poolV3Abi,
              functionName: 'supply',
              args: [depositToken.address, amountToSupply, walletAddress, 0],
            }),
            // TODO: consider moving this concern to the runtime
            // which would simulate the transaction(s) to get these
            gas: GAS,
            estimatedGasUse: GAS / 3n,
          }

          transactions.push(supplyTx)

          return transactions
        },
      }),
    ]
  },
}

export default hook
