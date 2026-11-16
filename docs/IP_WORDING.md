# IP wording

Approved phrases for the site, packaging, social bios, and captions. Keep claims at the product level. Do not describe which feature is covered by the filing.

## Approved

- Patent pending.
- U.S. patent application filed.
- We have filed a U.S. patent application for this product.
- 2HANDS™
- © {current year} 2HANDS

## Packaging and care card

Use the lines in `content/packaging.ts`. Include `Patent pending.` on the paper sleeve and the care card.

## Social bios and captions

Short:

- 2HANDS™. Patent pending.

Longer:

- 2HANDS™ waterproof detailing inner glove. Patent pending. Wet job. Dry hands.

## Banned (anywhere: site, emails, metadata, social, packaging)

- patented
- patent-protected
- protected by patent
- patent protection
- patent secured
- patent approved
- patent granted
- provisional patent (say "patent application" instead)
- exclusive technology
- only glove
- first and only
- cannot be copied
- copy-proof
- Made in USA
- American-made
- the ® symbol (use ™ only)

## Do not publish

- USPTO application number
- What the application claims or covers
- Feature-specific wording such as "patent-pending cuff seal"

## Config

Public notice strings live in `lib/ip.ts`. Build scripts `npm run audit:ip` and `npm run check:ip` enforce banned wording and the 12-month patent-pending window.
