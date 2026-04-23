import { describe, expect, it } from 'vitest'
import {
  computeActivityRank,
  formatRank,
  getScoreTier,
  isMaxScore,
  nextTierThreshold,
  scoreToPercent,
} from '../lib/scores'
import {
  ABI_FUNCTION_NAMES,
  isReadFunction,
  isWriteFunction,
} from '../lib/abis'

describe('lib/scores getScoreTier', () => {
  it('returns gold for high scores', () => {
    expect(getScoreTier(8_000)).toBe('Gold')
  })

  it('returns newcomer for low scores', () => {
    expect(getScoreTier(999)).toBe('Newcomer')
  })
})

describe('lib/scores formatRank', () => {
  it('formats first place ranks', () => {
    expect(formatRank(1)).toBe('#1')
  })
})

describe('lib/scores computeActivityRank', () => {
  it('returns zero when max score is unavailable', () => {
    expect(computeActivityRank(500, 0)).toBe(0)
  })
})
