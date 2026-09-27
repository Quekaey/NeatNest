# NeatNest Services

A premium minimal React + TypeScript + Vite website for **NeatNest Services**.

**Tagline:** Spotless care for every space.

## Pages

- Home
- About
- Services
- FAQ
- Contact

The app uses lightweight client-side navigation without adding a router dependency. Direct page URLs such as `/services` and `/contact` work in the Vite dev server.

## Brand Assets

Logo assets are stored in `public/assets`:

- `public/assets/neatnest-logo.svg`
- `public/assets/neatnest-logo-mark.svg`

The favicon is `public/favicon.svg`.

## Contact Details

The contact details are intentionally kept from the previous version for now:

- WhatsApp: `+2348115112243`
- Phone: `0707 696 7302` / `+2347076967302`

Update these in `src/main.tsx` when the dedicated NeatNest WhatsApp, email, and domain are ready.

## Run Locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Test

```sh
npm test
```

The Playwright tests cover page navigation, quote composition, FAQ behavior, responsive overflow, image loading, and the reusable logo asset.

## Photography

The site uses 14 distinct curated Pexels photographs in `public/assets/photos`, each with one placement across the five pages. Small and large WebP variants reduce downloads on mobile. Shared branding can repeat; photographs do not.

People-focused images feature Black people to reflect NeatNest's African audience. Preserve this direction when selecting replacement photography.

Source links and the license are recorded in `public/assets/photos/sources.json`. These are illustrative stock photos, not NeatNest staff or completed projects. The old `public/images` files are retained as archive assets and are no longer used by the website.

Run `node scripts/download-photos.mjs` to fetch the documented photo variants again. With the dev server running on port 5187, `node scripts/capture-site.mjs` saves desktop/mobile page screenshots and a photo contact sheet to `test-results/visual`.
