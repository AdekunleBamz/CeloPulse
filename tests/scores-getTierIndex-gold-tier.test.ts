import { describe, expect, it } from 'vitest'
import { getTierIndex } from '../lib/scores'

describe('getTierIndex', () => {
  it('returns index 3 for gold-tier scores', () => {
    expect(getTierIndex(8000)).toBe(3)
  })
})
