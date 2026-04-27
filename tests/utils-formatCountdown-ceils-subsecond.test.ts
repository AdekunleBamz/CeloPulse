import { describe, expect, it } from 'vitest'
import { formatCountdown } from '../lib/utils'

describe('formatCountdown', () => {
  it('rounds up partial seconds when rendering countdown text', () => {
    expect(formatCountdown(1500)).toBe('2s')
  })
})
