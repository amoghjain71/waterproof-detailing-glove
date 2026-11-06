# Security audit — Phase 0

**Date:** 2026-11-06  
**Scope:** Read-only audit per [docs/SECURITY_PROMPT.md](SECURITY_PROMPT.md) section 2.  
**Repo:** waterproof-detailing-glove (2HANDS)  
**Changed in Phase 0:** `docs/SECURITY_PROMPT.md`, `docs/SECURITY_AUDIT.md`, `.cursorignore` only. No application code, dependencies, or config behavior changes.

**Phase 1 (2026-11-06):** React/react-dom → 19.3.1; exact version pins; removed unused `@stripe/react-stripe-js` and `@stripe/stripe-js`; disabled `cacheComponents` / `partialPrefetching`; set `poweredByHeader`/`productionBrowserSourceMaps` false; added `.npmrc`, `.nvmrc` (22.23.4), `engines.node`, `vercel.json` installCommand `npm ci`, Dependabot, `docs/DEPENDENCIES.md`, `npm run security:check`. Local Node remains 22.16.0 — upgrade to ≥22.23.4 and set Vercel Node yourself.

This is not a claim that the site is secure or unhackable. It records what was checked, what was found, and what later phases should fix.

---

## 1. Installed versions and runtimes

| Component | Found | Severity | Notes / fix |
|-----------|-------|----------|-------------|
| `next` | **16.4.5** ([package.json](../package.json) L20) | Low / OK | Meets prompt floor (≥ 16.4.5). Confirm production deploy reports the same after redeploy. |
| `react` / `react-dom` | **19.3.0** ([package.json](../package.json) L21–22) | Medium | Prompt (as of 2026-10-14) calls for **19.3.1** on the 19.3 line. Upgrade in Phase 1. |
| `sharp` | **0.35.5** (transitive via `next`) | Info | Not a direct dependency. Keep `images.dangerouslyAllowSVG` false; no user uploads. |
| Node (local) | **v22.16.0** | Medium | Prompt wants patched Node **22.23.4+** (or 24.22.1 / 26.12.1+). Upgrade local runtime in Phase 1. |
| Node (Vercel) | **Unknown** | Medium | No `.nvmrc`, no `engines` in `package.json`, no readable Vercel project link in-repo. Set Node in Vercel dashboard + `engines` / `.nvmrc` in Phase 1. |
| npm | 10.9.2 | Info | Phase 1 wants npm ≥ 11.10 for `min-release-age=7` if using that `.npmrc` key. |

**Recommended fix (Phase 1):** bump React to 19.3.1, pin Node via `engines` + `.nvmrc`, set Vercel Node to a patched release, redeploy and verify.

---

## 2. `npm audit` and signatures

| Check | Result | Severity | Fix |
|-------|--------|----------|-----|
| `npm audit --omit=dev` | **0 vulnerabilities** | OK | Re-run on every Phase 1 lockfile change. |
| `npm audit signatures` | **Failed** — `EMISSINGSIGNATUREKEY` for `magic-string@1.4.5` (attestations present, public key missing) | Medium | Investigate / re-run after npm/registry updates; do not ignore silently. Track in Phase 1 `security:check`. |

No `.npmrc` supply-chain hardening yet (`ignore-scripts`, `save-exact`, `engine-strict`, `audit-level`, `min-release-age`). Phase 1.

---

## 3. Secret scan (working tree + git history)

**Tools:** `gitleaks` and `trufflehog` were **not installed**. Per the prompt, they were **not installed without approval**. Phase 0 used a redacted pattern scan (`git grep` across all commits + working-tree `rg`) for common key prefixes (`sk_live_`, `sk_test_`, `whsec_`, `pk_*`, `AKIA…`, `ghp_`, private key PEMs).

| Finding | Severity | Detail | Fix |
|---------|----------|--------|-----|
| No real secret blobs found in tracked history | Info | Only `.env.example` appears in git history for env files. Matches are placeholder comments (`sk_test_...`, `whsec_...`). | Still rotate any key that ever lived only in Vercel/local `.env` if it was pasted into chat or logs. |
| Working tree pattern scan clean (tracked files) | Info | No live-looking keys in committed source. | Keep `.env*` gitignored (already in [.gitignore](../.gitignore) L33–35). |
| Dedicated scanner not run | Medium | Full gitleaks/trufflehog pass not done. | **Approve install of gitleaks or trufflehog**, then re-scan history before Phase 2 closes secrets. |
| Local `.env*` not opened | Info | Not read into this audit (prompt rule). Existence unknown to the report. | Ensure `.cursorignore` blocks agent reads (added this phase). |

**Do not treat “pattern scan clean” as “history proven clean.”** Run an official scanner when you approve the install.

