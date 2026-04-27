import { describe, expect, it } from 'vitest'
import { isValidEvmAddress } from '../lib/minipay'

describe('isValidEvmAddress', () => {
  it('accepts valid addresses with surrounding whitespace', () => {
    expect(isValidEvmAddress('  0x1234567890abcdef1234567890abcdef12345678  ')).toBe(true)
  })
})
