import { describe, expect, it } from 'vitest'
import { parseChainId } from '../lib/utils'

describe('parseChainId', () => {
  it('returns null for non-integer chain id values', () => {
    expect(parseChainId(42220.5)).toBeNull()
  })
})
