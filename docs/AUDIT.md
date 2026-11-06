# Phase 0 audit

Read-only. No components, tokens, copy, or config were changed.

The live homepage at waterproof-detailing-glove.vercel.app matches `components/home/HomeStory.tsx`: a full-viewport video hero, then a feature tour. The price is a caption under two links. The first screen has no size selector, ship window, or refund line.

Scope: `app/`, `components/`, `content/`, `data/`, `lib/`, and `app/globals.css`, checked against section 4 of `docs/REDESIGN_PROMPT.md`.

## 1. Vibe-coded tells

The site sits in the near-black plus one bright accent cluster the brief says not to keep, and it adds a second cyan accent.

### Theme, type, and raw color

| Tell | Where |
| --- | --- |
| Dark ground `#0a0b0d`, accent `#1f7bff`, second accent `#7fd6ff`, glass fill | `app/globals.css` lines 4–9 |
| Body falls back to `system-ui` | `app/globals.css` line 59 |
| Display is Archivo Black, body is DM Sans (not Barlow) | `app/layout.tsx` lines 11–21 |
| Theme color and `colorScheme: "dark"` | `app/layout.tsx` lines 24–26 |
| Headings forced to uppercase via `uppercase tracking-tight` on `font-display` | Nearly every section; examples below |
| Raw hex outside tokens: `#07080a`, `#16181d`, `#121418`, `#fff` | `components/home/HeroSection.tsx` lines 82 and 87; `components/home/SkipSectionButton.tsx` line 120; `components/glove/ProductGallery.tsx` line 36; `app/globals.css` lines 124, 186–189, 260, 275 |
| Default-feeling palette use: `text-red-300`, `bg-white/5`, `border-white/18`, `bg-white/[0.06]` | `components/layout/Footer.tsx` line 82; `components/ui/Button.tsx` line 21; `components/home/ProblemSection.tsx` lines 110, 123, 136 |

### Gradients, glows, and frosted glass

| Tell | Where |
| --- | --- |
| Text gradient on the footer wordmark (`.water-fill-wordmark`) | `app/globals.css` lines 127–145 |
| Button ripple radial glow (`.btn-ripple`) | `app/globals.css` lines 147–181; used by `components/ui/Button.tsx` line 36, `components/home/FinalCtaSection.tsx` line 175, `components/glove/GloveProduct.tsx` line 194 |
| Animated blue placeholder gradient | `app/globals.css` lines 183–193 |
| Slider thumb glow (`box-shadow: 0 0 0 4px`) | `app/globals.css` lines 261 and 276 |
| Hero scrim gradient plus extra black wash | `components/home/HeroSection.tsx` lines 87–88 |
| Page-hero radial glow | `components/ui/PageHero.tsx` line 18 |
| Final CTA gradient scrim | `components/home/FinalCtaSection.tsx` line 108 |
| Layers photo gradient and colored dots | `components/home/LayersSection.tsx` lines 139–152 |
| About photo gradient | `components/about/AboutContent.tsx` line 84 |
| `.glass` sets `backdrop-filter: blur(16px)` | `app/globals.css` lines 112–117 |
| Header frosted bar | `components/layout/Header.tsx` line 40 |
| Mobile menu frosted overlay | `components/layout/MobileMenu.tsx` line 20 |
| Skip-section pill with blur and colored shadow | `components/home/SkipSectionButton.tsx` lines 119–121 |
| Gallery controls and concept pill with blur | `components/glove/ProductGallery.tsx` lines 78, 86, 95, 102 |
| Size drawer blur and `shadow-2xl` | `components/glove/SizeDrawer.tsx` lines 25 and 32 |
| Hero outline button blur | `components/home/HeroSection.tsx` line 119 |
| Final CTA card blur | `components/home/FinalCtaSection.tsx` line 129 |
| Layers frame `shadow-2xl` | `components/home/LayersSection.tsx` line 127 |

