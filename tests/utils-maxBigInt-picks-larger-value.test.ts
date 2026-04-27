import { describe, expect, it } from 'vitest'
import { maxBigInt } from '../lib/utils'

describe('maxBigInt', () => {
  it('returns the larger bigint value', () => {
    expect(maxBigInt(4n, 9n)).toBe(9n)
  })
})