---

## 4. `NEXT_PUBLIC_` and client-reachable env

| Variable / path | Where | Severity | Finding | Fix |
|-----------------|-------|----------|---------|-----|
| `NEXT_PUBLIC_SITE_URL` | [.env.example](../.env.example) L4; [lib/site.ts](../lib/site.ts) L3–5; [lib/payments/stripe.ts](../lib/payments/stripe.ts) L18 | Info | Public canonical URL — appropriate for `NEXT_PUBLIC_`. | Keep public-only. |
| `NEXT_PUBLIC_PAYMENT_PROVIDER` | [.env.example](../.env.example) L8; [lib/config.ts](../lib/config.ts) L91–95 | Medium | Mirrored to client so UI can show Stripe vs mock. Also falls back to `PAYMENT_PROVIDER`, then **`"mock"`**. | In production, fail closed if unset or `mock` (Phase 2 `lib/env.ts`). Prefer server-only provider for checkout gating. |
| `PAYMENT_PROVIDER` | [.env.example](../.env.example) L7; [lib/config.ts](../lib/config.ts) L94 | Medium | Server + client via same module imported by client components ([PaymentSlot.tsx](../components/commerce/PaymentSlot.tsx), [ConfirmationClient.tsx](../components/commerce/ConfirmationClient.tsx)). | Split public flag from server provider selection. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [.env.example](../.env.example) L12 (commented) | Info | Publishable — OK if ever set. | Never put secret keys under `NEXT_PUBLIC_`. |
| `STRIPE_SECRET_KEY` | [lib/stripe.ts](../lib/stripe.ts) L9 | OK pattern | Read behind `import "server-only"`. | Keep server-only; validate at startup. |
| `STRIPE_WEBHOOK_SECRET` | [app/api/webhooks/stripe/route.ts](../app/api/webhooks/stripe/route.ts) L24 | OK pattern | Server-only env. | Same. |
| `NODE_ENV` | [AutoVideo.tsx](../components/media/AutoVideo.tsx) L58 | Info | Dev-only UI branch. | Fine. |

No zod env bootstrap (`lib/env.ts`) yet — Phase 2.

---

## 5. Route handlers, server actions, middleware

**Middleware / proxy / `"use server"`:** none found.

| Route | Method | Accepts | Validates | Auth | Writes | Severity | Fix |
|-------|--------|---------|-----------|------|--------|----------|-----|
| [app/api/checkout/route.ts](../app/api/checkout/route.ts) | POST | JSON customer + cart (+ optional waitlist/attribution) | Zod [checkoutRequestSchema](../lib/schemas.ts) L47–52 | None (expected) | `appendSubmission` waitlist; Stripe/mock checkout; email stub | **High** | Client `cart[].price` trusted (see §8/payments). Returns raw `err.message` to client (L59). No Origin check, no rate limit, no body size limit. Sends confirmation email **before** webhook-confirmed payment. |
| [app/api/webhooks/stripe/route.ts](../app/api/webhooks/stripe/route.ts) | POST | Raw body + `stripe-signature` | `constructEvent` | Stripe signature | `appendSubmission` order | **Medium** | Signature verification present (good). **Not idempotent** — retries re-append. Error text on missing secret is slightly informative (L28). |
| [app/api/contact/route.ts](../app/api/contact/route.ts) | POST | name, email, topic, message | Zod [contactSchema](../lib/schemas.ts) L9–14 | None | `appendSubmission`; email stub | **Medium** | `console.info` logs full payload including PII (L23). HTML email echoes `data.name` (L37). No honeypot / rate limit / Origin check. |
| [app/api/waitlist/route.ts](../app/api/waitlist/route.ts) | POST | email, size?, source? | Zod [waitlistSchema](../lib/schemas.ts) L3–7 | None | `appendSubmission`; email stub | **Medium** | Logs payload (L23). Echoes size into email HTML (L36). No abuse controls. |

**Schema gaps vs prompt:**

- [cartItemSchema](../lib/schemas.ts) L30–36: accepts **client `price`**, `qty` up to **20** (prompt: 1–10), `sku` is free string (not bundle allowlist), no `.strict()` so unknown fields may pass depending on zod defaults.
- No Content-Type enforcement beyond JSON parse try/catch.

---

## 6. File writes and personal data storage

