import { describe, expect, it } from 'vitest'
import { isEmptyAddress } from '../lib/utils'

describe('isEmptyAddress', () => {
  it('treats zero addresses with whitespace as empty', () => {
    expect(isEmptyAddress('  0x0000000000000000000000000000000000000000  ')).toBe(true)
  })
})
