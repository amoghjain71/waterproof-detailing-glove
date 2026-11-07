#!/usr/bin/env node
/**
 * Phase 4 manual attack tests (section 11) against a local or remote base URL.
 * Usage: node scripts/phase4-attack-tests.mjs [baseUrl]
 * Default: http://127.0.0.1:3010
 */
const base = (process.argv[2] || "http://127.0.0.1:3010").replace(/\/$/, "");
const origin = new URL(base).origin;

const results = [];

function record(id, title, status, detail) {
  results.push({ id, title, status, detail });
  const mark = status === "PASS" ? "PASS" : status === "FAIL" ? "FAIL" : status;
  console.log(`[${mark}] ${id}. ${title}`);
  if (detail) console.log(`      ${detail}`);
}

async function req(path, init = {}) {
  const headers = new Headers(init.headers || {});
  const res = await fetch(`${base}${path}`, { ...init, headers, redirect: "manual" });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not json */
  }
  return { res, text, json };
}

async function main() {
  console.log(`Phase 4 attack tests → ${base}\n`);

  // 1. Checkout: ignore price, reject qty 9999
  {
    const started = Date.now() - 5_000;
    const body = {
      customer: {
        email: "attacker@example.com",
        name: "Attacker",
        address: {
          line1: "1 Test St",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "US",
        },
      },
      cart: [
        {
          sku: "WDIG-001",
          size: "M",
          qty: 9999,
          price: 0.01,
        },
      ],
      website: "",
      formStartedAt: started,
    };
    const { res, json } = await req("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify(body),
    });
    const rejectedQty =
      res.status === 400 ||
      (json?.error && /valid|fail|request/i.test(String(json.error)));
    // Also 503 is acceptable if payments closed (still means price/qty not honored).
    const ok = rejectedQty || res.status === 503;
    record(
      1,
      "Checkout rejects qty 9999 / ignores client price",
      ok ? "PASS" : "FAIL",
      `status=${res.status} body=${JSON.stringify(json)}`,
    );
  }

  // 1b. Checkout with price field only (strict schema should drop/reject unknown price)
  {
    const started = Date.now() - 5_000;
    const body = {
      customer: {
        email: "price@example.com",
        name: "Price",
        address: {
          line1: "1 Test St",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "US",
        },
      },
      cart: [{ sku: "WDIG-001", size: "M", qty: 1, price: 0.01 }],
      website: "",
      formStartedAt: started,
    };
    const { res, json } = await req("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify(body),
    });
    const ok = res.status === 400 || res.status === 503;
    record(
      "1b",
      "Checkout rejects unknown cart.price field (strict)",
      ok ? "PASS" : "FAIL",
      `status=${res.status} body=${JSON.stringify(json)}`,
    );
  }

  // 2. Fake Stripe webhook without signature
  {
    const { res } = await req("/api/webhooks/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "checkout.session.completed", data: {} }),
    });
    record(
      2,
      "Fake Stripe webhook without signature → 400",
      res.status === 400 ? "PASS" : "FAIL",
      `status=${res.status}`,
    );
    record(
      "2b",
      "Replay valid webhook twice (idempotent)",
      "SKIP",
      "Needs a real signed Stripe event — verify in Stripe Dashboard / CLI after PAYMENTS_OPEN.",
    );
  }

  // 3. Script tags / long strings
  {
    const started = Date.now() - 5_000;
    const long = "A".repeat(6000);
    const { res: waitlistRes, json: waitlistJson } = await req("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        email: "<script>alert(1)</script>@x.com",
        source: "<script>",
        website: "",
        formStartedAt: started,
      }),
    });
    const { res: contactRes } = await req("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        name: "<script>alert(1)</script>",
        email: "ok@example.com",
        message: long,
        website: "",
        formStartedAt: started,
      }),
    });
    const waitlistOk = waitlistRes.status === 400;
    const contactOk = contactRes.status === 400;
    record(
      3,
      "Script / oversized form input rejected",
      waitlistOk && contactOk ? "PASS" : "FAIL",
      `waitlist=${waitlistRes.status} contact=${contactRes.status} waitlistBody=${JSON.stringify(waitlistJson)}`,
    );
  }

  // 4. Rate limit — 50 waitlist posts
  {
    const started = Date.now() - 5_000;
    let saw429 = false;
    for (let i = 0; i < 50; i++) {
      const { res } = await req("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
        },
        body: JSON.stringify({
          email: `rate${i}@example.com`,
          source: "phase4",
          website: "",
          formStartedAt: started,
        }),
      });
      if (res.status === 429) {
        saw429 = true;
        break;
      }
    }
    record(
      4,
      "50 form posts → 429",
      saw429 ? "PASS" : "FAIL",
      saw429 ? "rate limit engaged" : "no 429 within 50 requests",
    );
  }

  // 5. Different Origin
  {
    const started = Date.now() - 5_000;
    const { res } = await req("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil.example",
      },
      body: JSON.stringify({
        email: "evil@example.com",
        website: "",
        formStartedAt: started,
      }),
    });
    record(
      5,
      "POST from foreign Origin rejected",
      res.status === 403 ? "PASS" : "FAIL",
      `status=${res.status}`,
    );
  }

  // 6. Sensitive paths
  {
    const paths = [
      "/.env",
      "/.git/config",
      "/api/debug",
      "/package.json",
      "/next.config.ts",
      "/app/page.tsx.map",
    ];
    const outcomes = [];
    let ok = true;
    for (const path of paths) {
      const { res } = await req(path, { method: "GET" });
      const pass = res.status === 404 || res.status === 405 || res.status === 308;
      // 308/301 to trailing slash still fine if not exposing content; prefer 404.
      const strict = res.status === 404 || res.status === 405;
      outcomes.push(`${path}:${res.status}`);
      if (!strict) ok = false;
    }
    record(
      6,
      "Sensitive paths 404",
      ok ? "PASS" : "FAIL",
      outcomes.join(" "),
    );
  }

  // 7. Preview Deployment Protection — owner
  record(
    7,
    "Preview requires Vercel authentication",
    "SKIP",
    "Owner: open a preview logged out and confirm Vercel Authentication challenge.",
  );

  // 8. Checkout payments closed → 503 (when PAYMENTS_OPEN is not true)
  {
    const started = Date.now() - 5_000;
    const { res, json } = await req("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        customer: {
          email: "soon@example.com",
          name: "Soon",
          address: {
            line1: "1 Test St",
            city: "Seattle",
            state: "WA",
            postalCode: "98101",
            country: "US",
          },
        },
        cart: [{ sku: "WDIG-001", size: "M", qty: 1 }],
        website: "",
        formStartedAt: started,
      }),
    });
    // Local mock may still create orders in development — record accurately.
    const isProdLike = process.env.EXPECT_CHECKOUT_503 === "1";
    if (isProdLike) {
      record(
        8,
        "Checkout returns 503 until payments open",
        res.status === 503 ? "PASS" : "FAIL",
        `status=${res.status} body=${JSON.stringify(json)}`,
      );
    } else {
      record(
        8,
        "Checkout 503 until payments open",
        res.status === 503
          ? "PASS"
          : res.status === 200
            ? "INFO"
            : "FAIL",
        res.status === 200
          ? "Local mock allowed in development (expected). Set EXPECT_CHECKOUT_503=1 against production/preview without PAYMENTS_OPEN."
          : `status=${res.status} body=${JSON.stringify(json)}`,
      );
    }
  }

  const failed = results.filter((r) => r.status === "FAIL").length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const skipped = results.filter((r) => r.status === "SKIP" || r.status === "INFO").length;
  console.log(
    `\nSummary: ${passed} pass, ${failed} fail, ${skipped} skip/info (of ${results.length})`,
  );
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
