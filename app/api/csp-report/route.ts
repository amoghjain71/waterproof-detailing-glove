import {
  clientError,
  clientIp,
  noStoreJson,
  rateLimit,
} from "@/lib/api-guard";

/** CSP Report-Only collector. Accepts browser reports; rate-limited; no PII logged. */
export async function POST(request: Request) {
  const limited = rateLimit(`csp:${clientIp(request)}`, 30, 60_000);
  if (!limited.ok) {
    return noStoreJson(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const type = request.headers.get("content-type") || "";
  if (
    !type.includes("application/csp-report") &&
    !type.includes("application/reports+json") &&
    !type.includes("application/json")
  ) {
    return clientError(415, "Unsupported media type");
  }

  const length = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(length) && length > 16_384) {
    return clientError(413, "Payload too large");
  }

  try {
    const body = await request.json();
    const violated =
      body?.["csp-report"]?.["violated-directive"] ||
      body?.[0]?.body?.effectiveDirective ||
      "unknown";
    console.info("[csp-report]", { violated: String(violated).slice(0, 120) });
  } catch {
    return clientError(400, "Invalid JSON");
  }

  return noStoreJson({ ok: true });
}
