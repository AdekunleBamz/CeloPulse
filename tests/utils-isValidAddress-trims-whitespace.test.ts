import { describe, expect, it } from 'vitest'
import { isValidAddress } from '../lib/utils'

describe('isValidAddress', () => {
  it('accepts valid addresses with surrounding whitespace', () => {
    expect(isValidAddress('  0x1234567890abcdef1234567890abcdef12345678  ')).toBe(true)
  })
})
