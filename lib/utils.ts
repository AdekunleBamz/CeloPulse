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

/**
 * Debounces a function call by delay milliseconds.
 * @param fn - The function to debounce.
 * @param delay - Delay in ms.
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Converts a CELO amount to wei (bigint).
 * @param celo - Amount in CELO.
 */
export function celoToWei(celo: number): bigint {
  return BigInt(Math.round(celo * 1e18))
}

/**
 * Returns a formatted percentage string from a ratio (0-1).
 * @param ratio - Ratio between 0 and 1.
 * @param decimals - Number of decimal places.
 */
export function formatPercent(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toFixed(decimals)}%`
}

/**
 * Formats a large number with K/M suffix for compact display.
 * @param n - Number to format.
 */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

/**
 * Returns true if the wallet has enough CELO for a transfer.
 * @param balanceWei - Current wallet balance in wei.
 * @param amountWei - Amount to send in wei.
 */
export function hasSufficientBalance(balanceWei: bigint, amountWei: bigint): boolean {
  return balanceWei >= amountWei
}

/**
 * Sleeps for the given number of milliseconds.
 * @param ms - Duration to sleep.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Formats a bigint wei amount as a compact CELO string.
 * @param wei - Amount in wei.
 * @param decimals - Decimal places to show (default 4).
 */
export function formatWei(wei: bigint, decimals = 4): string {
  return weiToCelo(wei).toFixed(decimals)
}

export function formatScore(score: number): string {
  return score.toLocaleString()
}

export function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

export function isPositiveNumber(n: number): boolean {
  return Number.isFinite(n) && n > 0
}

export function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '...' : s
}

export function parseWei(amount: string): bigint {
  const n = parseFloat(amount)
  if (!Number.isFinite(n) || n < 0) return 0n
  return BigInt(Math.round(n * 1e18))
}

export function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b
}

export function isBigIntZero(v: bigint): boolean {
  return v === 0n
}

export function addWei(a: bigint, b: bigint): bigint {
  return a + b
}

export function subWeiSafe(a: bigint, b: bigint): bigint {
  return a > b ? a - b : 0n
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString()
}

export function roundToDecimals(n: number, d: number): number {
  const f = Math.pow(10, d)
  return Math.round(n * f) / f
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function computeStreakBonus(streak: number, bps: number): number {
  return Math.floor(streak * bps / 10_000)
}

export function getBadgeLabel(score: number): string {
  if (score >= 8000) return 'Gold'
  if (score >= 4000) return 'Silver'
  if (score >= 1000) return 'Bronze'
  return 'Newcomer'
}
