import { describe, expect, it } from 'vitest'
import { clamp } from '../lib/utils'

describe('clamp', () => {
  it('normalizes reversed min and max bounds', () => {
    expect(clamp(7, 10, 0)).toBe(7)
  })
})
