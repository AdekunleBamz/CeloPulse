import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CUSD_SEPOLIA_ADDRESS,
  USD_M_MAINNET_ADDRESS,
  formatAddress,
  getAddressExplorerUrl,
  getCUSDAddress,
  getCUSDSymbol,
  getNetworkType,
  getTxExplorerUrl,
  isMiniPayProvider,
  isMiniPayWallet,
  isSameAddress,
  isSupportedChain,
  isValidEvmAddress,
  isZeroAddress,
  normalizeAddress,
} from '../lib/minipay'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('lib/minipay isValidEvmAddress', () => {
  it('accepts valid EVM addresses', () => {
    expect(isValidEvmAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
  })
})
