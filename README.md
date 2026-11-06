# 2Hands — Waterproof Detailing Inner Glove

Production-quality marketing + e-commerce site for the **Waterproof Detailing Inner Glove** (SKU `WDIG-001`, colorway `BLK-01`).

Built from tech pack WDIG-001 R01 and the Problem-Solution Fit portfolio. Brand, price, sales mode, and claims are config-driven — never invent specs.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
```

## Phase status

| Phase | Status |
| --- | --- |
| 1 Scaffold, design system, shell, AutoVideo | Done |
| 2 Home 17-section scroll story | Done |
| 3 Inner pages (glove, made, sizing, tested, …) | Done |
| 4 Cart, checkout, payments, APIs | Done |
| 5 Perf, a11y, SEO, README | Done |

Source brief: [`docs/PROMPT.md`](docs/PROMPT.md)

## Config knobs

Edit [`lib/config.ts`](lib/config.ts) (and optionally env):

| Key | Purpose |
| --- | --- |
| `BRAND.name` | Brand string in UI (currently **2Hands**) — never hardcode elsewhere |
| `PRICE_USD` | Pair price (default `29.99`) |
| `SALES_MODE` | `preorder` \| `live` — CTA labels + waitlist capture |
| `CLAIM_LEVEL` | `intent` \| `proven` — Prototype badge + copy |
| `SHOW_CONCEPT_LABEL` | “Concept visualization” on illustrative video |
| `PAYMENT_PROVIDER` | `mock` \| `stripe` (env override) |
| `SHIPPING_FLAT_USD` / `FREE_SHIPPING_OVER_USD` | Shipping math |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap / OG / JSON-LD |

### Data editors

- Sizes: [`data/sizes.ts`](data/sizes.ts) — only **M** is confirmed; never auto-scale S/L/XL
- Tests: [`data/tests.ts`](data/tests.ts) — statuses `planned` \| `in_testing` \| `passed` \| `failed`
- Copy: [`content/copy.ts`](content/copy.ts)
- Videos: [`content/videos.ts`](content/videos.ts)
- FAQ / survey: [`content/faq.ts`](content/faq.ts), [`content/survey.ts`](content/survey.ts)

## Three numbers to watch

Events log in the browser console as `[track]`. Each event includes `src` and `utm_*` captured from the landing URL (for example `?src=meet`).

- **Bundle take rate.** `select_bundle` and `add_to_cart` with `bundle` of `single` or `crew`, divided by `view_item`.
- **Size calculator against exchanges.** `open_size_calculator` and `notify_size` against later size-exchange requests. The calculator only recommends M until other sizes are confirmed.
- **Revenue per visitor.** Checkout totals divided by `view_item`, split by device width and by `src` or `utm_source`.

## Claims guardrails

While `CLAIM_LEVEL === 'intent'`:

- No “certified,” “chemical-resistant/proof,” “hypoallergenic,” “thermal rated,” “PPE,” or lifetime durability
- Use intent language: “designed to keep water out,” “built to stay thin under your mitt”
- Show **Prototype V2. Testing in progress.** in hero/footer
- Survey stats always footnoted: founder survey, **n=62**

## Videos

Place files in `public/videos/` using exact names from `content/videos.ts`. Missing files show an animated placeholder (filename label in **development** only).

**Present:** hero-droplets, problem-cold-hands, glove-on-strap, mitt-swap, bucket-dip-dry-reveal, full-wash-in-use, cuff-seal-macro, layers-macro, dexterity-test, durability-montage, making-lamination-cutting, making-seal-bonding, making-leak-test, sizing-measure, winter-mobile-detailer, product-turntable, closing-cta-pair

**Still placeholders:** social-vertical-droplets

Target ~3 MB per looping clip when encoding for production.

### Scrub encode (scroll-scrubbed clips)

```bash
ffmpeg -i in.mp4 -an -vf scale=1920:-2 -g 1 -crf 23 out-scrub.mp4
```

Images live in `public/images/` (`glove-concept.png`, `glove-in-use.png`).

## Commerce

- Cart: Zustand + `localStorage` — [`lib/store/cart.ts`](lib/store/cart.ts)
- Drawer in header; full page at `/cart`
- Checkout: react-hook-form + zod → `POST /api/checkout`
- Mock provider routes to `/order/confirmation` (no card fields)
- Stripe scaffold: [`lib/payments/stripe.ts`](lib/payments/stripe.ts) + `/api/webhooks/stripe`
- Waitlist / contact: `POST /api/waitlist`, `POST /api/contact` → console + [`data/submissions.json`](data/submissions.json) + [`lib/email.ts`](lib/email.ts) Resend stub

## Accessibility & motion

- Skip link to `#main`
- Visible `:focus-visible` rings (cyan)
- `prefers-reduced-motion`: no Lenis, pins/scrub skipped, AutoVideo shows play button, marquees static, cursor trail off
- Landmarks: `header`, `main`, `footer`, labeled navs
- Video captions via `<VideoCaption>` when `SHOW_CONCEPT_LABEL` is on

## SEO

- Per-route metadata + Open Graph / Twitter cards
- [`app/sitemap.ts`](app/sitemap.ts), [`app/robots.ts`](app/robots.ts)
- Organization + Product JSON-LD (`PreOrder` when preorder)
- Blue droplet favicon: `app/icon.svg` / `public/favicon.svg`

## Performance notes

- Hero video uses `priority` + IntersectionObserver pause off-screen
- Below-fold videos preload `metadata` only
- `next/image` AVIF/WebP; animate `transform` / `opacity` only
- Compress videos before production deploy for Lighthouse mobile targets (Perf 85+, A11y 95+, SEO 95+)

## Project map

```
app/           routes + API
components/    ui, layout, home, glove, commerce, media, seo
content/       copy, videos, faq, survey
data/          sizes, tests, submissions.json
lib/           config, gsap, payments, cart, schemas, site
public/images  product stills
public/videos  mp4 clips
docs/PROMPT.md full build brief
```

## Acceptance checklist

- [x] Every route loads; commerce mock order works
- [x] Home has 17 scroll sections; mobile matchMedia lighter
- [x] Works with missing videos (placeholders)
- [x] Cart drawer, checkout validation, confirmation
- [x] `PAYMENT_PROVIDER`, `SALES_MODE`, `CLAIM_LEVEL` change behavior
- [x] Claims guardrails + survey footnotes
- [x] Reduced-motion usable
- [x] Sitemap, robots, OG, JSON-LD, favicon
