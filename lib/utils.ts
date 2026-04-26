import { WEI_PER_CELO } from './constants'

/**
 * Utility helpers for CeloPulse UI formatting and validation.
 */

/**
 * Truncates an EVM address to short form: 0xabcd...1234
 * @param addr - Full address string.
 */
export function shortAddress(addr: string): string {
  const normalizedAddress = typeof addr === 'string' ? addr.trim() : ''
  if (normalizedAddress.length < 10) return normalizedAddress
  return `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`
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
  return Number(wei) / Number(WEI_PER_CELO)
}

/**
 * Returns true if the given address is the EVM zero address.
 * @param addr - Address string to check.
 */
export function isZeroAddress(addr: string): boolean {
  return addr.trim().toLowerCase() === '0x0000000000000000000000000000000000000000'
}

/**
 * Clamps a number between min and max values.
 * @param value - The number to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 */
export function clamp(value: number, min: number, max: number): number {
  const lower = Math.min(min, max)
  const upper = Math.max(min, max)
  return Math.min(upper, Math.max(lower, value))
}

/**
 * Formats a Unix timestamp (seconds) as a locale date string.
 * @param ts - Unix timestamp in seconds.
 */
export function formatTimestamp(ts: number): string {
  if (!Number.isFinite(ts) || ts <= 0) return ''
  return new Date(ts * 1000).toLocaleString()
}

/**
 * Returns true if the address is a valid non-zero EVM address.
 * @param addr - Address string to validate.
 */
export function isValidAddress(addr: string): boolean {
  const normalizedAddress = addr.trim()
  return /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)
    && normalizedAddress.toLowerCase() !== '0x0000000000000000000000000000000000000000'
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
  return BigInt(Math.round(celo * Number(WEI_PER_CELO)))
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
  const normalizedAmount = amount.trim()
  if (!/^(\d+(\.\d*)?|\.\d+)$/.test(normalizedAmount)) return 0n
  const n = Number(normalizedAmount)
  if (!Number.isFinite(n) || n < 0) return 0n
  return BigInt(Math.round(n * Number(WEI_PER_CELO)))
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
  if (!Number.isFinite(ts) || ts <= 0) return ''
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

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ready'
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

export function isSameDay(a: number, b: number): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

export function truncateMiddle(s: string, max: number): string {
  if (max <= 3) return s.slice(0, Math.max(0, max))
  if (s.length <= max) return s
  const half = Math.floor(max / 2)
  return s.slice(0, half) + '...' + s.slice(-half)
}

export function clampBigInt(v: bigint, lo: bigint, hi: bigint): bigint {
  if (v < lo) return lo
  if (v > hi) return hi
  return v
}

export function maxBigInt(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

export function minBigInt(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}

export function parseChainId(id: unknown): number | null {
  const n = Number(id)
  return Number.isInteger(n) && n > 0 ? n : null
}

export function formatShortDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function isEmptyAddress(addr: string): boolean {
  if (!addr) return true
  return addr.trim().toLowerCase() === '0x0000000000000000000000000000000000000000'
}

/** Clamps a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Returns the last element of an array or undefined if empty. */
export function lastItem<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}

/** Returns true if all elements in the array satisfy the predicate. */
export function allMatch<T>(arr: T[], predicate: (item: T) => boolean): boolean {
  return arr.every(predicate)
}

/** Returns unique values from an array using strict equality. */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/** Groups array elements by the result of a key function. */
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

/** Flattens a one-level nested array into a single array. */
export function flattenOnce<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr)
}

/** Returns a copy of the array without the element at the given index. */
export function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index)
}

/** Zips two arrays into an array of [a, b] tuples, stopping at the shorter length. */
export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  const len = Math.min(a.length, b.length)
  return Array.from({ length: len }, (_, i) => [a[i], b[i]] as [A, B])
}

/** Returns the sum of all numbers in an array (0 for empty array). */
export function sumArray(arr: number[]): number {
  return arr.reduce((total, n) => total + n, 0)
}

/** Returns true if the string is non-empty after trimming whitespace. */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

/** Clamps a value between min and max (inclusive). */
export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Returns true if the string is non-empty after trimming whitespace. */
export function isNonBlank(value: string): boolean {
  return value.trim().length > 0
}

/** Capitalizes the first character of a string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Converts a string to a URL-friendly slug. */
export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

/** Picks a subset of keys from an object. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {} as Pick<T, K>)
}

/** Omits specified keys from an object. */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(k => delete (result as Record<string, unknown>)[k as string])
  return result as Omit<T, K>
}

/** Parses a value to a float, returning NaN if not parseable. */
export function parseNumber(value: unknown): number {
  return parseFloat(String(value))
}

/** Returns true if the value is an empty array. */
export function isEmptyArray(arr: unknown[]): boolean {
  return Array.isArray(arr) && arr.length === 0
}

/** Returns a new array with duplicate values removed (deep equality not supported). */
export function dedup<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/** Returns the last element of an array, or undefined if empty. */
export function tail<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1]
}

/** Formats a Unix timestamp (seconds) to a readable date string. */
export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString()
}
