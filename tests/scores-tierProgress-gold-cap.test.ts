import { describe, expect, it } from 'vitest'
import { tierProgress } from '../lib/scores'

describe('tierProgress', () => {
  it('returns 100 for gold-tier scores', () => {
    expect(tierProgress(9000)).toBe(100)
  })
})
