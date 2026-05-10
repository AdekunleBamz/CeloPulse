# Contract Operations Notes

Use these checks when validating a deployed CeloPulse activity contract.

## Address Review

- Confirm the contract address is a full 42-character EVM address.
- Confirm the address belongs to the same chain id configured in the frontend environment.
- Keep one block explorer link for the active deployment in release notes.

## Read Review

- Check `getUser` for a wallet with existing activity.
- Check `getPendingRewards` for a wallet that should have a non-zero pending amount.
