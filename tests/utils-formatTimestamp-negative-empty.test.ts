import { describe, expect, it } from 'vitest'
import { formatTimestamp } from '../lib/utils'

describe('formatTimestamp', () => {
  it('returns an empty string for negative timestamps', () => {
    expect(formatTimestamp(-10)).toBe('')
  })
})
