import { describe, expect, it } from 'vitest'
import { formatCompact } from '../lib/utils'

describe('formatCompact', () => {
  it('formats exact thousand values with K suffix', () => {
    expect(formatCompact(1000)).toBe('1.0K')
  })
})
