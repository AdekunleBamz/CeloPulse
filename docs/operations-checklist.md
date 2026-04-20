# CeloPulse Operations Checklist

Use this checklist for safer releases and runtime checks.

## Pre-Deploy

- [ ] Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` points to the intended network deployment.
- [ ] Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` is not the zero address (`0x000...0000`).
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
- [ ] Confirm `/privacy` and `/terms` routes render without hydration or navigation errors.
- [ ] Validate favicon/OG assets load successfully in production responses.
- [ ] Confirm wallet address copy and truncated display formats remain readable on mobile widths.
- [ ] Confirm initial loading screen clears within expected timeout on low-end mobile devices.
- [ ] Force a failing write and ensure transaction notices are actionable and reset after success.
- [ ] If `NEXT_PUBLIC_MINIPAY_FEE_CURRENCY` is set, verify it is a valid 42-char EVM address.
- [ ] On Celo Sepolia, verify fee-currency fallback resolves to the Sepolia cUSD token address.
- [ ] Execute one check-in flow and confirm streak counters increment on-chain and in UI.
- [ ] Validate recent action feed labels map correctly to action IDs after refresh.
- [ ] Switch wallet networks once and verify the app recovers to the configured active chain.

## Observability

- [ ] Store at least one successful tx hash and one failed tx hash for support playbooks.
- [ ] Record MiniPay auto-connect success/failure frequency during smoke sessions.
- [ ] Measure claim-to-confirmation latency at least once per target chain.
- [ ] Verify MiniPay auto-connect retry runs once and does not create duplicate prompts.

## Recovery

- [ ] Keep a rollback commit reference ready before each production deployment.
- [ ] Verify `.env.example` still reflects all required runtime variables after changes.
- [ ] After push, verify new commits show as `Verified` in GitHub before release announcement.
