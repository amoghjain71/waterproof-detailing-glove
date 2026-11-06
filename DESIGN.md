# 2HANDS design decisions

These decisions are fixed. Components read the tokens in `app/tokens.css`. Do not swap in another theme.

## Theme

Bright wash bay. Light cool-gray ground so the black glove is the strongest object. Near-black bands only where video plays. A clean detailing bay with wet concrete, not a tech launch and not a newspaper layout.

## Color

| Token | Value | Use |
| --- | --- | --- |
| --ground | #E8EBED | Page background. Wet concrete. |
| --surface | #F6F7F8 | Panels and fields. |
| --ink | #0F1216 | Text and the glove. |
| --ink-muted | #4B5560 | Secondary text. AA on ground. |
| --rule | #C5CCD2 | 1px hairlines. |
| --brand | #1B5FE0 | Logo, primary button, links, focus rings only. |
| --band | #0B0D10 | Video bands. |
| --brand-on-band | #6FA3FF | Blue text on dark bands. |
| --on-brand | #FFFFFF | Label on the primary button. |

No gradients, glows, or second accent. Hover on the primary button darkens --brand by 8 percent (`--brand-hover`).

## Type

Barlow Condensed 600 and 700 for headings, sentence case. Barlow 400, 500, and 600 for body and labels, with tabular numerals. Self-hosted with `next/font`.

Six sizes, fluid with `clamp` up to the desktop size:

| Utility | Desktop size | Line height |
| --- | --- | --- |
| text-h1 | 64px | 1.05 |
| text-h2 | 44px | 1.1 |
| text-h3 | 28px | 1.2 |
| text-lead | 20px | 1.5 |
| text-body | 18px | 1.55 |
| text-label | 14px | 1.4 |

Body measure is about 62 characters (`.measure`).

## Layout

Left-aligned text. 12-column grid, max width 1280px. Spacing base 8px, and every margin, padding, and gap is a multiple of 4. Preferred steps: 4, 8, 12, 16, 24, 32, 48, 64, 96. Asymmetric 7/5 and 5/7 splits. No centered hero stack. No row of three identical cards.

## Tone and shape

Radius is 4px on buttons, inputs, cards, and tags, and 0 on images and video. No pills, except the round cart count. No box shadows. Buttons are 48px rectangles. Primary fill is --brand with white text. Secondary is an ink outline. Hover changes background or border only.

One easing (`--ease-wash`) and two durations (200ms and 500ms).

## States

Interactive components need default, hover, focus-visible, active, loading, disabled, and error. Buttons show a spinner while an action runs. Data areas use `Skeleton`. No dead controls.

## Claims

Say designed to, built to, or intended to until tests pass. Never write certified, chemical-resistant, hypoallergenic, thermal rated, or PPE. No V-codes, SKU, or Planned badges on customer pages. No invented reviews.
