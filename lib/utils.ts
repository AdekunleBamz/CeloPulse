/**
 * Utility helpers for CeloPulse UI formatting and validation.
 */

/**
 * Truncates an EVM address to short form: 0xabcd...1234
 * @param addr - Full address string.
 */
export function shortAddress(addr: string): string {
  if (addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

/**
 * Formats a CELO balance (as number) to a display string with 4 decimal places.
 * @param amount - Amount in CELO.
 */
export function formatCelo(amount: number): string {
  return amount.toFixed(4)
}

/**
 * Converts wei (bigint) to CELO as a number (divides by 1e18).
 * @param wei - Amount in wei.
 */
export function weiToCelo(wei: bigint): number {
  return Number(wei) / 1e18
}

/**
 * Returns true if the given address is the EVM zero address.
 * @param addr - Address string to check.
 */
export function isZeroAddress(addr: string): boolean {
  return addr === '0x0000000000000000000000000000000000000000'
}

/**
 * Clamps a number between min and max values.
 * @param value - The number to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
