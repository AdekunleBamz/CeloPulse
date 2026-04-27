import { describe, expect, it } from 'vitest'
import { truncateMiddle } from '../lib/utils'

describe('truncateMiddle', () => {
  it('returns a simple prefix when max is three or less', () => {
    expect(truncateMiddle('abcdef', 3)).toBe('abc')
  })
})
