/**
 * Application-wide constants for CeloPulse.
 */

/** How often (ms) to poll for balance updates. */
export const BALANCE_POLL_INTERVAL_MS = 15_000

/** How often (ms) to refresh the price feed. */
export const PRICE_REFRESH_INTERVAL_MS = 30_000

/** Timeout (ms) before a pending transaction is marked stale. */
export const TX_TIMEOUT_MS = 90_000

/** Duration (ms) for success toast notifications. */
export const TOAST_SUCCESS_DURATION_MS = 4_000

/** Duration (ms) for error toast notifications. */
export const TOAST_ERROR_DURATION_MS = 6_000

/** Minimum transfer amount in wei to allow a send. */
export const MIN_TRANSFER_WEI = 1_000_000_000_000n

/** Maximum number of transaction history items to display. */
export const MAX_TX_HISTORY = 50

/** Zero address sentinel for uninitialized EVM addresses. */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

/** Number of block confirmations before a transaction is considered final. */
export const TX_CONFIRMATIONS = 1

/** Delay (ms) between RPC retry attempts. */
export const RPC_RETRY_DELAY_MS = 2_000

/** Maximum number of RPC retry attempts. */
export const MAX_RPC_RETRIES = 5

/** Debounce delay in ms for search/input handlers. */
export const INPUT_DEBOUNCE_MS = 300

/** App name as displayed in the UI header. */
export const APP_DISPLAY_NAME = 'CeloPulse'

/** Transaction status values used to drive UI state. */
export const TX_STATUS = Object.freeze({
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const)

/** Default gas limit override for MiniPay transactions. */
export const MINIPAY_GAS_LIMIT = 500_000n
