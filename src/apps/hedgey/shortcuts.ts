import { Address, createPublicClient, http, encodeFunctionData } from 'viem'
import { celo } from 'viem/chains'
import { ShortcutsHook } from '../../types/shortcuts'
import { getHedgeyPlanNfts } from './nfts'
import { tokenVestingPlansAbi } from './abis/token-vesting-plans'

const client = createPublicClient({
  chain: celo,
  transport: http(),
})

const hook: ShortcutsHook = {
  async getShortcutDefinitions(network?: string, address?: string) {
    if (network !== 'celo' || !address) {
      return []
    }

    const planNfts = await getHedgeyPlanNfts({ address })

    return planNfts.map((planNft) => ({
      id: `${planNft.contractAddress}:${planNft.tokenId}`,
      name: 'Claim',
      description: 'Claim vested rewards',
      networks: ['celo'],
      category: 'claim',
      async onTrigger(network, address, positionAddress) {
        // positionAddress === planNft.contractAddress
        const { request } = await client.simulateContract({
          address: positionAddress as Address,
          abi: tokenVestingPlansAbi,
          functionName: 'redeemPlans',
          args: [[BigInt(planNft.tokenId)]],
          account: address as Address,
        })

        const data = encodeFunctionData({
          abi: request.abi,
          args: request.args,
          functionName: request.functionName,
        })

        return [
          {
            network,
            from: address,
            to: positionAddress as Address,
            data,
          },
        ]
      },
    }))
  },
}

export default hook
