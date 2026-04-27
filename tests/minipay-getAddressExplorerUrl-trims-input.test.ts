import { describe, expect, it } from 'vitest'
import { getAddressExplorerUrl } from '../lib/minipay'

describe('getAddressExplorerUrl', () => {
  it('trims address input before building explorer links', () => {
    expect(getAddressExplorerUrl(' 0xabc ')).toBe('https://celoscan.io/address/0xabc')
  })
})
