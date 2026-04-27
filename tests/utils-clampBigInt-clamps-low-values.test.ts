import { describe, expect, it } from 'vitest'
import { clampBigInt } from '../lib/utils'

describe('clampBigInt', () => {
  it('clamps values below the lower bound', () => {
    expect(clampBigInt(-5n, 0n, 10n)).toBe(0n)
  })
})
