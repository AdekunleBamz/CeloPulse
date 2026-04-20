# CeloPulse Operations Checklist

Use this checklist for safer releases and runtime checks.

## Pre-Deploy

- [ ] Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` points to the intended network deployment.
- [ ] Confirm `NEXT_PUBLIC_CHAIN_ID` matches wallet/network settings in the target environment.
- [ ] Ensure WalletConnect project id is not a placeholder value before shipping.
- [ ] Run `npm run lint` and resolve all errors before deployment.

## Security

- [ ] Verify `.env.local` is ignored and not staged for commit.
- [ ] Sanitize screenshots/logs before sharing so WalletConnect IDs are never exposed.

## Runtime Checks

- [ ] Confirm MiniPay fee currency resolves to a valid address for the active chain.
- [ ] Validate `getUser` and `getPendingRewards` calls return data for at least one known wallet.
- [ ] Confirm leaderboard data refreshes without wallet disconnect loops.
- [ ] Verify `canClaim` and `canCompound` states update after each successful transaction.
- [ ] Send a small cUSD transfer and confirm balance refresh logic updates in the UI.
- [ ] Temporarily remove contract env var and verify the configuration warning is user-readable.
- [ ] Trigger a rejected wallet connection request and ensure the app surfaces a helpful error state.
- [ ] Check "Copied" wallet feedback resets after timeout and can be retriggered.

## Post-Deploy

- [ ] Verify the production domain matches `NEXT_PUBLIC_APP_URL`.
- [ ] Capture one successful action transaction hash for release notes and support debugging.
- [ ] Confirm non-MiniPay browsers still connect through the standard injected-wallet path.
