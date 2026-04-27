import { describe, expect, it } from 'vitest'
import { formatPercent } from '../lib/utils'

describe('formatPercent', () => {
  it('formats zero ratio with default precision', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })
})
