import { describe, expect, it } from 'vitest'
import { isSameAddress } from '../lib/minipay'

describe('isSameAddress', () => {
  it('returns false when either address is missing', () => {
    expect(isSameAddress('', '0x1234567890abcdef1234567890abcdef12345678')).toBe(false)
  })
})
