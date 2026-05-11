# Farcaster Review Notes

Use these checks when changing metadata, preview cards, or deployment URLs.

## Manifest Checks

- Confirm `farcaster.json` and `public/farcaster.json` point to the current production domain.
- Verify icon and splash image paths resolve from a production build.
- Keep app metadata aligned with `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_APP_URL`.

## Preview Checks

- Open a shared production URL and confirm the preview image matches the current brand assets.
- Confirm Mini App entry points still open the dashboard rather than a static landing page.
- Capture the Farcaster client and preview URL used for shell review.
