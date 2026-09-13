# Sovhi Health — design system

Extracted from the full-page Figma frame (node 412-802) plus the hero frame
(node 382-111). Tokens live in `src/app/globals.css`; this file is the map.

Page is 1440 wide and **9340px** tall total. Side border is **108px**
(`--page-gutter`); the hero image is the one exception at 210px.

## Section map

| # | top | height | background | heading | status |
|---|-----|--------|------------|---------|--------|
| 1 | 0 | 990 | Cream | *(hero)* Restore what's already yours | **built** |
| 2 | 990 | 804 | ? | The things that wear us down start upstream | code complete |
| 3 | 1794 | 1167 | Orange | A clearer picture of what's shaping your health | code complete |
| 4 | 2961 | 1114 | Light-Blue | Health doesn't start with a diagnosis | code complete |
| 5 | 4075 | 1190 | Sovhi Green | One problem. Four places to intervene | code complete |
| 6 | 5265 | 974 | Cream | Uncommon depth for lasting steadiness | code complete |
| 7 | 6239 | 1535 | Cream | Meet our dream team | code complete |
| 8 | 7774 | 822 | Cream | Be among the first to see what's shaping health earlier | code complete |
| 9 | 8596 | 744 | Cream + Off-Black panel | *(footer)* | code complete |

All nine sections are present in `full-page.txt`. Heights sum to 9340.

## Palette

| token | hex | where |
|---|---|---|
| `--cream` | `#EEF0E9` | page background, most text on dark |
| `--sovhi-green` | `#0B5F5A` | primary text, buttons, §5 background |
| `--orange` | `#D97B31` | hero heading, §3 background, Joe's card |
| `--teal` | `#26BB93` | logo, waitlist button, Rupa/TS cards |
| `--off-black` | `#1E1E21` | footer panel, footer link text |
| `--rust` | `#693C18` | Joe's card lower half |
| `--light-blue` | `#8ADDE4` | §4 background, Shilpa/Colin cards |
| `--turquoise` | `#41686C` | §4 cards, Shilpa/Colin lower halves |

## Type

TT Commons Pro only at 500 (Medium) and 800 (ExtraBold). Line height is Figma
"auto" = **1.25** everywhere, with one exception: the footer wordmark at 64px
sets 67.2px explicitly, which is **1.05**.

| size | weight | use |
|---|---|---|
| 64 | 800 | footer wordmark (lh 1.05) |
| 48 | 800 | hero heading |
| 40 | 800 | section headings |
| 36 | 800 | §8 heading |
| 32 | 800 | card titles, role badges, footer column heads |
| 30 | 800 | team member names |
| 24 | 500 | body copy |
| 20 | 500/800 | buttons, eyebrow labels, footer tagline (800) |
| 18 | 500 | footer links and contact |
| 16 | 500 | team bios, tab labels |

## Text inventory

From `text-styles.txt`: **173 text runs**, which confirms the scale above is
complete — no size outside 16/18/20/24/30/32/36/40/48/64 appears.

| family | runs | share |
|---|---|---|
| TT Commons Pro Medium (500) | 83 | 48% |
| TT Commons Pro ExtraBold (800) | 47 | 27% |
| Graphik | 42 | 24% |
| Actay Wide | 1 | <1% |

**Graphik carries a quarter of all text runs.** Not by design — it is patching
the DEMO build's watermarked glyphs. Figma routes exactly eleven characters to
it: `& + ' % $ - @ © 4 /` and `~`. All are covered by the shipped
`unicode-range`, verified against this file.

Graphik appears at **weight 400** wherever TT Commons is 500, and **weight
600** wherever TT Commons is 800 — which matches how `globals.css` maps
Graphik Regular to the 500 slot and Graphik Semibold to the 800 slot.

Only **one** explicit line-height override exists in the entire page: the
footer wordmark, 67.2px at 64px = **1.05**. Everything else is Figma auto =
1.25. There is **no letter-spacing anywhere**.

## Radii and shadows

Radii: 70 (section panels, large cards), 35 (cards, pills, images),
30 (tab bar), 25 (tab pill). Some are single-corner — the footer panel rounds
top-only, the role badge rounds left-only.

Shadows: `--shadow-sm` nav/§3 image · `--shadow-md` §8 photo cards ·
`--shadow-lg` most cards · `--shadow-flat` footer logo · `--shadow-up` footer
panel (casts upward) · `--shadow-tint` §4 cards (turquoise, not black) ·
`--text-shadow-strong` footer wordmark and tagline.

## Open questions

1. **Placeholder content in Figma.** Two team members (Colin Lacey, TS
   Harigopal) have `OOO` where a role badge belongs. Footer contact is
   `000 - 000 0000` and `info@sovhi.com`. Confirm before these ship.
2. **Missing team photos.** `public/images/` has Rupa, Joe and Shilpa. Colin
   and TS are absent. Section 8 also needs 8 scattered photos, and sections
   3/4/5 need their own images — all still `placehold.co` in the export.
3. **Section 6 uses rotated cards** (−4deg and −5deg, `transform-origin: top
   left`). Motion transforms will have to compose with that rotation rather
   than replace it.
4. **Section 5 has a 4-tab selector** with one tab active. Needs defined
   behaviour: does switching tabs change the image and the copy below?
