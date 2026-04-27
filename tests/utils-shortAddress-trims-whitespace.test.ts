import { describe, expect, it } from 'vitest'
import { shortAddress } from '../lib/utils'

describe('shortAddress', () => {
  it('trims surrounding whitespace before formatting', () => {
    expect(shortAddress('  0x1234567890abcdef1234567890abcdef12345678  ')).toBe('0x1234...5678')
  })
})
