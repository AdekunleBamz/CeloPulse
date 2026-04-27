import { describe, expect, it } from 'vitest'
import { nextTierThreshold } from '../lib/scores'

describe('nextTierThreshold', () => {
  it('returns silver threshold once bronze is reached', () => {
    expect(nextTierThreshold(1000)).toBe(4000)
  })
})
