/**
 * Fail the build if banned IP wording or the ® symbol appears in public source.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanRoots = ["app", "components", "content", "public", "lib"];
const fileRe = /\.(tsx?|jsx?|mjs|cjs|css|md|html|txt|svg|json)$/i;

/** Phrases that overclaim patent or exclusivity status. */
const bannedPhrases = [
  "patented",
  "patent-protected",
  "protected by patent",
  "patent protection",
  "patent secured",
  "patent approved",
  "patent granted",
  "provisional patent",
  "exclusive technology",
  "only glove",
  "first and only",
  "cannot be copied",
  "copy-proof",
  "made in usa",
  "american-made",
];

const hits = [];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === ".git"
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (fileRe.test(entry.name)) out.push(full);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

for (const dir of scanRoots) {
  for (const file of walk(path.join(root, dir))) {
    // Skip this audit's own source lists and the IP config NOTICE strings.
    const rel = path.relative(root, file);
    if (rel === path.join("scripts", "audit-ip.mjs")) continue;
    if (rel === path.join("docs", "IP_WORDING.md")) continue;
    if (rel === path.join("docs", "IP_AUDIT.md")) continue;

    let src;
    try {
      src = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    if (src.includes("®")) {
      hits.push(`${rel}:${lineOf(src, src.indexOf("®"))} registered trademark symbol`);
    }

    const lower = src.toLowerCase();
    for (const phrase of bannedPhrases) {
      let from = 0;
      while (from < lower.length) {
        const idx = lower.indexOf(phrase, from);
        if (idx === -1) break;
        // Allow the list of banned phrases inside audit/check scripts only.
        if (rel.startsWith(`scripts${path.sep}`)) {
          from = idx + phrase.length;
          continue;
        }
        hits.push(`${rel}:${lineOf(src, idx)} banned phrase "${phrase}"`);
        from = idx + phrase.length;
      }
    }
  }
}

// Also scan email HTML builders under lib/email.ts (already in lib/) and
 // content/emails.ts (already in content/). Done via scanRoots.

if (hits.length) {
  console.error(`audit-ip found ${hits.length} issue(s):\n`);
  for (const hit of hits) console.error(hit);
  process.exit(1);
}

console.log("audit-ip passed");
