import { describe, expect, it } from 'vitest'
import { celoToWei } from '../lib/utils'

describe('celoToWei', () => {
  it('rounds to nearest wei for fractional CELO values', () => {
    expect(celoToWei(0.000000000000000001)).toBe(1n)
  })
})
