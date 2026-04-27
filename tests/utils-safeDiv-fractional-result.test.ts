import { describe, expect, it } from 'vitest'
import { safeDiv } from '../lib/utils'

describe('safeDiv', () => {
  it('returns fractional division results for non-zero divisors', () => {
    expect(safeDiv(1, 4)).toBe(0.25)
  })
})
