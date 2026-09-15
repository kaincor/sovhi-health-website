"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import useMediaQuery from "./useMediaQuery";
import { DEPTH } from "./motion-timeline";

/**
 * Figma node 401-267. Three overlapping cards dealt from a single point past
 * the bottom-right corner, back to front so each lands on top of the last.
 *
 * `rot` is the resting angle from Figma; `rotFrom` is how far the card is
 * turned at the deck. Text offsets live in CSS, recovered by inverting each
 * group's rotation — see design/DESIGN-SYSTEM.md.
 */
const DECK = { x: 1620, y: 1180 };

/**
 * The same deal, for the compact layout. Below 1180 the cards leave the --u
 * grid and sit in flow (overlapped by negative margins), so there is no
 * absolute point to fly from — offsets are percentages of each card's own
 * box instead. Card i backs off by the rows between it and the corner plus a
 * common overshoot, which converges the three on roughly one point past the
 * bottom-right, exactly as DECK does above.
 */
const DECK_COMPACT = { x: 58, row: 104, y: 74 };

type Card = {
  id: string;
  at: { x: number; y: number };
  rot: number;
  /**
   * Resting angle for the compact deck. Much shallower than `rot`: the wide
   * cards are short and broad, so 4-5deg reads as a fan, but the compact
   * ones are tall columns of body text and the same angle tips whole
   * paragraphs far enough to look like a rendering fault rather than a
   * deliberate deal.
   */
  rotCompact: number;
  rotFrom: number;
  title: string;
  body: string;
};

const CARDS: readonly Card[] = [
  {
    id: "adaptive",
    at: { x: 499, y: 160 },
    rot: 0,
    rotCompact: 0,
    rotFrom: 10,
    title: "Adaptive Guidance",
    body: "What helps in a demanding month isn't what helps in a quiet one. Sovhi's guidance moves with you, and gets more specific the longer you use it.",
  },
  {
    id: "baseline",
    at: { x: 462, y: 414.87 },
    rot: -4,
    rotCompact: -1.8,
    rotFrom: -18,
    title: "Baseline Clarity",
    body: "Your steadiness has a shape. Sovhi learns it, then shows you plainly where you're holding and where you've drifted, in language you'd actually use about yourself.",
  },
  {
    id: "pathway",
    at: { x: 456, y: 681.4 },
    rot: -5,
    rotCompact: -2.4,
    rotFrom: -20,
    // curly U+2019 here, matching Figma; the body copy uses straight &apos;
    title: "A Pathway That’s Yours",
    body: "No protocol to follow, no streak to keep. Small, plausible adjustments drawn from what has actually worked for you before.",
  },
];

export default function DepthSection() {
  const reduceMotion = useReducedMotion();
  /* Matches the CSS breakpoint where the cards stop overlapping. Below it they
     sit in normal flow, so dealing them across the page makes no sense. */
  const isStacked = useMediaQuery("(min-width: 1180px)");

  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: DEPTH.inViewAmount });
  const play = Boolean(inView || reduceMotion);

  const fade = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0 },
    animate: play ? { opacity: 1 } : { opacity: 0 },
    transition: {
      duration: reduceMotion ? 0 : DEPTH.fade.duration,
      ease: "easeOut" as const,
    },
  };

  return (
    <div className="depth-shell">
      <section ref={ref} className="depth" aria-labelledby="depth-title">
        <motion.h2 id="depth-title" className="depth__title" {...fade}>
          Uncommon depth for lasting steadiness
        </motion.h2>

        <motion.p className="depth__lede" {...fade}>
          Sovhi learns the shape of your steadiness slowly, the way someone who
          knows you well would. Not against a population average, against you.
          What comes back isn&apos;t a score. It&apos;s recognition.
        </motion.p>

        {CARDS.map((card, i) => {
          /* The resting angle now applies in both layouts. The compact one
             used to flatten every card to 0deg and rise them straight up,
             which threw away the deck entirely; it keeps the fan and the
             throw, just at a size that fits a phone. */
          const rest = {
            x: 0,
            y: 0,
            rotate: isStacked ? card.rot : card.rotCompact,
            opacity: 1,
          };
          const dealt = isStacked
            ? {
                x: DECK.x - card.at.x,
                y: DECK.y - card.at.y,
                rotate: card.rotFrom,
                opacity: 0,
              }
            : {
                x: `${DECK_COMPACT.x}%`,
                y: `${(CARDS.length - 1 - i) * DECK_COMPACT.row + DECK_COMPACT.y}%`,
                rotate: card.rotFrom,
                opacity: 0,
              };
          const delay = DEPTH.deal.base + i * DEPTH.deal.stagger;

          return (
            <motion.article
              key={card.id}
              className={`depth__card depth__card--${card.id}`}
              initial={reduceMotion ? rest : dealt}
              animate={play ? rest : dealt}
              /* Snap rather than animate until the deal fires: useMediaQuery
                 reports false during SSR and corrects after hydration, and
                 animating that flip would leave later cards still travelling
                 to the deck when their turn came. */
              transition={
                !play || reduceMotion
                  ? { duration: 0 }
                  : {
                      default: {
                        type: "spring",
                        duration: DEPTH.deal.duration,
                        bounce: DEPTH.deal.bounce,
                        delay,
                      },
                      opacity: { duration: 0.25, delay, ease: "easeOut" },
                    }
              }
            >
              <h3 className="depth__card-title">{card.title}</h3>
              <p className="depth__card-body">{card.body}</p>
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
