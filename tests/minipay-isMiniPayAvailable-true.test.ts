import { afterEach, describe, expect, it, vi } from 'vitest'
import { isMiniPayAvailable } from '../lib/minipay'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isMiniPayAvailable', () => {
  it('returns true when MiniPay provider is present', () => {
    vi.stubGlobal('window', { ethereum: { isMiniPay: true } })
    expect(isMiniPayAvailable()).toBe(true)
  })
})
