import { describe, expect, it } from 'vitest'
import { formatRank } from '../lib/scores'

describe('formatRank', () => {
  it('formats non-first positive ranks with hash prefix', () => {
    expect(formatRank(2)).toBe('#2')
  })
})
