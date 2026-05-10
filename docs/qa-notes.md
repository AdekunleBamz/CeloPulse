# CeloPulse QA Notes

Use these notes for focused checks that do not require a production deployment.

## Browser Coverage

- Verify the dashboard loads in a standard desktop browser with the configured chain id.
- Confirm the wallet connection path remains available outside MiniPay.
- Check that privacy and terms pages can be opened from a fresh session.

## Transaction Coverage

- Run one successful read-only dashboard refresh before testing writes.
- Capture one rejected transaction path to confirm the user-facing notice clears.
