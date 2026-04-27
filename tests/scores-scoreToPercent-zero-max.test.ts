import { describe, expect, it } from 'vitest'
import { scoreToPercent } from '../lib/scores'

describe('scoreToPercent', () => {
  it('returns zero when max score is zero', () => {
    expect(scoreToPercent(500, 0)).toBe(0)
  })
})
