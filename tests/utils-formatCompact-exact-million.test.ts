import { describe, expect, it } from 'vitest'
import { formatCompact } from '../lib/utils'

describe('formatCompact', () => {
  it('formats exact million values with M suffix', () => {
    expect(formatCompact(1_000_000)).toBe('1.0M')
  })
})
