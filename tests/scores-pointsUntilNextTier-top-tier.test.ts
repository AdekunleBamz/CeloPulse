import { describe, expect, it } from 'vitest'
import { pointsUntilNextTier } from '../lib/scores'

describe('pointsUntilNextTier', () => {
  it('returns zero for users already in the top tier', () => {
    expect(pointsUntilNextTier(9000)).toBe(0)
  })
})
