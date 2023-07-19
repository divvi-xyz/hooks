export const poolV205Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_inboundCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_maxFlexibleSegmentPaymentAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: '_depositCount',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_segmentLength',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_waitingRoundSegmentLength',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: '_segmentPayment',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: '_earlyWithdrawalFee',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_customFee',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_maxPlayersCount',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: '_flexibleSegmentPayment',
        type: 'bool',
      },
      {
        internalType: 'contract IStrategy',
        name: '_strategy',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_isTransactionalToken',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ADMIN_FEE_WITHDRAWN',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DEPOSIT_NOT_ALLOWED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EARLY_EXIT_NOT_POSSIBLE',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GAME_ALREADY_INITIALIZED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GAME_ALREADY_STARTED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GAME_COMPLETED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GAME_NOT_COMPLETED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GAME_NOT_INITIALIZED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_CUSTOM_FEE',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_DEPOSIT_COUNT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_EARLY_WITHDRAW_FEE',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_FLEXIBLE_AMOUNT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_INBOUND_TOKEN',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_INCENTIVE_TOKEN',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_MAX_FLEXIBLE_AMOUNT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_MAX_PLAYER_COUNT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_NET_DEPOSIT_AMOUNT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_OWNER',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_SEGMENT_LENGTH',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_SEGMENT_PAYMENT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_STRATEGY',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_TRANSACTIONAL_TOKEN_AMOUNT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_TRANSACTIONAL_TOKEN_SENDER',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_WAITING_ROUND_SEGMENT_LENGTH',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MAX_PLAYER_COUNT_REACHED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NOT_PLAYER',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PLAYER_ALREADY_JOINED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PLAYER_ALREADY_PAID_IN_CURRENT_SEGMENT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PLAYER_ALREADY_WITHDREW',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PLAYER_ALREADY_WITHDREW_EARLY',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PLAYER_DID_NOT_PAID_PREVIOUS_SEGMENT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PLAYER_DOES_NOT_EXIST',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RENOUNCE_OWNERSHIP_NOT_ALLOWED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TOKEN_TRANSFER_FAILURE',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TRANSACTIONAL_TOKEN_TRANSFER_FAILURE',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'adminFeeAmounts',
        type: 'uint256[]',
      },
    ],
    name: 'AdminFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalGameInterest',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'adminIncentiveAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'adminFeeAmounts',
        type: 'uint256[]',
      },
    ],
    name: 'AdminWithdrawal',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'currentSegment',
        type: 'uint64',
      },
    ],
    name: 'ClaimRewardTokensDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'segment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'playerIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cumulativePlayerIndexSum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalWinnerDepositsPerSegment',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalGamePrincipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netTotalGamePrincipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositedNetAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cumulativePlayerIndexSum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalWinnerDepositsPerSegment',
        type: 'uint256',
      },
    ],
    name: 'EarlyWithdrawal',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'currentSegment',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'oldFee',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'newFee',
        type: 'uint64',
      },
    ],
    name: 'EarlyWithdrawalFeeChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'currentSegment',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'winnerCount',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'depositRoundInterestSharePercentage',
        type: 'uint64',
      },
    ],
    name: 'EmergencyWithdrawalEnabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalGamePrincipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netTotalGamePricipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalGameInterest',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'grossRewardTokenAmount',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalIncentiveAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'impermanentLossShare',
        type: 'uint256',
      },
    ],
    name: 'EndGameStats',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'reason',
        type: 'bytes',
      },
    ],
    name: 'ExternalTokenGetBalanceError',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'reason',
        type: 'bytes',
      },
    ],
    name: 'ExternalTokenTransferError',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'IncentiveTokenSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'firstSegmentStart',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'waitingRoundSegmentStart',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'playerIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cumulativePlayerIndexSum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalWinnerDepositsPerSegment',
        type: 'uint256',
      },
    ],
    name: 'JoinedGame',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalGamePrincipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netTotalGamePrincipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalGameInterest',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalIncentiveAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'totalRewardAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'impermanentLossShare',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cumulativePlayerIndexSum',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalWinnerDepositsPerSegment',
        type: 'uint256',
      },
    ],
    name: 'UpdateGameStats',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawInboundTokens',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawIncentiveToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    name: 'WithdrawRewardTokens',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MULTIPLIER',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'activePlayersCount',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminFee',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'adminFeeAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminFeeSet',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminWithdraw',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allowRenouncingOwnership',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'cumulativePlayerIndexSum',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositCount',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositRoundInterestSharePercentage',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'disableRewardTokenClaim',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'earlyWithdrawalFee',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'firstSegmentStart',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'flexibleSegmentPayment',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'impermanentLossShare',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'inboundToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'incentiveToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isTransactionalToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'iterablePlayers',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxFlexibleSegmentPaymentAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxPlayersCount',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'netTotalGamePrincipal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'playerIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'players',
    outputs: [
      {
        internalType: 'bool',
        name: 'withdrawn',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'canRejoin',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isWinner',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'withdrawalSegment',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'mostRecentSegmentPaid',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'amountPaid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'netAmountPaid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'depositAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'rewardTokenAmounts',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'rewardTokens',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'segmentCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'segmentLength',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'segmentPayment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strategy',
    outputs: [
      {
        internalType: 'contract IStrategy',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalGameInterest',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalGamePrincipal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalIncentiveAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'totalWinnerDepositsPerSegment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'waitingRoundSegmentLength',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'waitingRoundSegmentStart',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'winnerCount',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'winnersLeftToWithdraw',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    inputs: [],
    name: 'isGameCompleted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_player',
        type: 'address',
      },
    ],
    name: 'isWinner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNumberOfPlayers',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentSegment',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isInitialized',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_incentiveToken',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'enableEmergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_incentiveToken',
        type: 'address',
      },
    ],
    name: 'setIncentiveToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'disableClaimingRewardTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unlockRenounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '_newEarlyWithdrawFee',
        type: 'uint64',
      },
    ],
    name: 'lowerEarlyWithdrawFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minAmount',
        type: 'uint256',
      },
    ],
    name: 'adminFeeWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_depositAmount',
        type: 'uint256',
      },
    ],
    name: 'joinGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minAmount',
        type: 'uint256',
      },
    ],
    name: 'earlyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minAmount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_depositAmount',
        type: 'uint256',
      },
    ],
    name: 'makeDeposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
