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