### Pills, eyebrows, and the three-card row

`rounded-full` and `rounded-2xl` are the default radius. There is no `rounded-3xl`. The skip link is also a pill (`app/globals.css` line 89, `border-radius: 999px`).

Pill and heavy-radius examples:

- `components/ui/Button.tsx` line 36 (`rounded-full` plus magnetic wrap)
- `components/ui/PrototypeBadge.tsx` line 9
- `components/layout/Footer.tsx` lines 69 and 73
- `components/layout/Header.tsx` line 77 (menu button)
- `components/glove/GloveProduct.tsx` lines 134, 159, 173, 194, 282
- `components/home/FinalCtaSection.tsx` lines 129, 138, 151, 175, 190
- `components/home/ProblemSection.tsx` lines 110, 123, 136, and the circular clip at line 156
- `components/home/CuffSealSection.tsx` lines 66, 138, 142, 152, 162
- `components/home/SizeTeaserSection.tsx` lines 50, 51, 56, 110
- `components/commerce/CheckoutForm.tsx` lines 108, 120, 209
- `components/commerce/ConfirmationClient.tsx` line 77
- `components/tested/TestedPageContent.tsx` lines 55, 58, 90, 102
- `components/sizing/SizingPageContent.tsx` lines 36, 69, 139, 150

All-caps section eyebrows (`text-xs uppercase tracking-[0.2em] text-cyan`), the THE PROBLEM pattern:

| Label | File | Line |
| --- | --- | --- |
| The problem | `components/home/ProblemSection.tsx` | 104 |
| The pivot | `components/home/PivotSection.tsx` | 45 |
| Meet the glove | `components/home/MeetGloveSection.tsx` | 65 |
| Three layers | `components/home/LayersSection.tsx` | 102 |
| The cuff seal | `components/home/CuffSealSection.tsx` | 56 |
| Under the mitt | `components/home/UnderMittSection.tsx` | 10 |
| In use | `components/home/InUseSection.tsx` | 49 |
| How it's made | `components/home/MakingPreviewSection.tsx` | 48 |
| Built to be proven (eyebrow) | `components/home/ProvenSection.tsx` | 52 |
| Size finder | `components/home/SizeTeaserSection.tsx` | 38 |
| Survey wall | `components/home/SurveyWallSection.tsx` | 45 |
| Compare | `components/home/CompareSection.tsx` | 38 |
| Page heroes | `components/ui/PageHero.tsx` | 23 |
| Explore / Legal | `components/layout/Footer.tsx` | 87 and 105 |
| Pre-order eyebrow on the glove page | `components/glove/GloveProduct.tsx` | 118 |

Three identical stat cards in a row: `components/home/ProblemSection.tsx` lines 110–148 (`9 in 10`, `82%`, `64%`). Pivot is the same pattern as three glass cards (`components/home/PivotSection.tsx` line 58). In-use is three stacked cards beside one video (`components/home/InUseSection.tsx` lines 49–76).

ProvenSection draws a colored accent rule down the test list (`components/home/ProvenSection.tsx` lines 63 and 68). That is the colored-edge tell, on a timeline rather than a card border. No `border-l-*` utility showed up in components.

### Motion the brief removes

