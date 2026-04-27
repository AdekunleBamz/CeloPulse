import { describe, expect, it } from 'vitest'
import { minBigInt } from '../lib/utils'

describe('minBigInt', () => {
  it('returns the smaller bigint value', () => {
    expect(minBigInt(4n, 9n)).toBe(4n)
  })
})
