# THE PROMPT

Saved for phased execution. Product code is unchanged until a later phase is approved.

## 1. Mission and rules of engagement

You are a senior product designer and front-end engineer. The existing Next.js site for 2HANDS (a thin waterproof inner glove worn under a car wash mitt, $24.99 per pair, currently pre-order) works, but it reads as vibe-coded and it is structured like a feature tour instead of a store selling one product. Refactor it. Keep the stack, routes, cart, payment abstraction, video system, data files and claims guardrails. Change the design system, copy, page structure and motion discipline.

Do not rebuild from scratch. Do not add new libraries unless a task below requires it. Work in the phases in section 14, and stop after each one.

Why this is needed (context, from research):

- Vibe-coded sites look alike because nobody decided how the site should look, so the model falls back to the average of everything it was trained on. The cure is a small set of design decisions made once, written down, and referenced by every page. Better prompting page by page does not hold, because the choices drift.
- The common tells are: purple or blue gradients and glows, a centered hero in Inter with a pill badge above the headline, three identical icon cards in a row, the fixed order of hero, features grid, social proof, pricing, FAQ, footer, heavy rounded corners with the same soft shadow everywhere, frosted glass, emoji as icons, all-caps section labels, and copy that could belong to any company.
- Anti-slop advice has its own default cluster too: near-black background with one bright accent, cream background with a serif and terracotta, and newspaper-style hairline layouts. The current site sits in the first one. Do not move to another default. Follow the decisions in section 3.
- Conventional layouts are fine. Familiar structure helps usability. What looks cheap is a site that visibly nobody decided anything about.
- A single-product store wins by focus: the homepage says what the product is within three seconds, shows the product, gives one clear path to buy, puts proof high on the page, answers objections on the page, and keeps checkout short.
- A pre-order store wins by being specific and safe: a real ship window, a stated refund promise, and visuals that look finished.

Added from the research doc:

- A prose prompt is temporary memory. Design decisions have to live in tokens and a short rules file that every component reads, or the look drifts between pages.
- First-pass AI interfaces mostly fail on consistency: type scale, spacing, radii and component states. The audit script now checks those too.
- Cold social traffic (TikTok, Instagram, car meets) arrives in browse mode and converts far lower than email traffic. The research doc cites about 0.7% to 1.2% against 4% to 5% (a Shopify agency blog, not verified here). So the hero must match the video that sent the visitor, and email capture matters.
- Write plain copy at about a grade 6 reading level.
- Bundling raises order value and absorbs fulfillment cost, which the supply chain plan puts at about $4 to $6 per order.

## 2. Phase 0: audit before changing anything

Read the whole repo and the live pages. Write docs/AUDIT.md with:

1. Every vibe-coded tell you find, with file and line (use the list in section 4).
2. Every place where content is duplicated (for example the same video or survey quotes appearing twice).
3. Every place where internal tech-pack language leaks into customer copy (test codes like V01 to V08, SKU WDIG-001 in the footer, status badges reading Planned).
4. Every claim that is not supported yet.
5. A list of components to delete, restyle or keep.

Do not edit code in this phase.

## 3. The five design decisions (made for you, do not substitute)

Create DESIGN.md at the repo root recording these, and implement them as CSS variables and Tailwind theme tokens. Every component must use tokens. No raw hex values and no default Tailwind palette colors (indigo, violet, purple, slate, zinc and so on) anywhere in components.

Theme: bright wash bay, not a dark showroom. Light cool-gray ground so the black glove is the strongest object on the page, with a few full-bleed near-black bands only where video plays. The mood is a clean detailing bay with wet concrete, not a tech launch.

Color (each tied to something real):

| Token | Value | Why it exists |
| --- | --- | --- |
| --ground | #E8EBED | wet concrete floor |
| --surface | #F6F7F8 | foam and clean panels |
| --ink | #0F1216 | the glove, matte black |
| --ink-muted | #4B5560 | secondary text (meets AA on ground) |
| --rule | #C5CCD2 | 1px hairlines |
| --brand | #1B5FE0 | the blue in the 2HANDS logo; used only for the logo, the primary button, links and focus rings |
| --band | #0B0D10 | video bands |
| --brand-on-band | #6FA3FF | blue text or links on dark bands |

