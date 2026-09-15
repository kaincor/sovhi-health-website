/**
 * Hero intro timeline, in seconds. Ordered as specified: the image comes into
 * view first, the nav drops in at 1s, then the three text elements stagger,
 * then the lede highlight sweeps once the CTA has finished landing.
 *
 * Mirrors the --t-* custom properties in globals.css. Change both together.
 */
export const T = {
  figure: { delay: 0.1, duration: 1.3 },
  nav: { delay: 1, duration: 0.8 },
  title: { delay: 1.35, duration: 0.7 },
  lede: { delay: 1.6, duration: 0.7 },
  cta: { delay: 1.85, duration: 0.7 },
} as const;

/** Matches --ease-gentle. */
export const EASE_GENTLE = [0.22, 1, 0.36, 1] as const;

/**
 * Stats section. Cards are dealt from a single off-screen point past the
 * bottom-right corner, left to right, while the title and photo card fade in
 * from the first frame. Last card lands at 0.1 + 3*0.45 + 0.9 = 2.35s, inside
 * the 2.5s budget.
 */
export const STATS = {
  /** Title and photo card, both starting immediately. */
  fade: { delay: 0, duration: 0.8 },
  /** Per-card: delay = base + index * stagger. */
  deal: { base: 0.1, stagger: 0.45, duration: 0.9, bounce: 0.28 },
  /** Fires when this fraction of the section is visible. */
  inViewAmount: 0.25,
} as const;

/**
 * "How it works" section. Heading and photo fade in on scroll, the three cards
 * stagger in behind them, then the arrows begin bobbing. Card expansion is a
 * spring on --reveal-t: one firm overshoot, per the brief.
 */
export const HOW = {
  fade: { delay: 0, duration: 0.8 },
  cards: { base: 0.35, stagger: 0.12, duration: 0.6 },
  /** Arrows start bobbing once the last card has landed. */
  bobAfter: 0.35 + 2 * 0.12 + 0.6,
  /**
   * One firm overshoot, per the brief. Measured peak height past the 367px
   * target, sampled every frame:
   *     bounce 0.30 ->  8.3px   (1 overshoot)
   *     bounce 0.35 -> 12.3px   (1 overshoot)
   *     bounce 0.37 -> 14.2px   (1 overshoot)  <- chosen, brief asked ~14px
   *     bounce 0.40 -> 17.2px   (1 overshoot)
   *     bounce 0.45 -> 22.9px   (a second swing appears)
   *     bounce 0.50 -> 29.4px   (2 swings)
   * Raise past 0.45 for the multi-swing decay in the reference GIF.
   */
  reveal: { duration: 0.6, bounce: 0.37 },
  inViewAmount: 0.2,
} as const;

/**
 * "Uncommon depth" section. Same deal-from-off-stage idea as the stats cards,
 * but slower per card and in back-to-front order so each lands on top of the
 * last: Adaptive Guidance, Baseline Clarity, A Pathway That's Yours.
 * Last card lands at 0.1 + 2*0.45 + 0.85 = 1.85s.
 */
export const DEPTH = {
  fade: { delay: 0, duration: 0.8 },
  /* bounce matches the stats deal (0.28), which reads as momentum rather
     than a spring. At 0.3 the last card overshot by 53px. */
  deal: { base: 0.1, stagger: 0.45, duration: 0.85, bounce: 0.28 },
  inViewAmount: 0.25,
} as const;

/**
 * Thesis hero. The page opener, so it runs on mount rather than on scroll,
 * on the same ladder as the photo hero below it: eyebrow, headline, then the
 * thesis line. The four headline numbers used to land here too; they now live
 * in their own ruled band further down (see BAND), because repeating them in
 * both places was the same evidence twice.
 */
export const THESIS = {
  eyebrow: { delay: 0.2, duration: 0.6 },
  title: { delay: 0.35, duration: 0.8 },
  lede: { delay: 0.6, duration: 0.7 },
} as const;

/**
 * "Stress doesn't stay psychological". Scroll-triggered. The four stage cards
 * resolve left to right and each connecting arrow wipes in behind the card it
 * points at, so the chain reads as a sequence rather than a row of cards.
 * Last arrow lands at 0.25 + 3*0.18 + 0.45 = 1.24s.
 */
