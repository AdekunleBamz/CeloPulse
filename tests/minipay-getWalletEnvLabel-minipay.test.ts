import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWalletEnvLabel } from '../lib/minipay'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getWalletEnvLabel', () => {
  it('returns MiniPay when ethereum provider is flagged', () => {
    vi.stubGlobal('window', { ethereum: { isMiniPay: true } })
    expect(getWalletEnvLabel()).toBe('MiniPay')
  })
})
