import { Address, createPublicClient, http, encodeFunctionData } from 'viem'
import { celo } from 'viem/chains'
import { ShortcutsHook } from '../../types/shortcuts'
import { ubiSchemeAbi } from './abis/ubi-scheme'
import { NetworkId } from '../../api/networkId'
import {logger} from "../../log";

const client = createPublicClient({
  chain: celo,
  transport: http(),
})

const SUPPORTED_NETWORKS: NetworkId[] = [NetworkId['celo-mainnet']]

const hook: ShortcutsHook = {
  async getShortcutDefinitions(networkId?: NetworkId, _address?: string) {
    if (!networkId || !SUPPORTED_NETWORKS.includes(networkId)) {
      logger.info(`Unsupported network for gooddollar: ${networkId}. Returning empty list of shortcut definitions.`)
      return []
    }
    return [
      {
        id: 'claim-reward',
        name: 'Claim',
        description: 'Claim daily UBI rewards',
        networkIds: SUPPORTED_NETWORKS,
        category: 'claim',
        async onTrigger(networkId, address, positionAddress) {
          // This isn't strictly needed, but will help while we're developing shortcuts
          const { request } = await client.simulateContract({
            address: positionAddress as Address, // This is the ubi contract address
            abi: ubiSchemeAbi,
            functionName: 'claim',
            account: address as Address,
          })

          const data = encodeFunctionData({
            abi: request.abi,
            args: request.args,
            functionName: request.functionName,
          })

          return [
            {
              networkId,
              from: address,
              to: positionAddress,
              data,
            },
          ]
        },
      },
    ]
  },
}

export default hook
