import { describe, expect, it } from 'vitest'
import { isSupportedChain } from '../lib/minipay'

describe('isSupportedChain', () => {
  it('returns false for unsupported chain ids', () => {
    expect(isSupportedChain(1)).toBe(false)
  })
})
