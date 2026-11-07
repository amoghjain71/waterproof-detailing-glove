# Security guide — 2HANDS

Honest status: this site is hardened for a small pre-order storefront. It is not unhackable. Treat account takeover (GitHub, Vercel, Stripe, domain) as the highest remaining risk.

## What was done (Phases 0–4)

- Patched Next.js / React / Node pins; supply-chain `.npmrc`, Dependabot, `npm run security:check`.
- Server env validation (`lib/env.ts`); `server-only` on secret-touching modules.
- Security headers + CSP Report-Only + `/api/csp-report`.
- Public POST routes: Origin/Host check, body limits, zod `.strict()`, honeypot + min fill time, IP/email rate limits, generic errors, `Cache-Control: no-store`.
- No personal submissions written into the git tree.
- Stripe-hosted Checkout only; server-side price lookup; cart storage is sku/size/qty only.
- Checkout gated by `PAYMENTS_OPEN=true` + Stripe provider; returns **503 Pre-order payments open soon** otherwise; no mock Place Order button outside local development.
- Webhooks: raw body + signature verify; in-process event dedupe + Stripe `metadata.fulfilled`; confirmation email only after webhook success.
- `public/.well-known/security.txt`, this guide, `.cursorignore` for secrets.
- Phase 4: CodeQL workflow, `npm run security:attack-tests`, ZAP command documented below.

## Response headers (what each does)

| Header | Role |
|--------|------|
| `Strict-Transport-Security` | Force HTTPS on return visits (no `preload` until every subdomain is HTTPS). |
| `X-Content-Type-Options: nosniff` | Block MIME sniffing. |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limit referrer leakage. |
| `Permissions-Policy` | Disable camera/mic/geo/payment API/usb/FLoC. |
| `Cross-Origin-Opener-Policy: same-origin` | Isolate browsing context from cross-origin popups. |
| `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` | Clickjacking resistance. |
| `Content-Security-Policy-Report-Only` | Log violations without breaking the page; tighten then enforce. |

`poweredByHeader` and production browser source maps are off.

## Opening real payments

1. Set `PAYMENT_PROVIDER=stripe` and `NEXT_PUBLIC_PAYMENT_PROVIDER=stripe` in Vercel.
2. Set `STRIPE_SECRET_KEY` (prefer a **restricted** key), `STRIPE_WEBHOOK_SECRET`, optional publishable key.
3. Point the Stripe webhook at `/api/webhooks/stripe` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Only then set `PAYMENTS_OPEN=true`.
5. Redeploy and place a test-mode order end to end.

Until step 4, `/api/checkout` returns 503 and the checkout UI does not offer a mock order button.

## Rotating secrets

| Secret | Where | Rotate |
|--------|-------|--------|
| `STRIPE_SECRET_KEY` | Vercel env (Sensitive) | Stripe Dashboard → Developers → API keys → roll restricted/secret key; update Vercel; redeploy. |
| `STRIPE_WEBHOOK_SECRET` | Vercel env | Stripe webhook endpoint → reveal/roll signing secret; update Vercel. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel | Replace publishable key; redeploy (low sensitivity). |
| `RESEND_API_KEY` (future) | Vercel | Resend dashboard revoke + create; update Vercel. |
| GitHub / Vercel / domain tokens | Provider dashboards | Revoke compromised tokens; rotate passkeys/2FA recovery codes. |

Never paste live secrets into chat, commits, or screenshots. If a secret was ever committed or pasted, treat it as exposed and rotate.

## Incident response (short)

1. Rotate every potentially exposed secret (Stripe, email, GitHub, Vercel).
2. Revoke sessions/tokens; force logout where applicable.
3. Redeploy from a known-good commit; disable `PAYMENTS_OPEN` if payment integrity is in doubt.
4. Review Vercel function logs and Stripe webhook/event logs for abuse.
5. Preserve evidence; tell affected customers as the law requires, with a lawyer.

## Monthly routine

- Read the [Next.js blog](https://nextjs.org/blog) and security advisories.
- Run `npm run security:check` (and gitleaks when you approve installing it).
- Review Vercel deployments, Firewall, and Stripe Radar / failed webhooks.
- Confirm Node on Vercel matches `.nvmrc` (≥ 22.23.4).
- Review CSP Report-Only hits at `/api/csp-report` logs; enforce CSP when clean.

## Phase 4 automation

```bash
npm run security:check
npm run security:attack-tests                 # local (default http://127.0.0.1:3010)
EXPECT_CHECKOUT_503=1 npm run security:attack-tests -- https://YOUR-DEPLOY.vercel.app
```

CodeQL runs on push/PR via `.github/workflows/codeql.yml` (needs GitHub Advanced Security / code scanning enabled on the repo).

`eslint-plugin-security` was **not** added — approve that dev dependency before install.

## OWASP ZAP baseline

Against a Vercel preview (with Deployment Protection access as needed):

```bash
docker run --rm -t ghcr.io/zaproxy/zap-stable zap-baseline.py \
  -t https://YOUR-PREVIEW.vercel.app
```

Document findings in the audit; fix highs before enabling live payments at scale.

## Local hooks

```bash
npm run hooks:install   # points git at .githooks (secret pattern scan)
```

## Honest remaining work

- **Redeploy** Phases 2–4 to Vercel — production was still on pre-hardening APIs when Phase 4 probed it.
- **Enforce CSP** after Report-Only violations are clean (currently Report-Only only).
- Confirm **securityheaders.com / Mozilla Observatory / Lighthouse** grades on the new deploy (local build has the full header set).
- Approve **gitleaks** or **trufflehog** for a full git-history secret scan; rotate any key that was ever pasted into a terminal or chat.
- Replay a **real signed Stripe webhook twice** after `PAYMENTS_OPEN` (idempotency).
- Confirm **preview Deployment Protection** logged out.
- Optional: `eslint-plugin-security` if you approve the package.

## Owner checklist (Cursor cannot do these)

- 2FA / passkeys on GitHub, Vercel, Stripe, npm, email, domain registrar.
- Private repo; GitHub secret scanning + push protection; branch protection on `main`; enable CodeQL results.
- Vercel Deployment Protection on previews; Firewall rate limits; mark env vars Sensitive; Node ≥22.23.4.
- Stripe restricted keys, Radar defaults, webhook failure alerts.
- Domain lock, DNSSEC/CAA if offered, SPF/DKIM/DMARC for mail.
