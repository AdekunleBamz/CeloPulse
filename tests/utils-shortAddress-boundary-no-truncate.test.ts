import { describe, expect, it } from 'vitest'
import { shortAddress } from '../lib/utils'

describe('shortAddress', () => {
  it('keeps 10-character addresses unchanged', () => {
    expect(shortAddress('0x12345678')).toBe('0x12345678')
  })
})
