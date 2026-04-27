import { describe, expect, it } from 'vitest'
import { scoreToPercent } from '../lib/scores'

describe('scoreToPercent', () => {
  it('rounds fractional percentages to nearest integer', () => {
    expect(scoreToPercent(1, 3)).toBe(33)
  })
})