| Tell | Where |
| --- | --- |
| Preloader | `components/home/Preloader.tsx`, mounted in `components/home/HomeStory.tsx` line 26 |
| Custom droplet cursor | `components/layout/CustomCursor.tsx`, mounted in `components/providers/AppProviders.tsx` line 13; `html.has-custom-cursor` in `app/globals.css` lines 205–208 |
| Magnetic buttons | `components/ui/Magnetic.tsx`, wrapped from `components/ui/Button.tsx` lines 52–54; hero passes `magnetic` in `components/home/HeroSection.tsx` line 113 |
| Water-ripple shader | `components/home/WaterRipple.tsx`, mounted in `components/home/HeroSection.tsx` line 86 |
| Keyword marquee | `components/home/KeywordMarquee.tsx` lines 12 and 20–24; copy in `content/copy.ts` lines 38–44; CSS in `app/globals.css` lines 210–234 |
| Survey-quote marquee | `components/home/SurveyWallSection.tsx` lines 4–35 and 39–40; each quote is painted twice in the loop |
| Rain particles | `components/home/RainCanvas.tsx`, mounted in `components/home/FinalCtaSection.tsx` line 110 |
| Character-by-character headline | `components/ui/SplitText.tsx`, used in `components/home/HeroSection.tsx` lines 99–104; `.hero-headline` is uppercase and up to 11rem (`app/globals.css` lines 119–125) |
| Identical fade-up | `data-reveal` across `components/about/AboutContent.tsx` (line 44 and many nodes); compare rows in `components/home/CompareSection.tsx` lines 19–28; test cards in `components/tested/TestedPageContent.tsx` lines 28–38 |
| Hero scroll scale and fade | `components/home/HeroSection.tsx` lines 42–64 |
| Extra chrome not on the keep list | `components/layout/ScrollProgress.tsx` in `AppProviders`; `components/home/SkipSectionButton.tsx`; `components/home/DropletDivider.tsx` used at `ProblemSection.tsx` line 108 |
| Bouncing scroll cue | `components/home/HeroSection.tsx` lines 132–143 (`animate-bounce`, uppercase “Scroll”) |
| In-use section is pinned | `components/home/InUseSection.tsx` lines 24–29. The brief allows pins only on the turntable and the layer section |

Hero structure: a pill badge sits above the H1 (`HeroSection.tsx` lines 95–97 via `PrototypeBadge`). The headline is a slogan (`Wet job. Dry hands.`), not what the product is. Price is small print (`HeroSection.tsx` lines 127–129). Primary actions are “Shop the glove” and “See how it works”, not Pre-order.

### Concept pill and what is already clean

Every concept clip shows “Concept visualization”. The string is `components/media/VideoCaption.tsx` lines 16–17, styled as an uppercase micro-label (line 14). `components/media/AutoVideo.tsx` mounts it on every concept clip (lines 137–140 and 191–194). `SHOW_CONCEPT_LABEL` is true in `lib/config.ts` line 24. The live homepage repeats that label on the hero, problem, turntable, layers, cuff, mitt swap, full wash, bucket, dexterity, making steps, durability, and closing shot. A separate cyan pill appears only when a file is missing in dev (`AutoVideo.tsx` line 130). Gallery chrome pills (Expand, and the index) are `components/glove/ProductGallery.tsx` lines 95 and 102.

Not found, so they are not on the fix list:

- No Lucide icon imports. Feature decoration is annotation chips and stat cards instead (`content/copy.ts` `meetAnnotations`, lines 115–120).
- No emoji in JSX.
- No Inter, Geist, Space Grotesk, Plus Jakarta Sans, Roboto, or monospace face. The banned fallback is `system-ui` in `app/globals.css` line 59.
- No `hover:scale-*` or `hover:-translate-y-*`. Gallery arrows use a static `-translate-y-1/2` for centering (`ProductGallery.tsx` lines 78 and 86), which is not a hover lift.
- No invented customer names, star ratings, avatars, or press logos. Survey lines are labeled “From our survey · not a customer review”.

Em dashes in customer-facing copy (banned in section 4; en dashes in ranges such as 200–215 are a separate sizing issue in section 4 of this audit):

- `content/faq.ts` lines 18, 48, 66, 72
- `components/about/AboutContent.tsx` lines 15, 30, 104, 117, 134, 149, 208, 251
- `components/sizing/SizingPageContent.tsx` lines 16 and 31
- `components/home/SizeTeaserSection.tsx` lines 43–45
- `components/glove/GloveProduct.tsx` line 299
- `components/made/HowItsMadeContent.tsx` lines 16, 31, 67, 169
- `components/tested/TestedPageContent.tsx` line 64 (“No certification theater”)
- `data/tests.ts` line 90 and `data/sizes.ts` lines 102, 109, 116 (these strings render on the sizing UI)

