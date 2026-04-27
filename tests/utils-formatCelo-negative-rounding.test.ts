import { describe, expect, it } from 'vitest'
import { formatCelo } from '../lib/utils'

describe('formatCelo', () => {
  it('rounds negative values to four decimals', () => {
    expect(formatCelo(-1.23456)).toBe('-1.2346')
  })
})
