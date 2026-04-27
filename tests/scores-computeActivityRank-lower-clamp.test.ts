import { describe, expect, it } from 'vitest'
import { computeActivityRank } from '../lib/scores'

describe('computeActivityRank', () => {
  it('floors negative activity ranks at zero', () => {
    expect(computeActivityRank(-10, 100)).toBe(0)
  })
})
