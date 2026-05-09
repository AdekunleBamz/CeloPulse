# CeloPulse Release Checklist

Use this checklist before promoting a Vercel deployment.

## Local Checks

- Run `npm run lint`.
- Run `npm run build`.
- Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` points to the intended chain deployment.

## Runtime Checks

- Open the app in a normal browser and confirm the standard wallet path still connects.
- Open the app in MiniPay and confirm automatic wallet detection completes.
- Confirm `/privacy` and `/terms` render from the production domain.
