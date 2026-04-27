import { describe, expect, it } from 'vitest'
import { computeActivityRank } from '../lib/scores'

describe('computeActivityRank', () => {
  it('caps activity rank at one hundred', () => {
    expect(computeActivityRank(200, 100)).toBe(100)
  })
})
