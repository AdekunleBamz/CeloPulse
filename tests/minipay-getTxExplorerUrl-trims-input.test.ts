import { describe, expect, it } from 'vitest'
import { getTxExplorerUrl } from '../lib/minipay'

describe('getTxExplorerUrl', () => {
  it('trims tx hashes before creating explorer links', () => {
    expect(getTxExplorerUrl(' 0xdef ')).toBe('https://celoscan.io/tx/0xdef')
  })
})