No gradients, no glows, no second accent color.

Type: Barlow Condensed (600 and 700) for headings in sentence case, tight but not all caps. Barlow (400, 500, 600) for body and for technical labels, with tabular numerals. Self-host with next/font. No Inter, Geist, Space Grotesk, Plus Jakarta Sans, Roboto, Arial, system-ui or any monospace font. Six sizes only on desktop, with fluid clamp values on mobile: 64 px with line-height 1.05 (H1), 44 px at 1.1 (H2), 28 px at 1.2 (H3), 20 px at 1.5 (large body), 18 px at 1.55 (body), 14 px at 1.4 (labels and captions). Body measure about 62 characters.

Layout: left-aligned text on a 12-column grid, max width 1280 px, 8 px spacing base. Asymmetric splits (7/5 and 5/7), product imagery bleeding to the viewport edge on one side. No centered hero stack. No row of three identical icon cards anywhere. Alternate full-width image/text rows, use a plain spec table, and use a numbered list for steps.

Tone and shape: dense but calm. Corner radius 4 px on buttons and inputs, 0 on images and media. No pill shapes. No box shadows (use 1px --rule borders). Buttons are rectangles, 48 px tall, fill --brand with white text, hover darkens 8 percent with no glow. Secondary buttons are ink outline. No badges or pills; use a plain text label with a thin rule.

Spacing and radius contract: a 4 px base grid. Every margin, padding and gap is a multiple of 4 (4, 8, 12, 16, 24, 32, 48, 64, 96). One radius for everything that has one: 4 px on cards, buttons, inputs and tags, 0 on media. Never mix radii between sibling components.

States: every interactive component has default, hover, focus-visible, active, loading, disabled and error states, driven by real React state. Buttons show a spinner while an action runs. Data areas show skeleton loaders. No dead links, no toggles that do nothing, no static carousels. Hover changes border color or background only: no scale, lift or glow.

Visual reference direction: utilitarian technical-apparel product pages and serious detailing-supply shops. Dense spec tables, honest photography, hairline grids. Not a SaaS landing page.

Rules file: create .cursor/rules/design.mdc (under about 60 lines) listing only the tokens, the six sizes, the spacing and radius contract, the banned patterns in section 4 and the claims guardrails. Components read tokens. No raw hex values, no arbitrary Tailwind values such as p-[13px], no default Tailwind palette colors.

## 4. Banned patterns and an automated check

Remove or replace all of these:

- gradient backgrounds, text gradients, glow or neon shadows, colored box shadows
- backdrop-blur and frosted glass panels
- rounded-2xl, rounded-3xl, rounded-full (except a round cart badge)
- a pill badge above the hero headline; pulsing dots; sparkle or emoji icons
- all-caps section eyebrow labels such as THE PROBLEM, THE PIVOT, MEET THE GLOVE
- colored left borders on cards
- three identical stat or feature cards in a row
- infinite marquee tickers (both the keyword ticker and the survey-quote wall)
- stock lucide icons used as decoration beside every feature
- identical reveal-on-scroll fade-up applied to every element

Also banned:

- fonts: Inter, Geist, Space Grotesk, Plus Jakarta Sans, Roboto, Arial, system-ui, any monospace face
- default Tailwind palette colors (indigo, violet, purple, slate, zinc, amber, cyan and the rest)
- uppercase micro-labels on every card and badge, and status pills such as R01 PROTOTYPE or BATCH 01
- hover:scale-*, hover:-translate-y-* and colored drop shadows
- em dashes in copy; use commas, periods or colons
- invented testimonials, avatars or customer names

