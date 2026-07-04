# Nothing Is Impossible

Apple-inspired artist profile site built with React, TypeScript, and Vite.

## Local development

```bash
pnpm install
pnpm run dev
```

Public site: `http://127.0.0.1:5174/`

Admin studio: `http://127.0.0.1:5174/studio-gift`

The public `/admin` path redirects back to the fan site in this prototype.

Demo admin passcode: `gift2026`

## Current data layer

This gift version stores updates in the browser with `localStorage`, including image uploads as data URLs. Past events are cleaned automatically when the app loads or data changes.

For a public launch, replace the local storage helper in `src/App.tsx` with a real backend such as Supabase, Firebase, or a small Node API with authentication.
