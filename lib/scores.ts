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
  if (rank <= 0) return '-'
  if (rank === 1) return '#1'
  return `#${rank}`
}

export function computeActivityRank(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((score / max) * 100)))
}

export function isMaxScore(score: number): boolean {
  return score >= MAX_ACTIVITY_SCORE
}

export function scoreToPercent(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((score / max) * 100)))
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

/** Returns scores above a given threshold. */
export function filterAboveThreshold(scores: number[], threshold: number): number[] {
  return scores.filter(s => s > threshold)
}

/** Returns the average of a list of scores (0 for empty). */
export function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

/** Returns true if any score exceeds the given value. */
export function hasHighScore(scores: number[], value: number): boolean {
  return scores.some(s => s > value)
}

/** Returns scores sorted descending (best first). */
export function rankScores(scores: number[]): number[] {
  return [...scores].sort((a, b) => b - a)
}

/** Returns the lowest score from a list (Infinity for empty). */
export function getMinScore(scores: number[]): number {
  return scores.length > 0 ? Math.min(...scores) : Infinity
}

/** Returns the number of scores above zero. */
export function countNonZero(scores: number[]): number {
  return scores.filter(s => s > 0).length
}

/** Normalizes scores to a 0-100 range based on the max value. */
export function normalizeScores(scores: number[]): number[] {
  const max = Math.max(...scores)
  if (max === 0) return scores.map(() => 0)
  return scores.map(s => Math.round((s / max) * 100))
}

/** Returns the median value from a list of scores. */
export function medianScore(scores: number[]): number {
  if (scores.length === 0) return 0
  const sorted = [...scores].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length 
/** Returns the median value from a list of scores. */
export function medianScore(scores: number[]): number {
  if (scores.length === 0) return 0
  const sorted = [...scores].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/** Returns a slice of the top N scores. */
export function topN(scores: number[], n: number): number[] {
  return [...scores].sort((a, b) => b - a).slice(0, n)
}

/** Maps a score to a tier label: bronze, silver, gold, platinum. */
export function scoreToTier(score: number): string {
  if (score >= 10000) return "platinum"
  if (score >= 5000) return "gold"
  if (score >= 1000) return "silver"
  return "bronze"
}

/** Calculates percentile rank of a score within an array. */
export function percentile(scores: number[], score: number): number {
  if (scores.length === 0) return 0
  const below = scores.filter(s => s < score).length
  return Math.round((below / scores.length) * 100)
}

/** Clamps a score to [min, max] range. */
export function clampScore(score: number, min: number, max: number): number {
  return Math.min(Math.max(score, min), max)
}

/** Computes variance of a score array. */
export function scoreVariance(scores: number[]): number {
  if (scores.length === 0) return 0
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  return scores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / scores.length
}

/** Computes standard deviation of a score array. */
export function standardDeviation(scores: number[]): number {
  return Math.sqrt(scoreVariance(scores))
}

/** Bucketizes a score into ranges. */
export function bucketize(score: number, bucketSize: number): number {
  return Math.floor(score / bucketSize) * bucketSize
}


/** Returns the top N percent of scores. */
export function topNPercent(scores: number[], pct: number): number[] {
  const sorted = [...scores].sort((a, b) => b - a)
  return sorted.slice(0, Math.ceil((sorted.length * pct) / 100))
}
