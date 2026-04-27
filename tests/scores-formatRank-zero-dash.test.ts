import { describe, expect, it } from 'vitest'
import { formatRank } from '../lib/scores'

describe('formatRank', () => {
  it('returns a dash for non-positive rank values', () => {
    expect(formatRank(0)).toBe('-')
  })
})
