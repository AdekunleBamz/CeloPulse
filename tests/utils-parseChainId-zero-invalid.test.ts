import { describe, expect, it } from 'vitest'
import { parseChainId } from '../lib/utils'

describe('parseChainId', () => {
  it('returns null for zero chain ids', () => {
    expect(parseChainId(0)).toBeNull()
  })
})
