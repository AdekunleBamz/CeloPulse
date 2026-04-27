import { describe, expect, it } from 'vitest'
import { formatDuration } from '../lib/utils'

describe('formatDuration', () => {
  it('renders zero milliseconds as zero seconds', () => {
    expect(formatDuration(0)).toBe('0s')
  })
})
