import { describe, expect, it } from 'vitest'
import { isSameDay } from '../lib/utils'

describe('isSameDay', () => {
  it('returns false for timestamps on different dates', () => {
    expect(isSameDay(new Date(2026, 0, 1).getTime(), new Date(2026, 0, 2).getTime())).toBe(false)
  })
})
