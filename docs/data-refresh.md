# Data Refresh Notes

Use these notes when checking dashboard freshness after chain reads and writes.

## Refresh Triggers

- Refresh wallet data after a successful check-in, claim, compound, or transfer action.
- Refresh leaderboard and recent activity panels after the active wallet changes.
- Keep stale loading states visible only while a new read is in progress.

## Review Checks

- Confirm failed writes do not mutate the displayed score or streak.
- Confirm manual page reload shows the same wallet state as the in-app refresh path.
