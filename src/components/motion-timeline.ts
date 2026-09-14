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
