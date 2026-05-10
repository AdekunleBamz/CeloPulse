# CeloPulse Environment Notes

Use this guide when preparing local, preview, or production environments.

## Required Values

- `NEXT_PUBLIC_CELOPULSE_CONTRACT` should be the deployed activity contract for the selected chain.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` must be a real WalletConnect Cloud project id before preview or production testing.
- `NEXT_PUBLIC_CHAIN_ID` should match the chain where the contract is deployed.

## Optional Values

- `NEXT_PUBLIC_MINIPAY_FEE_CURRENCY` can stay blank when the app should use the built-in MiniPay fallback.
- `NEXT_PUBLIC_APP_URL` should match the public URL used by metadata, sharing, and wallet surfaces.

## Review Rhythm

- Re-check environment values any time a preview branch is promoted or renamed.