export const PATHWAY = {
  fade: { delay: 0, duration: 0.8 },
  stage: { base: 0.25, stagger: 0.18, duration: 0.6 },
  /** Arrow i trails the card it points at. */
  arrow: { base: 0.25 + 0.18, stagger: 0.18, duration: 0.45 },
  /**
   * The perpetual pulse that travels down the chain. Not an entrance — the
   * cards enter once (see `stage`) and then this runs forever, lifting one
   * stage at a time so the cascade always looks live.
   *
   * These numbers are documentation: the animation itself is CSS keyframes
   * (@keyframes pathway-pulse), because an infinite compositor-only
   * transform belongs there rather than in a React render loop. Change both
   * together.
   *
   *   hold  3s per stage, x4 stages = `cycle` 12s, then it repeats
   *   ramp  1.5s to swell and 1.5s to settle
   *   max   1.04 — a highlight, not a resize
   *
   * The ramps are what make the handoff work. Stage i settles over the same
   * 1.5s window that stage i+1 swells in, so at every moment one card is
   * growing and exactly one other is shrinking. Offsetting each card by
   * `hold` via animation-delay is all that is needed to get that for free.
   *
   * Separate from --k in globals.css, which is the cards' RESTING size ramp
   * across the four stages. That is layout; this rides on top of it.
   */
  pulse: { cycle: 12, hold: 3, ramp: 1.5, max: 1.04 },
  inViewAmount: 0.25,
} as const;

/**
 * "The problem" / "The Sovhi thesis". The two columns fade together rather
 * than in sequence — they are a single contrast, and staggering them would
 * imply one is a consequence of the other. Their list items then count in
 * within each column.
 */
export const PROBLEM = {
  fade: { delay: 0, duration: 0.7 },
  item: { base: 0.3, stagger: 0.1, duration: 0.55 },
  inViewAmount: 0.3,
} as const;

/**
 * The ruled stat band. Both dividing lines draw outward from the centre
 * first, then the four numbers count in between them, so the rules read as
 * the thing framing the evidence rather than as decoration arriving with it.
 */
export const BAND = {
  rule: { delay: 0, duration: 0.7 },
  stat: { base: 0.35, stagger: 0.1, duration: 0.55 },
  /**
   * The marquee never stops, so its speed is a legibility budget rather than
   * a style choice. One full pass of the four figures takes 56s, which puts
   * a given stat on screen for roughly 14s — slow enough to read the number,
   * its label and its source without chasing it. Defined in CSS as
   * --band-marquee-dur; kept here so the timing lives with the others.
   */
  marquee: { duration: 56 },
  inViewAmount: 0.4,
} as const;

/**
 * "The platform". Three layer cards stagger in, then the two wide panels
 * beneath them. Market Opportunity leads that pair: it is the argument, and
 * the SAFE terms are the footnote to it.
 */
export const PLATFORM = {
  fade: { delay: 0, duration: 0.7 },
  /**
   * The three layer cards are dealt from off-stage past the bottom-right
   * corner, exactly like the stats and depth cards. bounce matches those two
   * (0.28) so all three decks on the page throw with the same weight.
   */
  deal: { base: 0.25, stagger: 0.16, duration: 0.85, bounce: 0.28 },
  panel: { base: 0.25 + 3 * 0.16, stagger: 0.14, duration: 0.65 },
  inViewAmount: 0.2,
} as const;

/** Where each layer card waits before it is dealt, as a multiple of its own
 *  width and height. The three converge on one point past the bottom-right
 *  corner: card i backs off by (2 - i) columns plus a common overshoot, which
 *  is the flow-layout equivalent of the absolute DECK point StatsSection
 *  uses. rotFrom is the shuffle. */
export const PLATFORM_DECK = {
  /** Own-width multiples: one column step plus the gap between columns. */
  column: 106,
  overshoot: { x: 46, y: 150 },
  rotFrom: [15, -18, 21],
} as const;

/**
 * The closing tagline. The sweep across "Sovhi measures the biology that
 * causes it" reuses the hero highlight verbatim — same gradient, same
 * --t-sweep-dur — and waits for the line itself to have landed, so the
 * viewer reads the sentence before it lights.
 */
export const CLOSING = {
  line: { delay: 0, duration: 0.9 },
  /** The sweep starts once the line has settled. */
  sweepAfter: 0.9,
  inViewAmount: 0.5,
} as const;
