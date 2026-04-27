import { describe, expect, it } from 'vitest'
import { isEmptyAddress } from '../lib/utils'

describe('isEmptyAddress', () => {
  it('returns false for non-zero addresses', () => {
    expect(isEmptyAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(false)
  })
})
