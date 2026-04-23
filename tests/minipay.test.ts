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

  it('rejects malformed EVM addresses', () => {
    expect(isValidEvmAddress('0x1234')).toBe(false)
  })
})

describe('lib/minipay isSupportedChain', () => {
  it('accepts the active Celo chain', () => {
    expect(isSupportedChain(42220)).toBe(true)
  })
})

describe('lib/minipay isZeroAddress', () => {
  it('detects zero addresses with whitespace and casing', () => {
    expect(isZeroAddress('  0X0000000000000000000000000000000000000000  ')).toBe(true)
  })
})

describe('lib/minipay normalizeAddress', () => {
  it('trims and lowercases addresses', () => {
    expect(normalizeAddress('  0xABCDEFabcdefABCDEFabcdefABCDEFabcdefabcd  ')).toBe(
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    )
  })
})

describe('lib/minipay isSameAddress', () => {
  it('matches addresses regardless of casing', () => {
    expect(
      isSameAddress(
        '0x1234567890abcdef1234567890abcdef12345678',
        '0x1234567890ABCDEF1234567890ABCDEF12345678',
      ),
    ).toBe(true)
  })
})

describe('lib/minipay getCUSDAddress', () => {
  it('returns the mainnet USD stable token by default', () => {
    expect(getCUSDAddress()).toBe(USD_M_MAINNET_ADDRESS)
  })
})

describe('lib/minipay getCUSDSymbol', () => {
  it('returns the mainnet cUSD symbol by default', () => {
    expect(getCUSDSymbol()).toBe('cUSD')
  })
})

describe('lib/minipay formatAddress', () => {
  it('truncates MiniPay addresses for display', () => {
    expect(formatAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234...5678')
  })
})

describe('lib/minipay isMiniPayProvider', () => {
  it('detects MiniPay provider flags', () => {
    expect(isMiniPayProvider({ isMiniPay: true })).toBe(true)
  })
})

describe('lib/minipay isMiniPayWallet', () => {
  it('returns false when no window is available', () => {
    vi.stubGlobal('window', undefined)
    expect(isMiniPayWallet()).toBe(false)
  })
})

describe('lib/minipay explorer links', () => {
  it('trims addresses in explorer links', () => {
    expect(getAddressExplorerUrl('  0x123  ')).toBe('https://celoscan.io/address/0x123')
  })

  it('trims transaction hashes in explorer links', () => {
    expect(getTxExplorerUrl('  0xabc  ')).toBe('https://celoscan.io/tx/0xabc')
  })
})
