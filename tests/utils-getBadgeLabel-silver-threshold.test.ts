import { describe, expect, it } from 'vitest'
import { getBadgeLabel } from '../lib/utils'

describe('getBadgeLabel', () => {
  it('returns silver at the 4,000-point threshold', () => {
    expect(getBadgeLabel(4000)).toBe('Silver')
  })
})
