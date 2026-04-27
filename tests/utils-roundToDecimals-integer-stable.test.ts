import { describe, expect, it } from 'vitest'
import { roundToDecimals } from '../lib/utils'

describe('roundToDecimals', () => {
  it('leaves integer values unchanged', () => {
    expect(roundToDecimals(5, 3)).toBe(5)
  })
})
