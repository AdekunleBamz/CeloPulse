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

/**
 * Formats a Unix timestamp (seconds) as a locale date string.
 * @param ts - Unix timestamp in seconds.
 */
export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString()
}

/**
 * Returns true if the address is a valid non-zero EVM address.
 * @param addr - Address string to validate.
 */
export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr) && addr !== '0x0000000000000000000000000000000000000000'
}

/**
 * Pluralizes a noun based on count.
 * @param count - The number to check.
 * @param singular - Singular form.
 * @param plural - Optional plural override.
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}
