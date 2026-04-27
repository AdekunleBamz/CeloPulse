import { describe, expect, it } from 'vitest'
import { isMiniPayProvider } from '../lib/minipay'

describe('isMiniPayProvider', () => {
  it('returns false for null providers', () => {
    expect(isMiniPayProvider(null)).toBe(false)
  })
})
