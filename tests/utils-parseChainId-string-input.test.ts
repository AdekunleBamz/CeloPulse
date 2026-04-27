import { describe, expect, it } from 'vitest'
import { parseChainId } from '../lib/utils'

describe('parseChainId', () => {
  it('parses integer-like string values', () => {
    expect(parseChainId('42220')).toBe(42220)
  })
})
