import { describe, expect, it } from 'vitest'
import { formatDate } from '../lib/utils'

describe('formatDate', () => {
  it('returns a non-empty date string for valid timestamps', () => {
    expect(formatDate(new Date(2026, 0, 1).getTime()).length).toBeGreaterThan(0)
  })
})
