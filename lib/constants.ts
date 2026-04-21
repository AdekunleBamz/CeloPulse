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

/** Celo mainnet chain ID. */
export const CELO_MAINNET_CHAIN_ID = 42220

/** Celo Sepolia (Alfajores) testnet chain ID. */
export const CELO_SEPOLIA_CHAIN_ID = 44787

/** Default number of displayed decimals for CELO amounts in the UI. */
export const DISPLAY_DECIMALS = 4

/** Maximum achievable activity score for a user. */
export const MAX_ACTIVITY_SCORE = 10_000

/** Streak bonus in basis points (500 = 5%). */
export const STREAK_BONUS_BPS = 500

/** Cooldown (ms) before a user can compound rewards again. */
export const COMPOUND_COOLDOWN_MS = 86_400_000

/** Cooldown (ms) before a user can compound rewards again. */
export const COMPOUND_COOLDOWN_MS = 86_400_000

/** Cooldown (ms) before a user can claim rewards again. */
export const CLAIM_COOLDOWN_MS = 86_400_000

/** Maximum number of actions a user can take per day. */
export const DAILY_ACTION_LIMIT = 10

/** Minimum score units a user must have to initiate a stake. */
export const MIN_STAKE_AMOUNT = 100

/** Number of slots on the on-chain leaderboard. */
export const LEADERBOARD_SIZE = 10

/** Duration (ms) that an activated boost remains active. */
export const BOOST_DURATION_MS = 3_600_000

/** Total number of quests available in the app. */
export const QUEST_COUNT = 10

/** Default EVM token decimals (18 for CELO and cUSD). */
export const DEFAULT_CHAIN_DECIMALS = 18

/** Current application version string. */
export const APP_VERSION = '1.0.0'

/** Default interval (ms) for react-query data refetching. */
export const DEFAULT_REFETCH_INTERVAL_MS = 60_000

/** CSS transition/animation duration in milliseconds. */
export const ANIMATION_DURATION_MS = 300

/** Mobile viewport breakpoint in pixels. */
export const MOBILE_BREAKPOINT_PX = 768
