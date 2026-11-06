export type TrackEvent =
  | "view_item"
  | "select_size"
  | "add_to_cart"
  | "begin_checkout"
  | "join_waitlist"
  | "scroll_depth_50"
  | "open_size_calculator"
  | "select_bundle"
  | "notify_size"
  | "play_video"
  | "view_spec_sheet";

const STORAGE_KEY = "2hands-attribution";

const PARAMS = [
  "src",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>>;

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const next: Attribution = {};
  for (const key of PARAMS) {
    const value = params.get(key)?.trim();
    if (value) next[key] = value.slice(0, 80);
  }
  if (Object.keys(next).length === 0) return;
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...readAttribution(), ...next }),
  );
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Logs now. Swap the body for GA4 or Plausible without changing call sites. */
export function track(event: TrackEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    path: window.location.pathname,
    ...readAttribution(),
    ...props,
  };
  console.info("[track]", payload);
}
