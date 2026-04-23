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

  it('rejects the zero address', () => {
    expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(false)
  })

  it('rejects uppercase address prefixes', () => {
    expect(isValidAddress('0X1234567890abcdef1234567890abcdef12345678')).toBe(false)
  })
})

describe('lib/utils pluralize', () => {
  it('uses singular labels for one item', () => {
    expect(pluralize(1, 'quest')).toBe('quest')
  })

  it('uses default plural labels for other counts', () => {
    expect(pluralize(2, 'quest')).toBe('quests')
  })

  it('uses custom plural labels when provided', () => {
    expect(pluralize(0, 'entry', 'entries')).toBe('entries')
  })
})

describe('lib/utils celoToWei', () => {
  it('converts one CELO to wei', () => {
    expect(celoToWei(1)).toBe(1_000_000_000_000_000_000n)
  })

  it('converts fractional CELO to wei', () => {
    expect(celoToWei(1.5)).toBe(1_500_000_000_000_000_000n)
  })
})

describe('lib/utils formatPercent', () => {
  it('formats ratios with one decimal by default', () => {
    expect(formatPercent(0.1234)).toBe('12.3%')
  })

  it('supports custom percentage precision', () => {
    expect(formatPercent(0.1234, 2)).toBe('12.34%')
  })
})

describe('lib/utils formatCompact', () => {
  it('formats million-scale values compactly', () => {
    expect(formatCompact(1_200_000)).toBe('1.2M')
  })

  it('formats thousand-scale values compactly', () => {
    expect(formatCompact(2_500)).toBe('2.5K')
  })
})

describe('lib/utils hasSufficientBalance', () => {
  it('accepts balances equal to the requested amount', () => {
    expect(hasSufficientBalance(10n, 10n)).toBe(true)
  })

  it('rejects balances below the requested amount', () => {
    expect(hasSufficientBalance(9n, 10n)).toBe(false)
  })
})

describe('lib/utils formatWei', () => {
  it('formats wei with four decimals by default', () => {
    expect(formatWei(1_234_567_000_000_000_000n)).toBe('1.2346')
  })

  it('supports custom wei display precision', () => {
    expect(formatWei(1_234_567_000_000_000_000n, 2)).toBe('1.23')
  })
})

describe('lib/utils formatScore', () => {
  it('adds locale separators to scores', () => {
    expect(formatScore(1234567)).toBe('1,234,567')
  })
})

describe('lib/utils formatDuration', () => {
  it('formats sub-minute durations in seconds', () => {
    expect(formatDuration(45_000)).toBe('45s')
  })

  it('formats minute durations with remaining seconds', () => {
    expect(formatDuration(125_000)).toBe('2m 5s')
  })

  it('formats hour durations with remaining minutes', () => {
    expect(formatDuration(7_500_000)).toBe('2h 5m')
  })
})

describe('lib/utils isPositiveNumber', () => {
  it('accepts finite positive numbers', () => {
    expect(isPositiveNumber(1)).toBe(true)
  })

  it('rejects non-finite numbers', () => {
    expect(isPositiveNumber(Number.POSITIVE_INFINITY)).toBe(false)
  })
})

describe('lib/utils truncate', () => {
  it('leaves short strings unchanged', () => {
    expect(truncate('pulse', 10)).toBe('pulse')
  })

  it('adds ellipses to long strings', () => {
    expect(truncate('celopulse', 4)).toBe('celo...')
  })
})

describe('lib/utils parseWei', () => {
  it('parses whole CELO strings to wei', () => {
    expect(parseWei('2')).toBe(2_000_000_000_000_000_000n)
  })

  it('parses fractional CELO strings to wei', () => {
    expect(parseWei('1.25')).toBe(1_250_000_000_000_000_000n)
  })

  it('parses leading decimal CELO strings to wei', () => {
    expect(parseWei('.5')).toBe(500_000_000_000_000_000n)
  })

  it('returns zero for invalid CELO strings', () => {
    expect(parseWei('bad')).toBe(0n)
  })
})

describe('lib/utils safeDiv', () => {
  it('divides normal numbers', () => {
    expect(safeDiv(10, 2)).toBe(5)
  })

  it('returns zero when dividing by zero', () => {
    expect(safeDiv(10, 0)).toBe(0)
  })
})

describe('lib/utils isBigIntZero', () => {
  it('detects zero bigint values', () => {
    expect(isBigIntZero(0n)).toBe(true)
  })
})

describe('lib/utils addWei', () => {
  it('adds wei amounts', () => {
    expect(addWei(2n, 3n)).toBe(5n)
  })
})

describe('lib/utils subWeiSafe', () => {
  it('subtracts wei amounts when possible', () => {
    expect(subWeiSafe(5n, 3n)).toBe(2n)
  })

  it('floors unsafe wei subtraction at zero', () => {
    expect(subWeiSafe(3n, 5n)).toBe(0n)
  })
})

describe('lib/utils formatDate', () => {
  it('returns an empty string for invalid dates', () => {
    expect(formatDate(0)).toBe('')
  })
})

describe('lib/utils roundToDecimals', () => {
  it('rounds numbers to requested decimals', () => {
    expect(roundToDecimals(1.234, 2)).toBe(1.23)
  })
})

describe('lib/utils capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('pulse')).toBe('Pulse')
  })
})

describe('lib/utils computeStreakBonus', () => {
  it('computes streak bonuses from basis points', () => {
    expect(computeStreakBonus(20, 500)).toBe(1)
  })
})

describe('lib/utils getBadgeLabel', () => {
  it('returns gold labels for high scores', () => {
    expect(getBadgeLabel(8000)).toBe('Gold')
  })

  it('returns newcomer labels for low scores', () => {
    expect(getBadgeLabel(999)).toBe('Newcomer')
  })
})

describe('lib/utils formatCountdown', () => {
  it('returns ready for elapsed countdowns', () => {
    expect(formatCountdown(0)).toBe('Ready')
  })

  it('formats countdowns in minutes and seconds', () => {
    expect(formatCountdown(125_000)).toBe('2m 5s')
  })
})

describe('lib/utils isSameDay', () => {
  it('matches timestamps from the same calendar day', () => {
    expect(isSameDay(Date.UTC(2026, 0, 1, 1), Date.UTC(2026, 0, 1, 23))).toBe(true)
  })
})

describe('lib/utils truncateMiddle', () => {
  it('truncates long strings through the middle', () => {
    expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcde...vwxyz')
  })

  it('respects very small maximum lengths', () => {
    expect(truncateMiddle('abcdef', 3)).toBe('abc')
  })
})

describe('lib/utils clampBigInt', () => {
  it('raises bigint values below the lower bound', () => {
    expect(clampBigInt(-1n, 0n, 10n)).toBe(0n)
  })

  it('lowers bigint values above the upper bound', () => {
    expect(clampBigInt(11n, 0n, 10n)).toBe(10n)
  })
})

describe('lib/utils maxBigInt', () => {
  it('returns the larger bigint value', () => {
    expect(maxBigInt(3n, 5n)).toBe(5n)
  })
})

describe('lib/utils minBigInt', () => {
  it('returns the smaller bigint value', () => {
    expect(minBigInt(3n, 5n)).toBe(3n)
  })
})
