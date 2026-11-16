# IP construction-detail audit

Search date: 2026-11-12. Scope: public customer UI, HTML source paths under `app/`, `components/`, `content/`, `data/`, `lib/`, `public/`, and related docs. Git history was not rewritten.

## Allowed to stay on customer surfaces

- Plain materials: about 1 mm neoprene core, nylon outside, polyester tricot inside, silicone sealing lip, 25 mm hook-and-loop strap
- Size M/L sample dimensions (260 / 95 / 80 / 60 mm)
- Care steps
- Test plan (what we do, at a customer level)
- How-it-works steps

## Removed or softened on customer surfaces (this pass)

| Location | What leaked | Action |
| --- | --- | --- |
| `components/home/SpecSheet.tsx` | Lip Shore A, wall thickness, contact-band width; core incoming tolerance ±0.10 mm; through-stitching note; sample dimensional tolerances | Spec rows rewritten to plain materials + sample sizes only |
| `content/faq.ts` | "adhesives" plus chloroprene chemical naming in materials answer | Softened to plain materials; allergen list kept without construction chem codes |
| `components/made/HowItsMadeContent.tsx` | "bonded and sealed"; "Cure it" | Joined/finished language; leak check without cure |
| `content/copy.ts` | "Bonded seams"; "Bond the body"; "Cure and test" | Sealed / Join / Test |
| `content/videos.ts` | "seam adhesive" in video label | Relabeled to joining panels |
| `app/how-its-made/page.tsx` | Meta "bonded, and sealed" | Softened |
| `components/tested/TestedPageContent.tsx` | Internal V-codes column | Code column removed |
| `components/home/ProvenSection.tsx` | V-codes in headings (unused on home, still in tree) | Codes removed from heading |
| `data/tests.ts` | Immersion fixture "20 mm below the opening"; "Dimension change within 3%" | Softened methods/pass lines |
| `components/home/HomeHero.tsx` | "CR neoprene" | Plain "neoprene" |
| `components/home/LayersSection.tsx` | "low-friction" / exact 1.0 mm alt wording | Softened alts |
| `README.md` | Tech pack WDIG-001 R01 reference | Removed |

## Still present in internal docs (not customer HTML)

These files are not shipped as pages, but they still describe construction detail. Do not copy them into customer UI.

| Location | Notes |
| --- | --- |
| `docs/PROMPT.md` | Full laminate, cuff, and tech-pack language |
| `docs/REDESIGN_PROMPT.md` | Full Spec sheet draft including Shore A, wall, contact band, tolerances |
| `docs/AUDIT.md` | Historical audit notes referencing tech pack and SKU |
| `lib/config.ts` | Internal `sku: "WDIG-001"` and `colorway` (not shown in footer) |

## `public/` folder

No matches for Shore A, tolerances, adhesives, contact band, or tech-pack text in `public/` media metadata scanned as text. Video/image binaries were not OCR'd.

## Git history

Prior commits still contain the old Spec sheet lip row, FAQ adhesive wording, and related copy. History was not rewritten. Treat old commits as sensitive if the repo is shared. To purge history later would require a coordinated force-push and is out of scope for this pass.

## Patent notice placement (step 1)

Customer-visible "Patent pending." only in: footer copyright line, Spec sheet footnote, order confirmation, order email footer, packaging copy module, About (`LONG_NOTICE`), `/legal/ip`.
