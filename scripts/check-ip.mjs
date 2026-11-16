/**
 * Enforce patent-pending window while a nonprovisional is not yet filed.
 * - Empty or future PATENT_FILING_DATE: fail
 * - Filing date + 12 months passed and NONPROVISIONAL_FILED is false: fail
 * - 90 days or fewer remaining: warn
 * - 30 days or fewer remaining: warn again
 */
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.join(path.dirname(__filename), "..");
const require = createRequire(import.meta.url);
const { createJiti } = require("jiti");
const jiti = createJiti(__filename, { alias: { "@": root } });
const { IP } = jiti(path.join(root, "lib/ip.ts"));

const MS_DAY = 24 * 60 * 60 * 1000;

function parseFilingDate(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const [y, m, d] = trimmed.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date;
}

function utcToday() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

if (!IP.PATENT_PENDING) {
  console.log("check-ip: PATENT_PENDING is false; skipping window check.");
  process.exit(0);
}

const filed = parseFilingDate(IP.PATENT_FILING_DATE);
if (!filed) {
  console.error(
    "check-ip failed: PATENT_FILING_DATE must be a real YYYY-MM-DD from the USPTO filing receipt while PATENT_PENDING is true.",
  );
  process.exit(1);
}

const today = utcToday();
if (filed.getTime() > today.getTime()) {
  console.error(
    "check-ip failed: PATENT_FILING_DATE is in the future.",
  );
  process.exit(1);
}

const expires = new Date(filed.getTime());
expires.setUTCFullYear(expires.getUTCFullYear() + 1);
const daysLeft = Math.ceil((expires.getTime() - today.getTime()) / MS_DAY);

if (!IP.NONPROVISIONAL_FILED && daysLeft < 0) {
  console.error(
    `check-ip failed: patent-pending window expired on ${expires.toISOString().slice(0, 10)}. Set NONPROVISIONAL_FILED to true after filing the full application, or set PATENT_PENDING to false.`,
  );
  process.exit(1);
}

if (!IP.NONPROVISIONAL_FILED && daysLeft <= 30) {
  console.warn(
    `check-ip warning: ${daysLeft} day(s) left in the 12-month patent-pending window (expires ${expires.toISOString().slice(0, 10)}). File the nonprovisional or update IP flags.`,
  );
} else if (!IP.NONPROVISIONAL_FILED && daysLeft <= 90) {
  console.warn(
    `check-ip warning: ${daysLeft} day(s) left in the 12-month patent-pending window (expires ${expires.toISOString().slice(0, 10)}).`,
  );
} else {
  console.log(
    `check-ip passed (${daysLeft} day(s) left in patent-pending window; nonprovisional filed: ${IP.NONPROVISIONAL_FILED}).`,
  );
}
