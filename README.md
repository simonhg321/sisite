# sisite — Simon Gibson

Personal site. Astro static build. Serves at **`instockornot.club/Simon/`**.

## Build

```bash
npm ci
npm run build      # outputs static files to dist/
```

The build is keyed to the `/Simon` base path (`base: '/Simon'` in `astro.config.mjs`).
Serve the contents of `dist/` under `/Simon/` on instockornot.club.

## Local preview

```bash
npm run dev        # http://localhost:4321/Simon/
npm run preview    # serves the built dist/ at the same path
```

## Notes

- If the serving subpath ever changes, update `base` in `astro.config.mjs` and rebuild — internal links and assets are resolved against it via `src/lib/url.ts`.
- GitHub Pages is **not** the host (a Pages custom domain serves at the domain root, which would break the `/Simon` asset paths). This repo is the source; deploy is handled on instockornot.club.
- Light/dark theme toggle in the nav; respects `prefers-color-scheme`, persists choice to `localStorage`.
