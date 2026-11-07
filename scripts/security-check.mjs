#!/usr/bin/env node
/**
 * npm run security:check
 * Runs audit, signatures, outdated, and a redacted secret pattern scan.
 * Prefer installing gitleaks locally for a stronger history scan (ask before adding).
 */
import { spawnSync } from "node:child_process";

const root = process.cwd();
let failed = false;

function run(label, command, args, { allowFail = false } = {}) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    if (allowFail) {
      console.warn(`[security:check] ${label} exited ${result.status ?? "null"} (allowed)`);
    } else {
      failed = true;
      console.error(`[security:check] ${label} exited ${result.status ?? "null"}`);
    }
  }
  return { ok: result.status === 0, stdout: result.stdout || "", stderr: result.stderr || "" };
}

run("npm audit --omit=dev --audit-level=high", "npm", [
  "audit",
  "--omit=dev",
  "--audit-level=high",
]);

{
  const sig = run("npm audit signatures", "npm", ["audit", "signatures"], {
    allowFail: true,
  });
  const text = `${sig.stdout}\n${sig.stderr}`;
  if (!sig.ok) {
    if (
      text.includes("EMISSINGSIGNATUREKEY") &&
      text.includes("magic-string")
    ) {
      console.warn(
        "[security:check] Known registry gap: magic-string attestations missing public key. Tracked; not failing the check.",
      );
    } else {
      failed = true;
      console.error("[security:check] Unexpected npm audit signatures failure");
    }
  }
}

console.log("\n=== npm outdated ===");
{
  const result = spawnSync("npm", ["outdated"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (!result.stdout?.trim())
    console.log("(all direct deps within requested ranges / none outdated)");
}

console.log("\n=== secret pattern scan (redacted) ===");
const gitleaks = spawnSync("gitleaks", ["version"], { encoding: "utf8" });
if (gitleaks.status === 0) {
  run("gitleaks detect", "gitleaks", ["detect", "--source", ".", "--no-banner"]);
} else {
  // Require a plausible secret body after the prefix (not docs mentioning sk_test_).
  const pattern =
    "(sk_live_|sk_test_|rk_live_|rk_test_|whsec_|pk_live_|pk_test_|ghp_|github_pat_)[A-Za-z0-9]{16,}";
  const tree = spawnSync("git", ["grep", "-n", "-I", "-E", pattern, "HEAD"], {
    cwd: root,
    encoding: "utf8",
  });
  const ignorePath = (line) =>
    line.includes(".env.example") ||
    line.includes("docs/SECURITY") ||
    line.includes("scripts/security-check.mjs") ||
    line.includes("scripts/phase4-attack-tests.mjs") ||
    line.includes(".githooks/pre-commit");

  const lines = (tree.stdout || "")
    .split("\n")
    .map((line) =>
      line
        .replace(
          /(sk_live_|sk_test_|rk_live_|rk_test_|whsec_|pk_live_|pk_test_|ghp_|github_pat_)[A-Za-z0-9_]+/g,
          "$1[REDACTED]",
        )
        .trim(),
    )
    .filter(Boolean)
    .filter((line) => !ignorePath(line));
  if (lines.length) {
    failed = true;
    console.error("Potential secret patterns (values redacted):");
    for (const line of lines.slice(0, 50)) console.error(line);
  } else {
    console.log("No high-risk patterns outside placeholders/docs on HEAD.");
    console.log(
      "gitleaks not installed — install when approved for full history scan.",
    );
  }
}

if (failed) {
  console.error("\n[security:check] FAILED");
  process.exit(1);
}
console.log("\n[security:check] OK");
