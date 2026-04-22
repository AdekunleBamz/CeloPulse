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

describe('lib/utils weiToCelo', () => {
  it('converts whole CELO values from wei', () => {
    expect(weiToCelo(2_000_000_000_000_000_000n)).toBe(2)
  })

  it('converts fractional CELO values from wei', () => {
    expect(weiToCelo(1_250_000_000_000_000_000n)).toBe(1.25)
  })
})

describe('lib/utils isZeroAddress', () => {
  it('detects zero addresses with whitespace and casing', () => {
    expect(isZeroAddress('  0X0000000000000000000000000000000000000000  ')).toBe(true)
  })

  it('rejects non-zero addresses', () => {
    expect(isZeroAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(false)
  })
})

describe('lib/utils clamp', () => {
  it('raises values below the lower bound', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('lowers values above the upper bound', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('keeps values already inside bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
})

describe('lib/utils formatTimestamp', () => {
  it('returns an empty string for invalid timestamps', () => {
    expect(formatTimestamp(0)).toBe('')
  })
})

describe('lib/utils isValidAddress', () => {
  it('accepts valid non-zero EVM addresses', () => {
    expect(isValidAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
  })
})