## 2. Duplicated content

Same video twice on the home page:

- `full-wash-in-use` in `components/home/UnderMittSection.tsx` line 31, and again as the first slide of `components/home/InUseSection.tsx` (`content/copy.ts` `inUseSlides`, lines 147–166, rendered at `InUseSection.tsx` line 90).

Same video on home and on `/tested`:

- `durability-montage` in `components/home/ProvenSection.tsx` line 91 and `components/tested/TestedPageContent.tsx` line 56.

Survey quotes appear three times, and the marquee paints each one twice:

- Shortened inside `content/copy.ts` `pivotCards` lines 59–72, rendered by `components/home/PivotSection.tsx`.
- All six in `components/home/SurveyWallSection.tsx`. `MarqueeRow` copies the array (`line 12`) and the section slices them into two rows (lines 39–40).
- All six again in `components/about/AboutContent.tsx` lines 218–232.

The home page also repeats whole modules that already have their own routes:

| Repeated module | Home | Also lives at |
| --- | --- | --- |
| Size finder | `components/home/SizeTeaserSection.tsx` | `components/sizing/SizingPageContent.tsx` and `components/sizing/SizeFinder.tsx` |
| Making steps | `components/home/MakingPreviewSection.tsx` | `components/made/HowItsMadeContent.tsx` |
| Test gates | `components/home/ProvenSection.tsx` | `components/tested/TestedPageContent.tsx` |
| FAQ | `components/home/HomeFaqSection.tsx` | `app/faq/page.tsx` |
| Buy UI | `components/home/FinalCtaSection.tsx` | `components/glove/GloveProduct.tsx` |

Making films exist twice in the catalog. Home uses the short clips (`making-inspect` through `making-finish`, `content/copy.ts` lines 138–146). Longer films remain in `content/videos.ts`: `making-lamination-cutting` (line 112), `making-seal-bonding` (line 119), and `making-leak-test` (line 126), alongside `making-test` (line 182).

`hero-droplets` is the home hero (`HeroSection.tsx` line 84) and is not the dry-hand moment the brief wants first (`bucket-dip-dry-reveal` and `mitt-swap`).

## 3. Internal language on customer pages

| Leak | Where |
| --- | --- |
| Footer prints `SKU WDIG-001` and `Prototype V2` | `components/layout/Footer.tsx` lines 126–128 |
| `BRAND.sku` is `WDIG-001`, `colorway` is `BLK-01` | `lib/config.ts` lines 5–6 |
| Glove meta description says `Matte black BLK-01` | `app/glove/page.tsx` line 9 |
| JSON-LD includes `sku` and `color` from those fields | `components/seo/ProductJsonLd.tsx` lines 13–14 |
| Pill copy `Prototype V2. Testing in progress.` | `content/copy.ts` line 19, rendered by `components/ui/PrototypeBadge.tsx` in the hero and the footer |
| Home test list headings are `V01 · Body leakage` through `V08`, each with a `Planned` pill | `components/home/ProvenSection.tsx` lines 12, 70–75; data in `data/tests.ts` lines 18–93 |
| `/tested` shows the code as the eyebrow and `Planned` as a pill | `components/tested/TestedPageContent.tsx` lines 12, 94–103 |
| Page intro says `Prototype V2 validation gates` | `components/tested/TestedPageContent.tsx` line 51 |
| FAQ names `V06` and `Prototype V2` | `content/faq.ts` lines 36 and 72 |
| Glove page aside says `Prototype V2 testing is in progress` | `components/glove/GloveProduct.tsx` line 299 |
| Terms page says `Prototype V2` and `Planned retail` | `app/legal/terms/page.tsx` lines 16 and 22 |
| Comment in config: `Planned retail target` | `lib/config.ts` line 9 (not rendered, but the word is in the customer terms page) |

