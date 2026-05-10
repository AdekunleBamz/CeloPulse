# Wallet QA Notes

Use these checks when reviewing wallet detection and connection states.

## Connection States

- Confirm MiniPay auto-detection runs only once during initial load.
- Confirm standard injected wallets can still connect outside MiniPay.
- Verify rejected connection requests show a recoverable state.

## Chain States

- Switch to the wrong chain and confirm the app asks for the configured Celo network.
- Return to the configured chain and confirm dashboard reads resume.
