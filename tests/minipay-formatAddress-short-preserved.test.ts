import { describe, expect, it } from 'vitest'
import { formatAddress } from '../lib/minipay'

describe('formatAddress', () => {
  it('keeps already-short addresses unchanged', () => {
    expect(formatAddress('0x1234')).toBe('0x1234')
  })
})
