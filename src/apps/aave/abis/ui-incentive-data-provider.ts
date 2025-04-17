// From https://docs.aave.com/developers/periphery-contracts/uiincentivedataproviderv3
export const uiIncentiveDataProviderV3Abi = [
  {
    inputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
      { internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'getFullReservesIncentiveData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'underlyingAsset', type: 'address' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionPerSecond',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'incentivesLastUpdateTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionEndTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                  { internalType: 'uint8', name: 'precision', type: 'uint8' },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                name: 'rewardsTokenInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            name: 'aIncentiveData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionPerSecond',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'incentivesLastUpdateTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionEndTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                  { internalType: 'uint8', name: 'precision', type: 'uint8' },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                name: 'rewardsTokenInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            name: 'vIncentiveData',
            type: 'tuple',
          },
        ],
        internalType:
          'struct IUiIncentiveDataProviderV3.AggregatedReserveIncentiveData[]',
        name: '',
        type: 'tuple[]',
      },
      {
        components: [
          { internalType: 'address', name: 'underlyingAsset', type: 'address' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'userUnclaimedRewards',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesUserIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                ],
                internalType:
                  'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                name: 'userRewardsInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            name: 'aTokenIncentivesUserData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'userUnclaimedRewards',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesUserIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                ],
                internalType:
                  'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                name: 'userRewardsInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            name: 'vTokenIncentivesUserData',
            type: 'tuple',
          },
        ],
        internalType:
          'struct IUiIncentiveDataProviderV3.UserReserveIncentiveData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
    ],
    name: 'getReservesIncentivesData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'underlyingAsset', type: 'address' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionPerSecond',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'incentivesLastUpdateTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionEndTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                  { internalType: 'uint8', name: 'precision', type: 'uint8' },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                name: 'rewardsTokenInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            name: 'aIncentiveData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionPerSecond',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'incentivesLastUpdateTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'emissionEndTimestamp',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                  { internalType: 'uint8', name: 'precision', type: 'uint8' },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                ],
                internalType: 'struct IUiIncentiveDataProviderV3.RewardInfo[]',
                name: 'rewardsTokenInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.IncentiveData',
            name: 'vIncentiveData',
            type: 'tuple',
          },
        ],
        internalType:
          'struct IUiIncentiveDataProviderV3.AggregatedReserveIncentiveData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
      { internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'getUserReservesIncentivesData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'underlyingAsset', type: 'address' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'userUnclaimedRewards',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesUserIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                ],
                internalType:
                  'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                name: 'userRewardsInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            name: 'aTokenIncentivesUserData',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'incentiveControllerAddress',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'rewardTokenSymbol',
                    type: 'string',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardOracleAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'rewardTokenAddress',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'userUnclaimedRewards',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'tokenIncentivesUserIndex',
                    type: 'uint256',
                  },
                  {
                    internalType: 'int256',
                    name: 'rewardPriceFeed',
                    type: 'int256',
                  },
                  {
                    internalType: 'uint8',
                    name: 'priceFeedDecimals',
                    type: 'uint8',
                  },
                  {
                    internalType: 'uint8',
                    name: 'rewardTokenDecimals',
                    type: 'uint8',
                  },
                ],
                internalType:
                  'struct IUiIncentiveDataProviderV3.UserRewardInfo[]',
                name: 'userRewardsInformation',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct IUiIncentiveDataProviderV3.UserIncentiveData',
            name: 'vTokenIncentivesUserData',
            type: 'tuple',
          },
        ],
        internalType:
          'struct IUiIncentiveDataProviderV3.UserReserveIncentiveData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
