import { describe, expect, it } from 'vitest'
import {
  addWei,
  capitalize,
  celoToWei,
  clamp,
  clampBigInt,
  computeStreakBonus,
  formatCelo,
  formatCompact,
  formatCountdown,
  formatDate,
  formatDuration,
  formatPercent,
  formatScore,
  formatTimestamp,
  formatWei,
  getBadgeLabel,
  hasSufficientBalance,
  isBigIntZero,
  isEmptyAddress,
  isPositiveNumber,
  isSameDay,
  isValidAddress,
  isZeroAddress,
  maxBigInt,
  minBigInt,
  parseChainId,
  parseWei,
  pluralize,
  roundToDecimals,
  safeDiv,
  shortAddress,
  subWeiSafe,
  truncate,
  truncateMiddle,
  weiToCelo,
} from '../lib/utils'

describe('lib/utils shortAddress', () => {
  it('truncates long addresses for display', () => {
    expect(shortAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234...5678')
  })

  it('returns an empty string for blank addresses', () => {
    expect(shortAddress('   ')).toBe('')
  })

  it('leaves short addresses unchanged', () => {
    expect(shortAddress('0x1234')).toBe('0x1234')
  })
})

describe('lib/utils formatCelo', () => {
  it('formats CELO values to four decimals', () => {
    expect(formatCelo(1.23456)).toBe('1.2346')
  })
})
