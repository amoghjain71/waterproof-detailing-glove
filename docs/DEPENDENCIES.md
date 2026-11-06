# Direct dependencies

Exact versions are pinned in `package.json` (Phase 1). Reasons below. Removed unused `@stripe/react-stripe-js` and `@stripe/stripe-js` (hosted Checkout only; no Elements / `loadStripe` in app code).

## Production

| Package | Why |
|---------|-----|
| `next` | App Router framework (Vercel). |
| `react` / `react-dom` | UI runtime. |
| `zod` | Shared request/form schemas. |
| `@hookform/resolvers` | Zod bridge for react-hook-form. |
| `react-hook-form` | Checkout form state. |
| `stripe` | Server SDK for Checkout Sessions and webhooks. |
| `server-only` | Guard server modules from client bundles. |
| `zustand` | Client cart state (+ persist). |
| `@vercel/analytics` | First-party traffic analytics. |
| `framer-motion` | Cart drawer, gallery, menu motion. |
| `gsap` | Scroll-linked home sections. |
| `lenis` | Smooth scroll provider. |

## Development

| Package | Why |
|---------|-----|
| `typescript` | Typecheck. |
| `eslint` / `eslint-config-next` | Lint. |
| `tailwindcss` / `@tailwindcss/turbopack` | Styling + Turbopack CSS pipeline. |
| `@types/node` / `@types/react` / `@types/react-dom` | Type definitions. |

## Transitive (notable)

| Package | Why |
|---------|-----|
| `sharp` (via `next`) | Image optimization. Rebuild after `ignore-scripts` installs: `npm rebuild sharp`. |
