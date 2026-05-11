# CeloPulse Release Checklist

Use this checklist before promoting a Vercel deployment.

## Local Checks

- Install dependencies with `npm ci` before comparing local and preview behavior.
- Run `npm run lint`.
- Run `npm run build`.
- Confirm `NEXT_PUBLIC_CELOPULSE_CONTRACT` points to the intended chain deployment.
- Confirm the release branch does not rely on local-only environment values.

## Runtime Checks

- Open the app in a normal browser and confirm the standard wallet path still connects.
- Open the app in MiniPay and confirm automatic wallet detection completes.
- Confirm the latest activity value changes after a successful check-in.
- Confirm `/privacy` and `/terms` render from the production domain.
- Attach one claim or refresh evidence note to the release notes.
