# MiniPay Fee Currency Notes

CeloPulse can use a MiniPay fee-currency override when the active chain supports it.

## Environment Review

- `NEXT_PUBLIC_CHAIN_ID` must match the deployed contract network.
- `NEXT_PUBLIC_MINIPAY_FEE_CURRENCY` should be a valid 42-character EVM address when set.
- Leave the override unset when testing fallback behavior.

## Smoke Checks

- Confirm MiniPay resolves the fee currency before sending a transaction.
- Confirm invalid fee-currency values produce a readable configuration warning.
- Confirm non-MiniPay browsers still use the standard wallet flow.
- Record the MiniPay app version used for fee-currency review.
