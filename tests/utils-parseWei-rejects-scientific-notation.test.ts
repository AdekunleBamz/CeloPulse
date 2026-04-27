import { describe, expect, it } from 'vitest'
import { parseWei } from '../lib/utils'

describe('parseWei', () => {
  it('returns zero for scientific notation inputs', () => {
    expect(parseWei('1e3')).toBe(0n)
  })
})
