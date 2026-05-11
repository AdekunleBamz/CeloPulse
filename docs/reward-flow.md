# Reward Flow Notes

Use this guide when checking claim and compound behavior.

## Claim Review

- Confirm pending rewards are non-zero before starting a claim transaction.
- Capture the transaction hash and compare the post-claim pending reward value.
- Verify a rejected claim keeps the previous pending reward visible.

## Compound Review

- Confirm compounding updates score-related widgets after the transaction settles.
- Re-read contract state before reporting a reward total in release notes.
- Keep the eligibility score, pending amount, and claim hash together in release evidence.
