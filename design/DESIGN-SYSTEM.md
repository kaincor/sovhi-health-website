# Sovhi Health — design system

Extracted from the full-page Figma frame (node 412-802) plus the hero frame
(node 382-111). Tokens live in `src/app/globals.css`; this file is the map.

Page is 1440 wide and **9340px** tall total. Side border is **108px**
(`--page-gutter`); the hero image is the one exception at 210px.

## Section map

| # | top | height | background | heading | status |
|---|-----|--------|------------|---------|--------|
| 1 | 0 | 990 | Cream | *(hero)* Restore what's already yours | **built** |
| 2 | 990 | 804 | Cream | The things that wear us down start upstream | **built** |
| 3 | 1794 | 1167 | Orange | A clearer picture of what's shaping your health | **built** |
| 4 | 2961 | 1114 | Light-Blue | Health doesn't start with a diagnosis | **built** (layout only, motion pending) |
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

## Section 2 notes (built — node 386-136)

Four 260x260 cards scattered at fixed positions, two rotated (`-3deg` and
`+6deg`, origin top-left), plus a 589x260 photo card. Figma flattens each
rotated group — the card and both text boxes each carry their own `rotate()`
about their own top-left — so the text offsets were recovered by inverting the
rotation, letting each card animate as one unit:

| card | position | rot | stat offset | body offset |
|---|---|---|---|---|
| green `30%` | 108, 432 | 0 | 25, 32 | 25, 130 |
| orange `$150B+` | 403, 438.61 | −3° | 28.31, 32.12 | 27.45, 126.44 |
| blue `58%` | 738.18, 75 | +6° | 30.34, 37.03 | 30.02, 121.53 |
| teal `~30%` | 1040, 93 | 0 | 26, 38 | 26, 125 |

Figma gives the stat cards no shadow, but the reference render shows one;
`--shadow-lg` was used, matching every other card in the frame.

Below 1180px the scatter becomes an upright two-column grid (one column under
560px) — at 18% of the viewport width a card's 16px copy would otherwise have
to shrink past legibility to stay inside its box.

## Section 3 notes (built — nodes 416-841 closed, 386-137 expanded)

Three 256-wide cards grow **185 -> 367** on hover. Their contents are laid out
in flow rather than absolutely, so the growth lives in one "reveal" block:

    13 pad + 45 pill + 18 gap + 60 title = 136
    reveal  49 (18 + 22 arrow + 9)  -> card 185
    reveal 231 (63 + 138 body + 30) -> card 367

which puts the arrow at y=154 and the body at y=199 from the card top, both
matching Figma, and makes card height a function of one animated value
(`--reveal-t`, 0 -> 1).

Lengths are multiples of `--u` = `calc(100cqw / 1440)`: exactly 1px at the
design width, proportional below. `cqw` rather than `vw` so a scrollbar cannot
skew it, which needs the `.how-shell` wrapper because an element cannot query
itself.

**Interaction.** Hover (or focus, or tap) opens a card and closes the previous
one simultaneously. Hovering *out* does not close it — only another card does.
Mouse devices arrive all-closed; touch devices arrive with card 1 open, keyed
off `(hover: none)` phrased that way deliberately so SSR renders the closed
state. Overshoot measured at 14.2px past the 367 target (`bounce: 0.37`).

**The arrow was rebuilt.** Dev Mode flattened it into a stem plus one stray
45deg bar that lands beside the stem rather than forming an arrowhead. The real
icon came from a Figma SVG export — see `design/icons/Downwards-Arrow.svg` and
`src/components/icons/DownArrow.tsx`.

## Section 4 notes (built — layout only)

Six cards on Light-Blue: one wide Cream "Connection" card with a photo, five
narrow Turquoise cards. Same `--u` scheme as section 3.

    heading   688x50 at 644,64   (right-aligned to the gutter, not centred)
    row 1     Connection 700 at 108 | 244 at 826 | 244 at 1088
    row 2     244 at 108 | 244 at 370 | 244 at 632
    rows at y=149 and y=597, 413 tall, 18px gaps, 35px between rows

The Connection photo is a 461x346 image in a 355-wide window at x=-90 —
129.859% wide, offset -25.352%, with `max-width: none` to defeat Tailwind
preflight. "Environment" gets a wider title box (191 at x=26, not 180 at 32).

**No motion yet** — this is the only section that does not animate in on
scroll. Ask before adding one.

**Compact gotcha worth repeating:** every element the scatter positions
absolutely must be in the one reset list. Overriding `.signals__photo`
separately left its `left: calc(313 * var(--u))` in place and pushed the photo
clean out of its grid column. The same mistake is possible in any future
section that follows this pattern.

## Full-bleed colour

`.page` is capped at 1440 and centred, so a coloured section would otherwise
show the cream body background either side of it on wider screens. Add
**`.bleed-bg`** to the section and set `--bleed-color`:

```css
.how {
  --bleed-color: var(--orange);
  background: var(--orange);
}
```

It paints via `box-shadow: 0 0 0 100vmax` with `clip-path: inset(0 -100vmax)`.
Paint-only, so no layout moves and no scrollable overflow is created — a
negative-margin bleed (`margin-inline: calc(50% - 50vw)`) overshoots by the
scrollbar width. The clip trims the spread vertically so it cannot bleed into
neighbouring sections.

Section 4 (Light-Blue) uses it. Section 5 (Sovhi Green) will too.

## Radii and shadows

Radii: 70 (section panels, large cards), 35 (cards, pills, images),
30 (tab bar), 25 (tab pill). Some are single-corner — the footer panel rounds
top-only, the role badge rounds left-only.

Shadows: `--shadow-sm` nav/§3 image · `--shadow-md` §8 photo cards ·
`--shadow-lg` most cards · `--shadow-flat` footer logo · `--shadow-up` footer
panel (casts upward) · `--shadow-tint` §4 cards (turquoise, not black) ·
`--text-shadow-strong` footer wordmark and tagline.

## Open questions

1. ~~Section 2's `$150B+` card duplicated the `30%` card's copy.~~ **Resolved
   2026-09-13** — corrected to *"Burnout costs U.S. employers more than $150
   billion each year..."*. The Figma file still holds the old text.
2. **Placeholder content in Figma.** Two team members (Colin Lacey, TS
   Harigopal) have `OOO` where a role badge belongs. Footer contact is
   `000 - 000 0000` and `info@sovhi.com`. Confirm before these ship.
3. **Missing team photos.** `public/images/` has Rupa, Joe and Shilpa. Colin
   and TS are absent. Section 8 also needs 8 scattered photos, and sections
   3/4/5 need their own images — all still `placehold.co` in the export.
4. **Section 6 uses rotated cards** (−4deg and −5deg, `transform-origin: top
   left`). Motion transforms will have to compose with that rotation rather
   than replace it.
5. **Section 5 has a 4-tab selector** with one tab active. Needs defined
   behaviour: does switching tabs change the image and the copy below?
