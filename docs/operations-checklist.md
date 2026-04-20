# CeloPulse Operations Checklist

Use this checklist for safer releases and runtime checks.

## Pre-Deploy

- [ ] Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` points to the intended network deployment.
- [ ] Confirm `NEXT_PUBLIC_CHAIN_ID` matches wallet/network settings in the target environment.
- [ ] Ensure WalletConnect project id is not a placeholder value before shipping.
- [ ] Run `npm run lint` and resolve all errors before deployment.

## Security

- [ ] Verify `.env.local` is ignored and not staged for commit.