No POM or BOM strings in customer components. `R01` does not appear. `Prototype V2` in `data/sizes.ts` line 22 is a code comment, not rendered, except where the UI repeats the phrase above.

## 4. Claims that are not supported yet

All eight gates in `data/tests.ts` are `status: "planned"`. `CLAIM_LEVEL` is `intent` (`lib/config.ts` line 21), which is the right guardrail. `NOT_CLAIMING_YET` on the tested page (`data/tests.ts` lines 96–102, rendered in `components/tested/TestedPageContent.tsx` lines 67–76) is the honest block and should stay. These lines still read as finished facts:

| Claim | Why it is early | Where |
| --- | --- | --- |
| “paint-safe” | Paint contact is untested | `content/copy.ts` line 71; `components/about/AboutContent.tsx` line 15; `components/made/HowItsMadeContent.tsx` line 16 |
| Compare cell `Yes — under mitt` for paint-safe contact | States a result | `content/copy.ts` lines 79–84 |
| `82% want waterproof protection` as a home stat card | Survey interest, not demand the brief wants on the page. Source is fine as a footnote only | `content/copy.ts` lines 50–53; `components/home/ProblemSection.tsx` line 130; source text `content/survey.ts` lines 27–29 (`n=62`) |
| “finish with warmer, drier hands” | V08 is optional and planned. Must not imply a thermal rating | `content/copy.ts` line 37 |
| Outer face is a “water-repellent surface” as if measured | Not a reported test result | `content/copy.ts` line 125; `components/glove/GloveProduct.tsx` line 304; `components/home/LayersSection.tsx` line 15; `components/made/HowItsMadeContent.tsx` line 16 |
| L and XL marked `confirmed` at 216–230 mm and 231–250 mm, with invented sample dimensions (270/85/102 and 280/90/110) | Tech pack says not to auto-scale M. Calculator can recommend L and XL | `data/sizes.ts` lines 47–70 and `recommendSize` lines 96–110; copy repeats the ranges in `components/home/SizeTeaserSection.tsx` lines 43–45 and `content/faq.ts` line 48 |
| Ship timing is “after fit-trial lock and first production run” | Not a real date range | `lib/config.ts` lines 28–29 |
| Product title and hero say waterproof without “designed to” beside the claim | Name can stay. The H1 and subline do not carry the intent hedge | `content/copy.ts` lines 14–15; `components/home/HeroSection.tsx` lines 98–110 |

Config the buy module will need does not exist yet. Do not add it in this phase. Missing: `SHIP_WINDOW`, `REFUND_PROMISE_SHORT`, `REFUND_PROMISE_LONG`, `EXCHANGE_POLICY_TEXT`, `PREORDER_CHARGE_TIMING`, `BUNDLES`, `MITT_SKU_AVAILABLE`, `SIZES_CONFIRMED`. `FREE_SHIPPING_OVER_USD` is 50 (`lib/config.ts` line 27); the brief default is 40. The owner still has to confirm the ship dates and which refund terms he can honor.

No prototype photos are in the repo. Hero media stays schematic or the existing clips until a later phase. `components/seo/ProductJsonLd.tsx` lines 21–25 point at `/images/glove/01-back-of-hand.jpg` and three siblings. Treat those as slots to verify before calling them real product photography.

Banned hype words from section 5 (unlock, empower, elevate, seamless, revolutionize, game-changing, next-level, cutting-edge, premium experience, journey, supercharge) did not show up in customer copy. “Engineered cuff seal” is the feature-name tell the brief wants rewritten as “Sealed cuff” plus the spec. The eyebrow is `components/home/CuffSealSection.tsx` line 56 and the H2 is line 58. The paragraph under it (lines 60–63) already uses “designed to”, then says the closure “cannot scratch paint”, which is the same untested paint claim as above.

