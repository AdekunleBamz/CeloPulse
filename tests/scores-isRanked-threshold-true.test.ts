import { describe, expect, it } from 'vitest'
import { isRanked } from '../lib/scores'

describe('isRanked', () => {
  it('returns true at the bronze threshold', () => {
    expect(isRanked(1000)).toBe(true)
  })
})
