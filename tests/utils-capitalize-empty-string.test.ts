import { describe, expect, it } from 'vitest'
import { capitalize } from '../lib/utils'

describe('capitalize', () => {
  it('returns an empty string when input is empty', () => {
    expect(capitalize('')).toBe('')
  })
})
