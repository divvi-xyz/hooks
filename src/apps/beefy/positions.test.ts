import { BaseBeefyVault } from './api'
import { getDailyYieldRatePercentage } from './positions'

const apyBreakdownWithCorrectComponents = {
  vaultApr: 0.1,
  clmApr: 0.2,
  tradingApr: 0.3,
}

const apyBreakdownWithIncorrectComponents = {
  unsupportedComponent: 0.1,
  totalApy: 0.5,
}

const vault: BaseBeefyVault = {
  type: 'gov',
  subType: 'cowcentrated',
} as BaseBeefyVault

describe('getDailyYieldRatePercentage', () => {
  it('should return the correct daily yield rate percentage when there are components', () => {
    const dailyYieldRatePercentage = getDailyYieldRatePercentage(
      apyBreakdownWithCorrectComponents,
      vault,
    )
    expect(dailyYieldRatePercentage).toBeCloseTo(0.164)
  })
  it('should return the correct daily yield rate percentage when there are no correct components', () => {
    const dailyYieldRatePercentage = getDailyYieldRatePercentage(
      apyBreakdownWithIncorrectComponents,
      vault,
    )
    expect(dailyYieldRatePercentage).toBeCloseTo(0.111)
  })
  it('should not include rewardPoolApr in the daily yield rate percentage for gov cowcentrated vault', () => {
    const dailyYieldRatePercentage = getDailyYieldRatePercentage(
      { ...apyBreakdownWithCorrectComponents, rewardPoolApr: 0.4 },
      vault,
    )
    expect(dailyYieldRatePercentage).toBeCloseTo(0.164)
  })
  it('should return 0 if totalApy is undefined and no components', () => {
    const dailyYieldRatePercentage = getDailyYieldRatePercentage({}, vault)
    expect(dailyYieldRatePercentage).toBe(0)
  })
  it('should ignore components that are NaN', () => {
    const dailyYieldRatePercentage = getDailyYieldRatePercentage(
      {
        ...apyBreakdownWithCorrectComponents,
        merklApr: NaN,
      },
      vault,
    )
    expect(dailyYieldRatePercentage).toBeCloseTo(0.164)
  })
})
