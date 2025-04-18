import { TFunction } from 'i18next'
import { NetworkId } from '../../types/networkId'
import got from '../../utils/got'
import hook from './positions'
import { mockDayDatas } from './testData'

const mockT = ((x: string) => x) as TFunction

jest.mock('../../utils/got')

const mockReadContract = jest.fn()
jest.mock('../../runtime/client', () => ({
  getClient: jest.fn(() => ({
    readContract: mockReadContract,
  })),
}))

describe('hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockReadContract.mockImplementation(
      async ({ functionName, address, args }) => {
        if (address !== '0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8') {
          throw new Error('Unexpected address')
        }
        if (functionName === 'asset') {
          return '0xUnderlyingAsset'
        }
        if (functionName === 'decimals') {
          return 18
        }
        if (functionName === 'symbol') {
          return 'SYMBOL'
        }
        if (functionName === 'name') {
          return 'Cellar Name'
        }
        if (functionName === 'balanceOf') {
          return args[0] === '0x12345' ? 1n : 0n
        }
        throw new Error('Unexpected function')
      },
    )
  })

  it('should return the correct hook info', () => {
    expect(hook.getInfo()).toEqual({
      name: 'Somm',
    })
  })

  describe('getPositionDefinitions', () => {
    it('should return expected positions when called with supported networkId and address with position', async () => {
      jest.mocked(got).get = jest.fn().mockReturnValue({
        json: () =>
          Promise.resolve({
            result: {
              data: {
                cellars: [
                  {
                    id: '0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8-arbitrum',
                    shareValue: '1050000',
                    tvlTotal: 10000000,
                    chain: 'arbitrum',
                    dayDatas: mockDayDatas,
                  },
                ],
              },
            },
          }),
      })

      const sommPositions = await hook.getPositionDefinitions({
        networkId: NetworkId['arbitrum-one'],
        address: '0x12345',
        t: mockT,
      })

      expect(mockReadContract).toHaveBeenCalledTimes(5)
      expect(sommPositions).toEqual([
        {
          type: 'app-token-definition',
          pricePerShare: expect.any(Function),
          networkId: NetworkId['arbitrum-one'],
          address: '0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8', // cellar address
          tokens: [
            {
              address: '0xunderlyingasset',
              networkId: NetworkId['arbitrum-one'],
            },
          ],
          displayProps: expect.any(Function),
          dataProps: {
            cantSeparateCompoundedInterest: true,
            depositTokenId: 'arbitrum-one:0xunderlyingasset',
            earningItems: [],
            manageUrl:
              'https://app.somm.finance/strategies/real-yield-usd-arb/manage',
            termsUrl: 'https://app.somm.finance/user-terms',
            tvl: '10000000',
            withdrawTokenId:
              'arbitrum-one:0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8',
            yieldRates: [
              {
                label: 'yieldRates.netApyWithAverage',
                percentage: 9.90525301915644,
                tokenId: 'arbitrum-one:0xunderlyingasset',
              },
            ],
          },
          availableShortcutIds: ['deposit', 'withdraw'],
          shortcutTriggerArgs: expect.any(Function),
        },
      ])
      // @ts-expect-error - displayProps can be an object or function but here it is a function and does not require arguments
      expect(sommPositions[0].displayProps()).toEqual({
        title: 'Cellar Name',
        description: 'SYMBOL (APY: 9.91%)',
        imageUrl:
          'https://raw.githubusercontent.com/divvi-xyz/hooks/main/src/apps/somm/assets/somm.png',
        manageUrl:
          'https://app.somm.finance/strategies/real-yield-usd-arb/manage',
      })
    })

    it('should return an empty array when called with an unsupported networkId', async () => {
      const sommPositions = await hook.getPositionDefinitions({
        networkId: NetworkId['celo-alfajores'],
        address: '0x12345',
        t: mockT,
      })

      expect(sommPositions).toEqual([])
    })

    it('should return an empty array when called with an address that has no balance', async () => {
      jest.mocked(got).get = jest.fn().mockReturnValue({
        json: () =>
          Promise.resolve({
            result: {
              data: {
                cellars: [
                  {
                    id: '0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8-arbitrum',
                    shareValue: '1050000',
                    tvlTotal: 10000000,
                    chain: 'arbitrum',
                  },
                ],
              },
            },
          }),
      })

      const sommPositions = await hook.getPositionDefinitions({
        networkId: NetworkId['arbitrum-one'],
        address: '0xabcde',
        t: mockT,
      })

      expect(mockReadContract).toHaveBeenCalledTimes(1)
      expect(sommPositions).toEqual([])
    })

    it('should return definitions for positions even if some positions cannot be resolved', async () => {
      jest.mocked(got).get = jest.fn().mockReturnValue({
        json: () =>
          Promise.resolve({
            result: {
              data: {
                cellars: [
                  {
                    id: '0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8-arbitrum',
                    shareValue: '1050000',
                    tvlTotal: 10000000,
                    chain: 'arbitrum',
                  },
                  {
                    id: '0xc47bb288178ea40bf520a91826a3dee9e0dbfa4c-unknown', // mockReadContract will fail on this address
                    shareValue: '1050000',
                    tvlTotal: 10000000,
                    chain: 'arbitrum',
                  },
                ],
              },
            },
          }),
      })

      const sommPositions = await hook.getPositionDefinitions({
        networkId: NetworkId['arbitrum-one'],
        address: '0x12345',
        t: mockT,
      })

      expect(sommPositions).toEqual([
        {
          type: 'app-token-definition',
          pricePerShare: expect.any(Function),
          networkId: NetworkId['arbitrum-one'],
          address: '0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8', // cellar address
          tokens: [
            {
              address: '0xunderlyingasset',
              networkId: NetworkId['arbitrum-one'],
            },
          ],
          displayProps: expect.any(Function),
          dataProps: {
            cantSeparateCompoundedInterest: true,
            depositTokenId: 'arbitrum-one:0xunderlyingasset',
            earningItems: [],
            manageUrl:
              'https://app.somm.finance/strategies/real-yield-usd-arb/manage',
            termsUrl: 'https://app.somm.finance/user-terms',
            tvl: '10000000',
            withdrawTokenId:
              'arbitrum-one:0x392b1e6905bb8449d26af701cdea6ff47bf6e5a8',
            yieldRates: [], // no yield rates because dayDatas (which is needed to calculate apy) is not provided in the mocked data above
          },
          availableShortcutIds: ['deposit', 'withdraw'],
          shortcutTriggerArgs: expect.any(Function),
        },
      ])
    })
  })
})