## 5. Delete, restyle, or keep

Do not delete any of these in Phase 0. This is the later-phase list.

### Delete

These do not demonstrate the product:

- `components/home/Preloader.tsx`
- `components/layout/CustomCursor.tsx`
- `components/ui/Magnetic.tsx`
- `components/home/WaterRipple.tsx`
- `components/home/RainCanvas.tsx`
- `components/home/KeywordMarquee.tsx`
- `components/home/SurveyWallSection.tsx`
- `components/ui/SplitText.tsx`
- `components/ui/PrototypeBadge.tsx`
- `components/home/SkipSectionButton.tsx`
- `components/home/DropletDivider.tsx`
- `components/layout/ScrollProgress.tsx`

`components/home/HomeStory.tsx` section order goes away when the home page is rebuilt. The file can stay as the home composer.

### Keep the behavior, rebuild the look

- Scroll-scrubbed turntable: `components/home/MeetGloveSection.tsx`
- Exploded three-layer view: `components/home/LayersSection.tsx`
- Cuff diagram drawing on, and the strap open/closed toggle: `components/home/CuffSealSection.tsx`
- Mitt sliding over the glove: `mitt-swap` in `components/home/UnderMittSection.tsx` (drop the second `full-wash-in-use` on that same screen)
- Cart: `lib/store/cart.ts`, `components/commerce/CartDrawer.tsx`, `components/commerce/CartButton.tsx`
- Payments: `lib/payments/`
- Video map and player: `content/videos.ts`, `components/media/AutoVideo.tsx` (shrink the concept mark; do not drop the honesty label)
- Claims switch: `CLAIM_LEVEL` in `lib/config.ts`
- Routes under `app/`
- Data files: `content/faq.ts`, `content/survey.ts`, `data/tests.ts`, `data/sizes.ts` (wording and the L/XL status change later; do not delete the files)

Header hide-on-scroll-down already works (`components/layout/Header.tsx` lines 16–25). Keep that behavior.

### Restyle, do not throw away

- `components/ui/Button.tsx` (needs real loading, disabled, and error states; it only has `disabled` opacity today)
- `components/layout/Header.tsx`, `components/layout/MobileMenu.tsx`, `components/layout/Footer.tsx`
- `components/commerce/CartDrawer.tsx`, `components/commerce/CheckoutForm.tsx`, `components/commerce/PaymentSlot.tsx`, `components/commerce/ConfirmationClient.tsx`
- `components/ui/PageHero.tsx`
- FAQ accordion: `components/home/HomeFaqSection.tsx` and the glove FAQ block in `components/glove/GloveProduct.tsx`
- Compare table data in `content/copy.ts` `compareRows` (wording changes; the table stays)
- `components/sizing/SizeFinder.tsx`, `components/sizing/HandMeasureDiagram.tsx`, `components/sizing/SizingPageContent.tsx`
- Legal pages under `app/legal/`
- `components/about/AboutContent.tsx` (real founder copy is here; the survey list should not repeat the home page)
- `components/made/HowItsMadeContent.tsx` and `components/tested/TestedPageContent.tsx`
- `app/globals.css` tokens, radii, and the glass, gradient, marquee, and ripple classes

### Config and media to add later, not now

`SHIP_WINDOW`, `REFUND_PROMISE_SHORT`, `REFUND_PROMISE_LONG`, `EXCHANGE_POLICY_TEXT`, `PREORDER_CHARGE_TIMING`, `BUNDLES`, `MITT_SKU_AVAILABLE`, `SIZES_CONFIRMED`. No real prototype photo set is in the repo yet. Hero views stay schematic, or use the existing clips, until those photos exist.

## Stop

Phase 0 ends with this file and `docs/REDESIGN_PROMPT.md`. Phases 1–5 wait for a separate approval each.
