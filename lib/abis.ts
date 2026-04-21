// CeloPulse Smart Contract ABI
// Generated from contracts/CeloPulse.sol
export const celoPulseABI = [
  { inputs: [], name: "register", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "checkIn", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "completeTask", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "claimRewards", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "compoundRewards", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "stakeScore", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "unstakeScore", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "activateBoost", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "questId", type: "uint256" }], name: "completeQuest", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "userAddress", type: "address" }], name: "getUser", outputs: [{ internalType: "uint256", name: "activityScore", type: "uint256" }, { internalType: "uint256", name: "totalActions", type: "uint256" }, { internalType: "uint256", name: "currentStreak", type: "uint256" }, { internalType: "uint256", name: "longestStreak", type: "uint256" }, { internalType: "uint256", name: "stakedScore", type: "uint256" }, { internalType: "uint256", name: "dailyActions", type: "uint256" }, { internalType: "uint256", name: "achievements", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "userAddress", type: "address" }], name: "getPendingRewards", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "userAddress", type: "address" }], name: "canClaim", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "userAddress", type: "address" }], name: "canCompound", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getLeaderboard", outputs: [{ internalType: "address[10]", name: "addresses", type: "address[10]" }, { internalType: "uint256[10]", name: "scores", type: "uint256[10]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "count", type: "uint256" }], name: "getRecentActions", outputs: [{ internalType: "address[]", name: "userAddresses", type: "address[]" }, { internalType: "uint256[]", name: "actionTypes", type: "uint256[]" }, { internalType: "uint256[]", name: "timestamps", type: "uint256[]" }, { internalType: "uint256[]", name: "scoresEarned", type: "uint256[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "isRegistered", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
] as const

/** All function names available on the CeloPulse contract */
export const ABI_FUNCTION_NAMES = [
  'register',
  'checkIn',
  'completeTask',
  'claimRewards',
  'compoundRewards',
  'stakeScore',
  'unstakeScore',
  'activateBoost',
  'completeQuest',
  'getUser',
  'getPendingRewards',
  'canClaim',
  'canCompound',
  'getLeaderboard',
  'getRecentActions',
  'isRegistered',
] as const

export type AbiFunctionName = (typeof ABI_FUNCTION_NAMES)[number]

/** Tuple return type for the getUser view function */
export type GetUserResult = {
  activityScore: bigint
  totalActions: bigint
  currentStreak: bigint
  longestStreak: bigint
  stakedScore: bigint
  dailyActions: bigint
  achievements: bigint
}

/** Tuple return type for the getRecentActions view function */
export type GetRecentActionsResult = {
  userAddresses: readonly `0x${string}`[]
  actionTypes: readonly bigint[]
  timestamps: readonly bigint[]
  scoresEarned: readonly bigint[]
}

/** Tuple return type for the getLeaderboard view function */
export type GetLeaderboardResult = {
  addresses: readonly `0x${string}`[]
  scores: readonly bigint[]
}

/** Minimal ERC-20 ABI — only the functions used by CeloPulse (transfer + balanceOf + allowance + approve) */
export const erc20ABI = [
  { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'address', name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
] as const

export const WRITE_FUNCTION_NAMES = ['registerActivity', 'claimRewards', 'compoundRewards', 'activateBoost'] as const

export const READ_FUNCTION_NAMES = ['getUser', 'getRecentActions', 'getLeaderboard'] as const

export type AbiWriteFunctionName = typeof WRITE_FUNCTION_NAMES[number]