| Location | Severity | Finding | Fix |
|----------|----------|---------|-----|
| [lib/submissions.ts](../lib/submissions.ts) L4, L43 | **High** | Writes waitlist / contact / order PII to `data/submissions.json` via `fs.writeFile`. | Stop writing PII into the project tree. Use email provider or hosted DB; update privacy copy. |
| [data/submissions.json](../data/submissions.json) | Medium | **Tracked in git** (currently empty array, 0 entries). | Untrack; gitignore; never commit submissions. |
| [lib/email.ts](../lib/email.ts) L39–44 | Medium | Stub logs `to` and subject server-side. | Avoid logging emails; wire Resend with `server-only`. |
| [lib/store/cart.ts](../lib/store/cart.ts) L32+ | Info | Cart persisted in **localStorage** (zustand `persist`) including **price**. | Persist only SKU/size/qty; server must re-price. |

---

## 7. Dangerous APIs, cache, Edge, images

| Item | Severity | File / line | Finding | Fix |
|------|----------|-------------|---------|-----|
| `dangerouslySetInnerHTML` | Low | [OrganizationJsonLd.tsx](../components/seo/OrganizationJsonLd.tsx) L17; [ProductJsonLd.tsx](../components/seo/ProductJsonLd.tsx) L40 | Static JSON-LD from app constants via `JSON.stringify` — not user input. | Keep; never feed user/API strings into this. |
| `eval` / `new Function` / raw `innerHTML` | OK | — | None found. | — |
| `use cache` directive | OK | — | None found. | — |
| `cacheComponents: true` | **Medium** | [next.config.ts](../next.config.ts) L4 | Cache Components enabled; called out in 2026 advisories. Site is on patched Next 16.4.5, but feature expands attack surface. | Phase 1: justify need or disable until required. |
| `partialPrefetching: true` | Info | [next.config.ts](../next.config.ts) L5 | Not an advisory focus; note for awareness. | Revisit if unused. |
| Edge runtime handlers | OK | — | None found. | — |
| `next/og` / `ImageResponse` | OK | — | None found. | — |
| `images.remotePatterns` | OK | — | Not set (no remote image hosts). | Keep explicit allowlist if added later. |
| `images.dangerouslyAllowSVG` | OK | — | Not enabled. | Keep false. |
| `poweredByHeader` / `productionBrowserSourceMaps` | Medium | [next.config.ts](../next.config.ts) | Not explicitly set. Live HTML did not show `x-powered-by`. | Set `poweredByHeader: false` and `productionBrowserSourceMaps: false` explicitly in Phase 2. |

---

## 8. Third-party scripts, iframes, external domains

| Source | Severity | Finding | Fix |
|--------|----------|---------|-----|
| `@vercel/analytics/next` | Info | Loaded in [app/layout.tsx](../app/layout.tsx) L3, L108. | Allow exact Analytics origin in CSP `connect-src` / `script-src` when enforcing. |
| `next/font/google` (Barlow / Barlow Condensed) | Info | [app/layout.tsx](../app/layout.tsx) L2–22. Build-time fetch; runtime serves self-hosted woff2 under `/_next/static/...` (seen in `Link` preload headers). | Prefer documenting self-host; CSP `font-src 'self'` should work for served files. |
| Stripe Checkout | Info | Redirect to hosted Checkout ([lib/payments/stripe.ts](../lib/payments/stripe.ts)). No Stripe.js card iframe observed in PaymentSlot. | CSP: `form-action` / navigate to `https://checkout.stripe.com`. |
| iframes | OK | None found in app components. | Keep `frame-src 'none'` until needed. |
| Media | Info | First-party `/videos` and `/images` under `public/`. | `media-src 'self'`; `img-src 'self' data: blob:`. |

---

## 9. Live response headers (production)

**Probed:** `https://waterproof-detailing-glove.vercel.app/` and `POST /api/waitlist` (2026-11-06).

### HTML (`GET /` → 200)

| Header | Present? | Severity | Fix |
|--------|----------|----------|-----|
| `strict-transport-security` | Yes — `max-age=63072000; includeSubDomains; preload` | Info | Prompt prefers adding `preload` only after subdomain confirmation — **already includes preload**. Confirm all subdomains are HTTPS (owner task). |
| `x-content-type-options` | **Missing** | Medium | Add `nosniff`. |
| `referrer-policy` | **Missing** | Medium | Add `strict-origin-when-cross-origin`. |
| `permissions-policy` | **Missing** | Medium | Add camera/mic/geo/payment/usb/interest-cohort denied. |
| `cross-origin-opener-policy` | **Missing** | Medium | Add `same-origin`. |
| `x-frame-options` / CSP `frame-ancestors` | **Missing** | Medium | Add `DENY` + CSP. |
| `content-security-policy` | **Missing** | **High** | Roll out Report-Only then enforce (Phase 2). |
| `x-powered-by` | Not observed | OK | Still set `poweredByHeader: false` explicitly. |
| `access-control-allow-origin: *` | **Present** | Medium | Unexpected on document responses; tighten — no wildcard CORS for APIs. |
| `cache-control` | `public, max-age=0, must-revalidate` | Info | Fine for HTML. |
| `server: Vercel` | Present | Info | Normal. |