Create scripts/audit-tells.mjs that greps app/, components/ and CSS for the Tailwind classes and patterns above, plus any Inter or Geist import, any hex value outside the token file, and any emoji in JSX. It must exit with code 1 on any hit. Add npm run audit:tells and run it in npm run build.

The script must also flag arbitrary Tailwind values (anything in square brackets), spacing that is not a multiple of 4, radii outside the contract, hover:scale and -translate-y hover effects, and any font family other than Barlow and Barlow Condensed.

## 5. Voice and copy rules

Write like a detailer talking to another detailer: short sentences, concrete nouns, no hype. Rewrite every customer-facing string in content/copy.ts.

- Banned words: unlock, empower, elevate, seamless, revolutionize, game-changing, next-level, cutting-edge, premium experience, journey, supercharge.
- Do not name features like tech startups (no Seamless Integration style names). Name what it is: Sealed cuff. 25 mm strap. 1 mm neoprene.
- Lead with the benefit in plain words, put the spec right after it as a small fact.
- Keep the claims guardrails: say designed to, built to, intended to until tests pass. Never write certified, chemical-resistant, hypoallergenic, thermal rated or PPE.
- Remove all internal language from customer pages: V01 to V08 codes, WDIG-001, BOM wording, POM names, the word Planned in badges.

Reading level: short sentences and common words, about grade 6 to 8. Say what it does before how it is made.

Examples of the direction:

| Current | Replace with |
| --- | --- |
| Cold and wet hands are the current wash experience | Bucket water soaks through every wash mitt in seconds. |
| Thin enough to live under any mitt | One millimeter of neoprene. Your mitt still slides on. |
| Engineered cuff seal | A soft silicone lip and a 25 mm strap close the cuff, so the water has nowhere to run in. (Designed to, pending test results.) |
| Close the wash dry | Pre-order the glove. |
| Stay in the wash | Get fit trial updates and test results by email. |

## 6. Restructure: one product, one path

Replace the story-tour home page with this order. Each item is one section. Use the existing videos and images where they fit.

1. Announcement bar (one line): Pre-order. Ships {SHIP_WINDOW}. {REFUND_PROMISE_SHORT}. Free shipping over ${FREE_SHIPPING_OVER_USD}. Values come from lib/config.ts. No status pills and no claims such as field-validated.
2. Header: logo left; four anchor links that scroll within the home page (How it works, Spec, Sizing, FAQ); Cart with an item count; a Pre-order button showing the price. About, Tested and Contact live in the footer. Sticky, hides on scroll down, shows on scroll up, flat with a 1 px bottom rule.
3. Hero (conventional product layout, 12 columns):
   - Left, 7 columns: the product viewer. Real photos first. Until they exist, use four switchable views built as clean SVG or CSS schematics, with thumbnails, so nothing depends on external URLs: (1) the glove under a wash mitt with the strap hidden, (2) the three-layer cross-section, (3) the cuff seal with the silicone lip and the 25 mm strap, (4) Size M dimensions (260 mm length, 95 mm palm width, 80 mm middle finger, 60 mm cuff), labeled as sample targets. Under the viewer, three short facts in plain text, not badges: about 9 in 10 of 62 surveyed detailers get cold, wet hands; target finished laminate of 1.8 mm or thinner; the strap sits under the mitt, away from the paint.
   - Right, 5 columns: a plain-text line (Waterproof inner glove for car detailing), the H1 “A waterproof glove that goes under your wash mitt.”, then two short sentences: “Put it on once. Slide any wash mitt over it and swap mitts all wash. Designed to keep bucket water off your hands.”
   - Buy module under the copy: size selector (S, M, L, XL as flat squares, default M). Picking M shows its live sample dimensions and the 200 to 215 mm hand range; S, L and XL show Size set finalizing with a Notify me button. A text link opens the size calculator. Below it the bundle selector (section 8), the price that updates with the choice, a full-width Pre-order button with a loading state that opens the cart drawer, and under it the ship window, the refund promise and the size exchange line, all from config.
   - One small media note (section 9).
