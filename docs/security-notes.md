# CeloPulse Security Notes

Use this guide for non-secret review steps before sharing builds or release notes.

## Environment Hygiene

- Keep `.env.local` out of commits and support screenshots.
- Treat WalletConnect project ids as deployment configuration, not as values to paste into issue threads.
- Review any fee-currency override before testing writes in MiniPay.

## Wallet Safety

- Prefer small-value wallets for smoke testing transaction states.
- Confirm rejected wallet requests leave the interface recoverable.
