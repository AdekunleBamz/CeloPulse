# Activity Flow Notes

Use this guide when validating the dashboard activity lifecycle.

## Read Flow

- Load wallet-specific activity from the configured CeloPulse contract.
- Confirm the latest streak, score, and pending reward values render before write actions are tested.
- Refresh after each write to make sure optimistic state does not hide stale chain data.

## Write Flow

- Test one check-in path with a small-value wallet.
- Confirm transaction completion updates the recent activity feed and progress widgets.