4. Problem band (--band): one plain sentence on dark with the real numbers inline. Then two short paragraphs side by side, not cards. Cold, wet mornings: 90.9% of surveyed detailers use mitts that soak through, so hands go cold in the Pacific Northwest and in winter. Harsh products, all year: 64% called chemical skin exposure a meaningful problem, including in warm states like CA, TX and FL. Footnote: Founder survey, n=62, in WA, OR, CA, TX, FL, MI, KS and IN. Do not state irritation rates or medical outcomes.
5. How it works: a numbered list of three steps with short loops or photos (glove-on-strap, mitt-swap): put it on once; slide any mitt over it; swap mitts and drop them in the bucket while the glove stays on.
6. Why a glove, not a lined mitt: three plain rows separated by hairlines, each with a verbatim survey quote and a one-line answer. Label: From our survey, not a customer review.
   - Swap speed. “I personally wouldn’t prefer the strap as I’m big in efficiency, I will have to swap between 2-4 mitts for a full contact wash.” Answer: wear the glove once and swap the mitts over it.
   - Bucket. “Somehow design it so when you put it back in the wash bucket the inside doesn’t get wet.” Answer: the mitt can soak while the glove stays on your hand.
   - Paint. “Make sure the wrist strap is inside the mitt so it doesn’t scratch the paint.” Answer: the strap sits under the mitt cuff.
7. What it is (three alternating image/text rows): Thin (the scroll-driven exploded three-layer view); Sealed cuff (the diagram that draws on scroll, with the strap open and closed toggle); Fits how you wash (the dexterity clip, triggers and clips).
8. Spec sheet (light datasheet band on --surface): a hairline-grid table with columns Part, What it is and Status, in plain names with no internal M-codes. Rows: Core, 1.0 mm closed-cell CR neoprene foam, incoming tolerance ±0.10 mm (Target). Outer, matte-black stretch nylon, no grip dots (Target). Inner, smooth polyester tricot, bonded, no loose folds (Target). Finished laminate, 1.8 mm or thinner (Goal). Cuff, 60 mm with a soft silicone sealing lip (Target). Lip, 20 to 30 Shore A, 0.5 to 0.8 mm wall, 8 to 12 mm contact band (Trial range). Strap, 25 mm hook-and-loop that sits under the mitt (Target). Seams, bonded and sealed; through-stitching alone is not used (Target). Size M sample, 260 mm length, 95 mm palm width, 80 mm middle finger, 60 mm cuff, tolerances ±5, ±3, ±3 and ±3 mm (Sample dimension). Footnote: Prototype V2 development specs; final values are set after sample testing. Never present a goal or trial range as a confirmed spec.
9. Compare: keep the table, four rows, honest wording. Columns: microfiber or merino mitt alone, nitrile gloves, thick neoprene gloves, the 2HANDS glove. Facts: nitrile tears in heavy scrubbing, traps sweat, gives no insulation and has a short loose cuff; thick neoprene is too bulky to wear under a mitt.
10. How we test it: a four-row plain-language table driven by data/tests.ts, columns Test, What we do and Status (default Planned). Leak test: fingers under water for 10 minutes with 50 finger flexes and a dry indicator inside. Worn-cuff test: 10 minutes of water-only washing under a mitt with wrist movement. Flex test: 1,000 finger cycles and 100 on-and-off cycles. Strap test: 500 open-and-close cycles, 100 of them wet. One line: We publish every result, including failures. Link to /tested for the rest.
11. Founder note: a photo of Amogh and about 120 words in first person: why he built it, the survey, the pivot from a lined mitt to an under-mitt glove, and what is still being tested. No quotes here, they are in item 6. TesterQuotes appears here only when real entries exist.
12. Size and fit: a compact module with a calculator modal (hand circumference in mm or inches). It recommends M for 200 to 215 mm. For other ranges it shows Size set finalizing and a Notify me button unless SIZES_CONFIRMED is true. Include a diagram of where to measure, a printable 1:1 measuring strip (a PDF with a scale-check box, since printers can resize) and the sizing-measure clip.
13. FAQ: the six objections first (fit under a mitt, strap and paint, water at the cuff, cold water, chemicals, care) with the first three open, then wrong size, shipping, returns and pre-order timing.
14. Final buy band (--band): repeat the buy module, with “Wet job. Dry hands.” as the only large type and an email field for people who are not ready.
15. Footer: small and flat. No SKU or internal codes.

