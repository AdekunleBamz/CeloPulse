import { describe, expect, it } from 'vitest'
import { parseWei } from '../lib/utils'

describe('parseWei', () => {
  it('returns zero for negative token amounts', () => {
    expect(parseWei('-1.2')).toBe(0n)
  })
})
