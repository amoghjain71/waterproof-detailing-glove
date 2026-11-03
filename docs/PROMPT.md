# Waterproof Detailing Glove Website — THE PROMPT

## 1. Role and goal
You are a senior creative developer. Build a complete, production-quality marketing and e-commerce website for a new physical product: a thin, waterproof inner glove that car detailers wear underneath their normal microfiber wash mitt. The site must make a visitor feel "this solves my exact problem," show how the glove is made and what it is made of, help them pick a size, show it in use, show how it will be proven durable and reliable, and let them add it to a cart and check out. Payment processing is added later, so build a clean payment abstraction with a mock provider (see section 9).

The site must be extremely motion-rich: smooth scrolling, pinned and scrubbed scroll sections, video, reveal animations, water-themed effects. Write real, working code. No lorem ipsum, no "TODO: add content" in the UI, no broken links. Stubs are allowed only where this prompt says so (payments, email delivery).

## 2. Product facts (source of truth, never invent specs)
- Name: Waterproof Detailing Inner Glove. SKU WDIG-001, colorway BLK-01 matte black. Sold as one left plus one right glove per pair. Brand name is not final: read it from lib/config.ts (BRAND.name, default "Your Brand") and never hardcode it.
- Construction (3-layer laminate): outer facing is matte-black stretch nylon with a water-repellent surface; core is closed-cell neoprene foam, target 1.0 mm; inner facing is smooth, low-friction polyester tricot. Seams are bonded and sealed. No exposed metal or abrasive hardware, no raised grip texture, no logos on the body.
- Cuff: 60 mm cuff with a soft silicone sealing lip on the inside, plus an adjustable low-profile hook-and-loop wrist strap, 25 mm wide. The whole closure sits under the wash mitt so it cannot scratch paint.
- Fit and function: five-finger articulated fit, flexible fingers and minimal seam bulk, fits underneath a standard microfiber wash mitt. Size M sample: 260 mm overall length, 80 mm middle finger, 95 mm palm width laid flat, 60 mm cuff, for hand circumference 200 to 215 mm.
- Sizes: S, M, L, XL. Only size M has confirmed numbers. S, L and XL ranges are still being set from fit trials. Never auto-scale M to invent them.
- Draft care: rinse with clean cool water after use, air-dry fully inside and outside away from direct heat, do not wring, iron or tumble dry. (Draft until validated.)
- Target price: $24.99 per pair (planned retail range $21.99 to $24.99). Keep it in config as PRICE_USD.
- Why it exists: the founder first designed a lined wash mitt, then surveyed 62 detailers and enthusiasts (WA, OR, CA, TX, FL, MI, KS, IN). Pros swap between 2 to 4 mitts per wash (each is in hand only 15 to 30 seconds), want the inside to stay dry when a mitt goes back in the bucket, and do not want a strap that could scratch paint. So the product pivoted to a glove worn once, under any mitt.
- Survey results (founder-run survey, n=62; always footnote this exact source and sample size wherever shown): more than 70% wash multiple times a week and about 10% multiple times a day; 90.9% use mitts that absorb water right away; about 9 in 10 get cold, wet hands while washing; 64% call chemical skin exposure a meaningful problem; 82% are interested in waterproof protection.
- Competing options (for the comparison section): standard microfiber or merino mitts (paint-safe, no water protection), disposable nitrile gloves (tear in scrubbing, trap sweat, no insulation, short loose cuff that lets bucket water in), and traditional thick neoprene gloves (too bulky to fit under a mitt, poor finger movement).
- Value proposition: put the glove on once at the start of a wash, swap mitts in seconds, leave mitts soaking in the bucket without flooding your hands, finish with warm, dry hands.