Add a sticky buy bar that appears after the hero buy module scrolls out of view (mobile and desktop): glove thumbnail, price, selected size, Pre-order button.

## 7. Trust without fake proof

The brand is new and has no reviews. Do not invent any. Specifically forbidden: fake testimonials, fake star ratings, fake sales popups, fake counters, stock avatars, made-up press logos. Build these instead:

- The founder note (section 6) and the About page with a real photo and real contact info.
- The honest testing page, written in plain language, with real status and real results once they exist.
- A TesterQuotes component driven by data/testers.ts. It renders only if the array has entries. Fill it with real prototype-tester quotes and photos when you have them, each with first name, city and date.
- A guarantee line in the buy module and at checkout (section 8).
- Real response promise: Email us and a human answers within 24 hours (only if true).

## 8. Pre-order, sizing and offer rules

- lib/config.ts must expose SHIP_WINDOW (a real date range set by the owner, never a vague season), REFUND_PROMISE_SHORT, REFUND_PROMISE_LONG, EXCHANGE_POLICY_TEXT, PREORDER_CHARGE_TIMING, PRICE_USD, FREE_SHIPPING_OVER_USD (default 40), BUNDLES and MITT_SKU_AVAILABLE. Default text: Full refund any time before it ships. Full refund if we miss the date. Free size exchange within 30 days of delivery for gloves that are unworn, rinsed and dry. The owner must confirm every term he can actually honor.
- Show the ship window, refund promise and exchange line on the hero buy module, the sticky bar, the cart drawer, checkout, the confirmation page and the order email text. Never only at checkout.
- The pre-order button must look like a purchase button and say Pre-order, never Add to Cart. Do not hide the ship date in small print.
- Sizing: only M is confirmed (hand circumference 200 to 215 mm). The tech pack says not to auto-scale M. Remove the invented L and XL ranges (216 to 230 and 231 to 250) and show S, L and XL as Size set finalizing with a Notify me button, unless SIZES_CONFIRMED is true. Keep the measuring instructions (around the widest knuckles, fingers together, thumb excluded, snug but not squeezed) and Between sizes? Choose the larger.
- Bundles (config-driven BUNDLES array, each with enabled): (1) Single pair, $24.99. (2) Glove plus exterior wash mitt, hidden until MITT_SKU_AVAILABLE is true, price set by the owner (the research suggests about 15% off the two items). (3) Two-pair crew pack, suggested $42.99, for shops, mobile crews and anyone who wants one pair drying while wearing the other. The default selection is the single pair; never pre-select a bundle. No labels like Pro Detailer Choice. Use Best value only when the numbers show a real saving.
- Cart drawer: line items, subtotal, a free-shipping progress bar at the threshold and, when only a single pair is in the cart and the mitt is available, a one-click add-a-mitt toggle with its price from config. Guest checkout only.
- Checkout: minimum fields, shipping cost shown in the cart drawer before checkout, trust line, refund promise and exchange line beside the pay button, no account wall.

## 9. Media rules

