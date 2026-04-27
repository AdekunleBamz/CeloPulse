import { describe, expect, it } from 'vitest'
import { formatWei } from '../lib/utils'

describe('formatWei', () => {
  it('formats zero wei amounts as zero with decimals', () => {
    expect(formatWei(0n)).toBe('0.0000')
  })
})
