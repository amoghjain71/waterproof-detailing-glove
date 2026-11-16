# Stripe Integration TODO

## Status (Nov 2026)

Checkout is **implemented and tested** on **2HANDS - payment sandbox** (`acct_1UbM90PeLG0n1MyG`).

Public site is currently **signup-only**. Stripe stays wired; sales stay closed until you flip the flags below.

### Re-open buy / pre-order checkout

Set all of these to `true` in `.env.local` and Vercel (Production + Preview), then redeploy:

- `PAYMENTS_OPEN=true`
- `NEXT_PUBLIC_PAYMENTS_OPEN=true`

Keep Stripe keys and webhook secret as-is (2HANDS sandbox). Do not switch back to glove-payments.

### Close buy again (signup UI)

Set both flags to `false` and redeploy. Size/pack stay muted; email + phone + agree form returns.

---

Scenario **A**: Checkout Session create in [lib/payments/stripe.ts](lib/payments/stripe.ts).

## Account

| Item | Value |
|------|-------|
| Stripe account | 2HANDS - payment sandbox |
| Account id | `acct_1UbM90PeLG0n1MyG` |
| Mode | test |
| Webhook | `https://waterproof-detailing-glove.vercel.app/api/webhooks/stripe` |
| Events | `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` |

## Configured session parameters

| Parameter | Value |
|-----------|-------|
| ui_mode | `hosted_page` |
| mode | `payment` |
| billing_address_collection | `required` |
| phone_number_collection | `{ enabled: true }` |
| automatic_tax | `{ enabled: false }` |
| allow_promotion_codes | `true` |
| submit_type | `pay` |
| shipping_address_collection.allowed_countries | `CA`, `MX`, `US` |
| name_collection.individual | `{ enabled: true, optional: true }` |
| integration_identifier | `hosted_web_0012` |
| origin_context | `web` |

Do **not** set `consent_collection.promotions` until Checkout promo Terms are accepted in the Dashboard for this account.

App-owned fields: `customer_email`, `client_reference_id`, `metadata`, dynamic `price_data` line items.

## Env vars required

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYMENT_PROVIDER=stripe` / `NEXT_PUBLIC_PAYMENT_PROVIDER=stripe`
- `PAYMENTS_OPEN` / `NEXT_PUBLIC_PAYMENTS_OPEN` (gate buy vs signup)
- `NEXT_PUBLIC_SITE_URL`

## How it works

1. Customer fills contact on `/checkout` and posts to `/api/checkout`.
2. Server creates a hosted Checkout Session and redirects to `session.url`.
3. Stripe collects billing address, shipping (US/CA/MX), phone, optional name, and payment.
4. Webhook fulfills the order and sends the customer confirmation email.

## Test card

`4242 4242 4242 4242` in test mode.