- Real photos beat renders. Build an ImageSlot pattern so replacing a placeholder with a real photo is a one-file swap. Priority shots (to be provided by the owner): glove on a hand against concrete, back and palm views, cuff and strap close-up, glove under a mitt on a wet car hood, a water beading shot, the pair in the sleeve, a flat lay, the glove next to a mitt.
- Keep the AI-generated clips for now but treat them honestly and quietly: one note per page near the first media block (Concept visuals. Real prototype footage coming.) and a small non-interactive 10 px mark on each clip. Remove the large Concept visualization pill from every video.
- Remove duplicates. The full-wash clip should appear once on the home page.
- Every video needs a poster, playsInline muted loop, and plays only in view. Cap each clip at about 3 MB.
- The gallery on /glove needs 6 to 8 images and one video: hero back-of-hand, palm, pair, cuff and strap, inside lining and lip, under the mitt, water beading, packaging.

Hero media for cold social traffic: visitors from TikTok and Instagram should see in the first seconds the same thing as the video that sent them. The first slot of the hero viewer shows the dry-hand moment: a gloved hand out of the bucket and a mitt sliding over it (bucket-dip-dry-reveal and mitt-swap). Replace these with real prototype footage as soon as samples pass the leak and cuff tests.

## 10. Motion discipline

The site should still feel alive, but every animation must show something about the product or guide the eye. Everything else goes.

Keep (they demonstrate the product): the scroll-scrubbed turntable, the exploded three-layer view, the cuff diagram drawing on, the mitt sliding over the glove, the strap open/closed toggle, a short staggered entrance on the hero, a smooth cart drawer, page transitions at 200 ms or less.

Remove: the preloader, the custom droplet cursor, magnetic buttons, the water-ripple shader, both marquees, rain particles in the final CTA, character-by-character headline splitting, and fade-up on every section.

Use one easing and two durations across the site (200 ms and 500 ms). Respect prefers-reduced-motion. Pins only on the turntable and layer sections, nothing else.

## 11. Page-level changes

- /glove: the full buy page. Gallery left (sticky on desktop), details right: buy module, three-line benefit list, a spec table in plain words, a what’s-in-the-box line, care (draft) and shipping. Below: how it works, compare, FAQ. No new story sections.
- /how-its-made: keep the step-by-step with the making clips, rewrite in plain language, show the materials as a simple table (layer, material, what it does).
- /tested: keep the full program, but rewrite each test in customer language (for example Leak test: a dry paper indicator inside the glove, fingers under water for ten minutes). Keep status and results honest. Move the V-codes to small text.
- /sizing, /faq, /about, /contact, legal: apply the new tokens and copy rules. Add a short Pre-order and shipping FAQ with exact dates from config.

## 12. Measurement and SEO

- Add lib/track.ts with track(event, props) and calls for view_item, select_size, add_to_cart, begin_checkout, join_waitlist and scroll_depth_50. It logs to the console now and is ready for GA4 or Plausible later.
- Titles and descriptions per page. Home: 2HANDS | Waterproof inner glove for car detailing, $24.99. Real OG image showing the glove (not the wordmark). JSON-LD Product with PreOrder availability and price.
- Capture src and UTM parameters on landing (for example ?src=meet from car-meet QR codes, tiktok, instagram, email) and attach them to every event and order.
- Add events: open_size_calculator, select_bundle, notify_size, play_video, view_spec_sheet.
- In the README, say how to read three numbers: bundle take rate, size calculator use against size exchange requests, and revenue per visitor by device and source.

## 13. Accessibility and performance

AA contrast on all tokens, visible focus rings in --brand, 44 px minimum touch targets, one H1 per page, alt text on images, captions on informative video. Lighthouse mobile target: performance 85+, accessibility 95+. No layout shift in the hero buy module.

## 14. Phases (stop after each)

1. Phase 0: audit (section 2).
2. Phase 1: DESIGN.md, tokens, fonts, the six-size type scale, .cursor/rules/design.mdc, restyled base components with all states (button, input, nav, drawer, accordion, table, modal, bundle selector, skeleton loaders), scripts/audit-tells.mjs, config additions. Order: tokens first, shared components second, page sections third.
3. Phase 2: rebuild the home page in the order in section 6, with the product viewer, buy module, bundle selector, sticky buy bar and the new motion set.
4. Phase 3: /glove and all inner pages, copy rewrites, media cleanup and dedupe.
5. Phase 4: pre-order messaging everywhere, sizing calculator and printable strip, bundles and cart drawer, checkout tweaks, tracking, SEO.
6. Phase 5: QA. Run npm run audit:tells, build, lint. Screenshot every route at 390 px and 1440 px with Playwright and review them against DESIGN.md. Fix everything that looks default, cramped or inconsistent. Report anything that still reads as templated.

