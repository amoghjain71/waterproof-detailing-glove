import "server-only";

import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";

const MAX_BODY_BYTES = 32_768;
const MIN_FILL_MS = 2_000;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function noStoreJson(
  body: unknown,
  init?: { status?: number; headers?: HeadersInit },
) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

/** Generic client error — no stack traces or provider details. */
export function clientError(status: number, message = "Request failed") {
  return noStoreJson({ error: message }, { status });
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** App-level limiter. Pair with Vercel Firewall rate rules in production. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { ok: true };
}

export function assertJsonContentType(request: Request): boolean {
  const type = request.headers.get("content-type") || "";
  return type.includes("application/json");
}

export function assertBodyWithinLimit(request: Request): boolean {
  const raw = request.headers.get("content-length");
  if (!raw) return true;
  const length = Number(raw);
  return Number.isFinite(length) && length <= MAX_BODY_BYTES;
}

function originHosts(): Set<string> {
  const hosts = new Set<string>();
  try {
    hosts.add(new URL(getEnv().siteUrl).host);
  } catch {
    /* ignore */
  }
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) hosts.add(vercel.includes("://") ? new URL(vercel).host : vercel);
  return hosts;
}

function hostnameOf(host: string): string {
  return host.replace(/^\[|\]$/g, "").split(":")[0]?.toLowerCase() || host;
}

function isLoopbackHost(host: string): boolean {
  const name = hostnameOf(host);
  return name === "localhost" || name === "127.0.0.1" || name === "::1";
}

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const got = new URL(origin);
    const hostHeader = request.headers.get("host");
    // Primary CSRF check: browser Origin must match this request's Host.
    if (hostHeader && got.host === hostHeader) return true;
    // Loopback alias (localhost ↔ 127.0.0.1) on the same port family.
    if (
      hostHeader &&
      isLoopbackHost(got.host) &&
      isLoopbackHost(hostHeader) &&
      hostnameOf(got.host) !== hostnameOf(hostHeader)
    ) {
      return true;
    }
    // Configured public site + Vercel deployment host.
    if (originHosts().has(got.host)) return true;
    return false;
  } catch {
    return false;
  }
}

export function assertAbuseFields(input: {
  website?: string;
  formStartedAt?: number;
}): boolean {
  if (input.website && input.website.length > 0) return false;
  if (typeof input.formStartedAt !== "number") return false;
  const age = Date.now() - input.formStartedAt;
  if (!Number.isFinite(age) || age < MIN_FILL_MS || age > 1000 * 60 * 60 * 6) {
    return false;
  }
  return true;
}

export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; body: unknown } | { ok: false; response: NextResponse }> {
  if (!assertJsonContentType(request)) {
    return { ok: false, response: clientError(415, "Unsupported media type") };
  }
  if (!assertBodyWithinLimit(request)) {
    return { ok: false, response: clientError(413, "Payload too large") };
  }
  try {
    const body = await request.json();
    return { ok: true, body };
  } catch {
    return { ok: false, response: clientError(400, "Invalid JSON") };
  }
}

export function gatePublicPost(
  request: Request,
  routeKey: string,
): NextResponse | null {
  if (!assertSameOrigin(request)) {
    return clientError(403, "Forbidden");
  }
  const limited = rateLimit(`${routeKey}:${clientIp(request)}`, 5, 60_000);
  if (!limited.ok) {
    return noStoreJson(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }
  return null;
}