## 3. Claims guardrails (important, enforce in all copy)
The glove is still in prototype and has not yet passed its waterproof tests. Therefore:
- Do not write "certified," "chemical-resistant," "chemical-proof," "hypoallergenic," "thermal rated," "warm to X degrees," or "PPE." Do not claim lifetime durability.
- Use intent language until tests pass: "designed to keep water out," "built to stay thin under your mitt," "engineered cuff seal."
- Put all headline, hero and CTA copy in content/copy.ts with a CLAIM_LEVEL flag: 'intent' (default) or 'proven'. Default headline: "Wet job. Dry hands." with sub-line "A thin waterproof glove that lives under your wash mitt." In 'intent' mode, show a small "Prototype V2. Testing in progress." badge in the hero and footer.
- Any AI-generated or illustrative video gets a small caption "Concept visualization" via <VideoCaption>, controllable by SHOW_CONCEPT_LABEL in config.

## 4. Tech stack
- Next.js 14+ (App Router), TypeScript strict, Tailwind CSS, next/font, next/image.
- Motion: GSAP with ScrollTrigger (pinning, scrubbing, timelines) as the main engine, Lenis for smooth scroll (synced to ScrollTrigger with lenis.on('scroll', ScrollTrigger.update) and gsap.ticker), Framer Motion for UI micro-interactions and page transitions.
- Optional WebGL: a small water-ripple effect over the hero using a canvas or ogl/OGL-style fragment shader. Must degrade gracefully (static poster) when WebGL or motion is unavailable.
- State: Zustand with persist (cart). Forms: react-hook-form + zod.
- No backend database yet. API routes (/api/waitlist, /api/contact) validate input with zod, log to the server console and write to data/submissions.json in dev. Leave a clearly marked sendEmail() stub for Resend later.

## 5. Design system
- Look: premium, dark, wet. Matte black (#0A0B0D) background, near-white text, one electric blue accent (#1F7BFF) borrowed from the blue chenille mitt and the callout blue in the tech pack, a secondary cold cyan (#7FD6FF) for water highlights. Soft glass panels, thin 1px borders at 10% white.
- Type: a bold condensed or extended display face for headlines (Archivo Black / Archivo variable width, or Barlow Condensed ExtraBold), all caps for big statements, tight tracking; DM Sans or Inter for body. Huge type: hero headline at least clamp(3.5rem, 11vw, 11rem).
- Water motif everywhere: droplet-shaped cursor trail, beading-droplet SVG dividers, blue ripple on button hover, rain-streak particles in the final CTA.
- All colors, radii, durations and easings live in Tailwind config and CSS variables. Default easing power3.out (GSAP) and [0.22, 1, 0.36, 1] (Framer).
- Dark theme only. Mobile-first and fully responsive from 360px to 2560px.

## 6. Site map
- / — Scroll-story home page
- /glove — Product page with buy box, gallery, specs, size selector
- /how-its-made — Materials and construction, step by step
- /sizing — Size finder, how to measure, size chart
- /tested — Durability and reliability testing program
- /faq — Accordion FAQ
- /about — Founder story and the survey-driven pivot
- /cart, /checkout, /order/confirmation — Commerce flow
- /contact, /legal/shipping, /legal/returns, /legal/privacy, /legal/terms — Support and legal
- Global: sticky header, mobile menu, footer with giant wordmark, email waitlist field

## 7–14. Home scroll story, other pages, commerce, video system, performance, file structure, build phases, acceptance
See original brief. Execute phases 1–5 one at a time.

### Build phases
1. Phase 1: scaffold, Tailwind design system, fonts, config and content files, layout shell (header, footer, mobile menu), Lenis plus GSAP setup, custom cursor, page transitions, AutoVideo, placeholder system.
2. Phase 2: the full home page, all 17 sections.
3. Phase 3: /glove, /how-its-made, /sizing, /tested, /faq, /about, /contact and legal pages.
4. Phase 4: cart, drawer, checkout, payment abstraction, waitlist and contact APIs, confirmation page.
5. Phase 5: performance, accessibility, reduced-motion pass, SEO and JSON-LD, README. Run npm run build and npm run lint and fix everything.
