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
