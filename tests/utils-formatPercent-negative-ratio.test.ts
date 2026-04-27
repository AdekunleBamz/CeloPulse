import { describe, expect, it } from 'vitest'
import { formatPercent } from '../lib/utils'

describe('formatPercent', () => {
  it('formats negative ratios with sign preserved', () => {
    expect(formatPercent(-0.5, 0)).toBe('-50%')
  })
})
