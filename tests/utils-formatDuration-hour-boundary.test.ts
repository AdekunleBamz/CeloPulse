import { describe, expect, it } from 'vitest'
import { formatDuration } from '../lib/utils'

describe('formatDuration', () => {
  it('shows hour output at exact hour boundaries', () => {
    expect(formatDuration(3_600_000)).toBe('1h 0m')
  })
})
