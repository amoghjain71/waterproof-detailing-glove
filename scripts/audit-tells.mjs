import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = ["app", "components"];
const allowHex = new Set([path.normalize("app/tokens.css")]);

const bannedFonts =
  /\b(Inter|Geist|Space Grotesk|Space_Grotesk|Plus Jakarta|Plus_Jakarta|Roboto|Arial|system-ui|ui-monospace|monospace|Menlo|Courier)\b/;
const bannedPalette =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|placeholder|decoration|accent|caret|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?(?:\/\d+)?\b/g;
const bannedRadius =
  /\brounded-(?:sm|md|lg|xl|2xl|3xl|full|[trbl]{1,2}|[trbl](?:l|r)?)\b/g;
const bannedType =
  /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g;
const spacingRe =
  /(?:^|[\s"'`])(-?)(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(\d+(?:\.\d+)?|px)\b/g;
const arbitraryRe = /[\w:/.-]+\[[^\]]+\]|(?:^|\s)\[[^\]]+\]/g;
const hexRe = /#[0-9a-fA-F]{3,8}\b/g;
const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

const hits = [];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function add(file, line, message) {
  hits.push(`${path.relative(root, file)}:${line} ${message}`);
}

function extractClassText(src) {
  const parts = [];
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf("className", i);
    if (idx === -1) break;
    let j = idx + "className".length;
    while (src[j] === " " || src[j] === "\n") j += 1;
    if (src[j] !== "=") {
      i = idx + 1;
      continue;
    }
    j += 1;
    while (src[j] === " " || src[j] === "\n") j += 1;
    if (src[j] === '"' || src[j] === "'") {
      const quote = src[j];
      const end = src.indexOf(quote, j + 1);
      if (end === -1) break;
      parts.push(src.slice(j + 1, end));
      i = end + 1;
      continue;
    }
    if (src[j] === "{") {
      let depth = 0;
      let k = j;
      for (; k < src.length; k += 1) {
        if (src[k] === "{") depth += 1;
        else if (src[k] === "}") {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      parts.push(src.slice(j + 1, k));
      i = k + 1;
      continue;
    }
    i = idx + 1;
  }
  return parts.join("\n");
}

function spacingPx(token) {
  if (token === "px") return 1;
  return Number(token) * 4;
}

function checkClasses(file, src) {
  const classes = extractClassText(src);
  if (!classes) return;

  const flags = [
    [/backdrop-blur|bg-gradient|linear-gradient|radial-gradient|\bglass\b/g, "frosted glass, gradient, or glass"],
    [/\buppercase\b/g, "uppercase label"],
    [/hover:scale-|hover:-translate-y-/g, "hover scale or lift"],
    [/\banimate-marquee/g, "marquee"],
    [bannedPalette, "default palette color"],
    [bannedType, "type size outside the six-size scale"],
  ];

  for (const [re, message] of flags) {
    re.lastIndex = 0;
    let match = re.exec(classes);
    while (match) {
      add(file, lineOf(src, src.indexOf(match[0])), message);
      match = re.exec(classes);
    }
  }

  bannedRadius.lastIndex = 0;
  let radius = bannedRadius.exec(classes);
  while (radius) {
    const lineStart = src.lastIndexOf("\n", src.indexOf(radius[0]));
    const lineEnd = src.indexOf("\n", src.indexOf(radius[0]));
    const line = src.slice(lineStart, lineEnd === -1 ? src.length : lineEnd);
    if (!(radius[0] === "rounded-full" && line.includes("cart-badge"))) {
      add(file, lineOf(src, src.indexOf(radius[0])), `radius ${radius[0]}`);
    }
    radius = bannedRadius.exec(classes);
  }

  arbitraryRe.lastIndex = 0;
  let arbitrary = arbitraryRe.exec(classes);
  while (arbitrary) {
    add(file, lineOf(src, src.indexOf(arbitrary[0])), `arbitrary value ${arbitrary[0]}`);
    arbitrary = arbitraryRe.exec(classes);
  }

  spacingRe.lastIndex = 0;
  let space = spacingRe.exec(classes);
  while (space) {
    const px = spacingPx(space[3]);
    if (!Number.isFinite(px) || px % 4 !== 0) {
      add(file, lineOf(src, src.indexOf(space[0].trim())), `spacing ${space[0].trim()} is not a multiple of 4`);
    }
    space = spacingRe.exec(classes);
  }
}

function checkFile(file) {
  const rel = path.relative(root, file);
  const src = fs.readFileSync(file, "utf8");

  if (!allowHex.has(path.normalize(rel))) {
    hexRe.lastIndex = 0;
    let hex = hexRe.exec(src);
    while (hex) {
      add(file, lineOf(src, hex.index), `hex ${hex[0]}`);
      hex = hexRe.exec(src);
    }
  }

  if (bannedFonts.test(src)) {
    const match = src.match(bannedFonts);
    add(file, match ? lineOf(src, src.indexOf(match[0])) : 1, `font ${match?.[0]}`);
  }
  if (src.includes("lucide-react")) add(file, 1, "lucide icon import");
  if (src.includes("—")) add(file, lineOf(src, src.indexOf("—")), "em dash");
  if (emojiRe.test(src)) add(file, 1, "emoji");

  if (file.endsWith(".css")) {
    if (/gradient|backdrop-filter|backdrop-blur/i.test(src)) {
      add(file, 1, "gradient or backdrop blur in CSS");
    }
    if (/box-shadow\s*:/i.test(src)) add(file, 1, "box shadow in CSS");
    if (/text-transform\s*:\s*uppercase/i.test(src)) add(file, 1, "uppercase in CSS");
    const radiusRe = /border-radius\s*:\s*([^;]+)/gi;
    let radius = radiusRe.exec(src);
    while (radius) {
      const value = radius[1].trim();
      if (value !== "0" && value !== "4px") {
        add(file, lineOf(src, radius.index), `radius ${value}`);
      }
      radius = radiusRe.exec(src);
    }
    if (/marquee/i.test(src)) add(file, 1, "marquee in CSS");
  } else {
    checkClasses(file, src);
  }
}

for (const dir of roots) {
  for (const file of walk(path.join(root, dir))) checkFile(file);
}

if (hits.length) {
  console.error(`audit:tells found ${hits.length} issue(s):\n`);
  console.error(hits.join("\n"));
  process.exit(1);
}

console.log("audit:tells passed");
