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