## 15. Acceptance checklist

- A stranger can say what the product is and what it costs within three seconds of landing.
- Pre-order button, price, ship window, refund promise and exchange line are visible without scrolling on desktop and mobile.
- No centered hero, no three-card rows, no gradients, no glows, no marquees, no pill badges, no Inter or Geist.
- npm run audit:tells passes, including arbitrary values, fonts, spacing and radius checks.
- No internal codes or Planned badge walls on customer pages. No invented reviews, counts or sizes.
- The default bundle is the single pair, and the size calculator never recommends S, L or XL until they are confirmed.
- No goal or trial range is shown as a confirmed spec.
- Every interactive element has working states (loading, error, disabled) and there are no dead links or toggles.
- The same video or quote appears once per page.
- Every claim stays inside the guardrails.
- Reduced-motion mode works. Lighthouse targets met.

## 16. Notes for the owner: what was merged from the research doc (Cursor can ignore this section)

| Research doc idea | What this prompt does | Why |
| --- | --- | --- |
| Gallery left, buy box right, four switchable product views | Adopted (section 6, item 3) | Familiar layout, and the views show the product better than icons |
| Tiered bundle selector, free-shipping bar, add-a-mitt toggle, two-pair pack | Adopted, config-driven (section 8) | Offsets fulfillment cost. The mitt bundle stays hidden until you have a mitt SKU |
| Datasheet-style spec section | Adopted with Target, Goal and Trial range labels (item 8) | Your tech pack marks the lip numbers and the 1.8 mm figure as proposed, not confirmed |
| Survey quotes tied to what you changed | Adopted as three rows (item 6) | Strongest honest proof you have |
| Two-market message: cold regions and chemicals | Adopted as a two-paragraph band (item 4) | Keeps the chemical line to what the survey says |
| Six-size type scale, 4 px grid, one radius, component states, rules file | Adopted (sections 3 and 4) | Consistency is what removes the template look |
| Size calculator, printable 1:1 strip, 30-day exchange | Adopted (items 12 and section 8) | Sizing is your biggest return risk. You must confirm the exchange terms |
| Channel tracking and bundle, calculator and revenue KPIs | Adopted (section 12) | Lets you see what social and car-meet traffic does |
| Dark theme with cyan and amber, Space Grotesk, Plus Jakarta Sans, JetBrains Mono | Not used. Light theme and Barlow stay | Near-black plus one bright accent and those fonts are the named AI defaults, and amber #F59E0B is a stock Tailwind color |
| Bundle pre-selected, Pro Detailer Choice label | Not used. Single pair is the default | An unsupported claim and a pushy default, against your honest-marketing commitment |
| Field-validated, 100% paint-safe, chemical-free hands, 82% demanded | Not used | The survey had 62 people, 82% were interested, and paint safety and chemical protection are untested |
| 91% cold, wet hands | Site says about 9 in 10 | Your pie chart adds up to about 90% (37.1, 8.1 and 45.2) |
| M-codes, V01 to V08 and the R01 status pill on the page | Plain test names, no codes, no pill | Customers do not read internal codes and the pill is a known tell |
| Size recommendations for S, L and XL | Not used until fit trials confirm them | Your tech pack says do not auto-scale M |
| Conversion benchmarks (0.7% to 1.2% cold, 4% to 5% email) | Context only | They come from an agency blog and are not verified |
| Prices of $23.99, $34.99, $42.99 | Kept as config values. Single pair stays $24.99 | The research doc is inconsistent ($23.49 and $23.99). Set final prices yourself |
