import { describe, expect, it } from 'vitest'
import { weiToCelo } from '../lib/utils'

describe('weiToCelo', () => {
  it('returns zero for zero wei input', () => {
    expect(weiToCelo(0n)).toBe(0)
  })
})
