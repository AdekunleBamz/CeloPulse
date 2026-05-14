# CeloPulse Environment Notes

Use this guide when preparing local, preview, or production environments.

## Required Values

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CELOPULSE_CONTRACT` | Deployed activity contract for the selected chain. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Real WalletConnect Cloud project id. Required before preview or production testing. |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID matching the deployed contract (`42220` for mainnet). |

## Optional Values

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_MINIPAY_FEE_CURRENCY` | MiniPay fee currency override. Leave blank to use the built-in fallback. |
| `NEXT_PUBLIC_APP_URL` | Public URL used by metadata, sharing, and wallet surfaces. |

## Review Rhythm

- Re-check environment values any time a preview branch is promoted or renamed.
- Record the reviewer and target environment whenever public variables change.
