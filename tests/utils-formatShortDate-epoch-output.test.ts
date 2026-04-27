import { describe, expect, it } from 'vitest'
import { formatShortDate } from '../lib/utils'

describe('formatShortDate', () => {
  it('formats epoch date as month/day', () => {
    expect(formatShortDate(0)).toBe('1/1')
  })
})