### API (`POST /api/waitlist` empty → 400)

| Header | Severity | Finding | Fix |
|--------|----------|---------|-----|
| `cache-control: public, max-age=0, must-revalidate` | Medium | Personal-data routes should use `Cache-Control: no-store`. | Set on waitlist/contact/checkout/webhook responses. |
| Security headers | Medium | Same gaps as HTML (no CSP / nosniff / frame options beyond HSTS). | Phase 2 headers helper. |

### Quick path probes

| URL | Result |
|-----|--------|
| `/.env` | **404** |
| `/package.json` | **404** |

---

## 10. Debug, mock payments, source maps, leftovers

| Finding | Severity | File / line | Fix |
|---------|----------|-------------|-----|
| Default payment provider `"mock"` if env unset | **High** | [lib/config.ts](../lib/config.ts) L92–95 | Production must not allow mock checkout; return 503 until live payments; fail startup if `mock`. |
| Mock provider creates fake orders | **High** | [lib/payments/mock.ts](../lib/payments/mock.ts) L7–18 | Disable in production entirely. |
| UI exposes mock copy / “demo order” | Medium | [PaymentSlot.tsx](../components/commerce/PaymentSlot.tsx) L28 | Hide when production payments off. |
| Confirmation fallback `mock_order` | Low | [app/order/confirmation/page.tsx](../app/order/confirmation/page.tsx) L15 | Avoid implying paid status. |
| Client price → Stripe `unit_amount` | **Critical** | [lib/payments/stripe.ts](../lib/payments/stripe.ts) L32, L49; schema L34 | **Ignore client price**; look up from `lib/config` / Stripe Price IDs. |
| Checkout email on create, not webhook | **High** | [app/api/checkout/route.ts](../app/api/checkout/route.ts) L43–54 | Fulfilment/email only after signed webhook. |
| Webhook not idempotent | Medium | [app/api/webhooks/stripe/route.ts](../app/api/webhooks/stripe/route.ts) L45–49 | Store processed event IDs. |
| No `/api/debug` route found | OK | — | — |
| Source maps on production | Info | Not probed via `.map` URLs in this pass | Set `productionBrowserSourceMaps: false`; probe `*.map` in Phase 4. |
| `data/submissions.json` in repo | Medium | Tracked empty file | Remove from production path + git tracking. |

---

## Honest summary

### Checked

- Dependency versions and local Node.
- `npm audit --omit=dev` and `npm audit signatures`.
- Pattern-based secret scan of working tree and full git history (not gitleaks/trufflehog).
- All `NEXT_PUBLIC_` / env touchpoints found in source.
- All four API routes; absence of middleware/server actions.
- Submissions file I/O, cart persistence, email stub.
- Dangerous HTML/API patterns and Next image/cache config.
- Third-party analytics/fonts/Stripe redirect surface.
- Live production headers and a few sensitive-path probes.
- Mock payment and client-price trust paths.

### Changed (Phase 0 only)

- Added [docs/SECURITY_PROMPT.md](SECURITY_PROMPT.md).
- Added this audit.
- Added [.cursorignore](../.cursorignore) (block `.env*`, keys, secrets folders, `.vercel/`).

### Not changed

- No package upgrades, route edits, headers, CSP, rate limits, or payment logic.

### Remains (later phases + owner)

1. **Phase 1:** React 19.3.1, Node pin, optional disable `cacheComponents`, `.npmrc` / Dependabot / `security:check`, lockfile discipline.  
2. **Phase 2:** `lib/env.ts`, security headers + CSP Report-Only→enforce, zod strict allowlists, Origin checks, rate limits, remove file-based PII, generic errors, `no-store` on APIs.  
3. **Phase 3:** Server-side price lookup, webhook-only fulfilment + idempotency, block mock in production, `security.txt`, `docs/SECURITY.md`.  
4. **Phase 4:** Automated scanners, manual attack tests (§11 of the prompt).  
5. **You (section 15):** 2FA on GitHub/Vercel/Stripe/domain, private repo + push protection, Vercel Deployment Protection + Firewall, Stripe restricted keys/Radar, DNSSEC/CAA/SPF/DKIM/DMARC.  
6. **Approve** install of **gitleaks** or **trufflehog** for a definitive history secret scan.

### Highest priorities before real money

1. Stop trusting client `price` in Checkout Session creation.  
2. Block mock checkout in production.  
3. Move fulfilment/email to verified, idempotent webhooks.  
4. Stop writing personal data to `data/submissions.json`.  
5. Add CSP and the rest of the security headers.  
6. Patch React/Node to the versions in the current advisories.
