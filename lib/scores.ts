import { MAX_ACTIVITY_SCORE } from './constants'

export const SCORE_TIERS = [
  { label: 'Newcomer', min: 0 },
  { label: 'Bronze', min: 1_000 },
  { label: 'Silver', min: 4_000 },
  { label: 'Gold', min: 8_000 },
] as const

export function getScoreTier(score: number): string {
  if (score >= 8_000) return 'Gold'
  if (score >= 4_000) return 'Silver'
  if (score >= 1_000) return 'Bronze'
  return 'Newcomer'
}

export function formatRank(rank: number): string {
  if (rank === 1) return '#1'
  return `#${rank}`
}

export function computeActivityRank(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.round((score / max) * 100)
}

export function isMaxScore(score: number): boolean {
  return score >= MAX_ACTIVITY_SCORE
}

export function scoreToPercent(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.round((score / max) * 100))
}

export function nextTierThreshold(score: number): number | null {
  if (score < 1_000) return 1_000
  if (score < 4_000) return 4_000
  if (score < 8_000) return 8_000
  return null
}

/** Returns points remaining until the next tier, or 0 if already at max. */
export function pointsUntilNextTier(score: number): number {
  const next = nextTierThreshold(score)
  return next !== null ? Math.max(0, next - score) : 0
}

/** Returns true when the score qualifies for at least Bronze tier. */
export function isRanked(score: number): boolean {
  return score >= 1_000
}

/** Returns the tier index (0=Newcomer, 1=Bronze, 2=Silver, 3=Gold). */
export function getTierIndex(score: number): number {
  if (score >= 8_000) return 3
  if (score >= 4_000) return 2
  if (score >= 1_000) return 1
  return 0
}

/** Returns how far along (0-100) the user is within their current tier. */
export function tierProgress(score: number): number {
  if (score < 1_000) return Math.round((score / 1_000) * 100)
  if (score < 4_000) return Math.round(((score - 1_000) / 3_000) * 100)
  if (score < 8_000) return Math.round(((score - 4_000) / 4_000) * 100)
  return 100
}

/** Returns the highest score from a list of score records. */
export function getTopScore(scores: number[]): number {
  return scores.length > 0 ? Math.max(...scores) : 0
}
