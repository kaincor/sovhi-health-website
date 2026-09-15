"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import useMediaQuery from "./useMediaQuery";
import { STATS } from "./motion-timeline";

/**
 * The deck: a single point past the section's bottom-right corner that every
 * card is dealt from. Offsets below are each card's distance from it, so they
 * all converge on one origin the way a dealer's hand would.
 */
const DECK = { x: 1500, y: 900 };

/**
 * Dealt left to right. `rotFrom` is the angle each card is turned to at the
 * deck; `rot` is its resting angle from Figma. Text offsets live in CSS.
 *
 * Body copy is verbatim from Figma (node 386-136), except the cost card, whose
 * Figma text duplicated the mortality card's; corrected copy supplied
 * 2026-09-13.
 */
const CARDS = [
  {
    id: "mortality",
    at: { x: 108, y: 432 },
    rot: 0,
    rotFrom: 14,
    stat: "30%",
    body: "Social isolation is linked to a 30% higher risk of premature death. Disconnection can affect health far beyond how we feel",
  },
  {
    id: "cost",
    at: { x: 403, y: 438.61 },
    rot: -3,
    rotFrom: -20,
    stat: "$150B+",
    body: "Burnout costs U.S. employers more than $150 billion each year. The cost shows up in absenteeism, turnover, and healthcare spending.",
  },
  {
    id: "isolation",
    at: { x: 738.18, y: 75 },
    rot: 6,
    rotFrom: 22,
    stat: "58%",
    body: "58% of U.S. adults report experiencing chronic isolation. Disconnection is increasingly a population-level health concern.",
  },
  {
    id: "stress",
    at: { x: 1040, y: 93 },
    rot: 0,
    rotFrom: 16,
    stat: "~30%",
    body: "Chronic stress is associated with roughly 30% higher cardiovascular risk. Prolonged stress can place lasting strain on the body.",
  },
] as const;

export default function StatsSection() {
  const reduceMotion = useReducedMotion();
  /* Matches the CSS breakpoint where the scatter becomes a grid. Below it the
     cards are in normal flow, so dealing them across the page makes no sense
     and they simply rise into place. */
  const isScatter = useMediaQuery("(min-width: 1180px)");

  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: STATS.inViewAmount });
  const play = inView || reduceMotion;

  const fade = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0 },
    animate: play ? { opacity: 1 } : { opacity: 0 },
    transition: {
      duration: reduceMotion ? 0 : STATS.fade.duration,
      delay: reduceMotion ? 0 : STATS.fade.delay,
      ease: "easeOut" as const,
    },
  };

  return (
    <section
      ref={ref}
      className="stats"
      aria-labelledby="stats-title"
      id="who-its-for"
    >
      <motion.h2 id="stats-title" className="stats__title" {...fade}>
        The things that wear us down start upstream
      </motion.h2>

      <div className="stats__grid">
        {CARDS.map((card, i) => {
          /* Figma's tilt belongs to the scatter. In the compact grid the cards
             sit upright, or they read as misaligned rather than deliberate. */
          const rest = {
            x: 0,
            y: 0,
            rotate: isScatter ? card.rot : 0,
            opacity: 1,
          };
          const dealt = isScatter
            ? {
                x: DECK.x - card.at.x,
                y: DECK.y - card.at.y,
                rotate: card.rotFrom,
                opacity: 0,
              }
            : { x: 0, y: 28, rotate: 0, opacity: 0 };
          const delay = STATS.deal.base + i * STATS.deal.stagger;

          return (
            <motion.div
              key={card.id}
              className={`stats__card stats__card--${card.id}`}
              initial={reduceMotion ? rest : dealt}
              animate={play ? rest : dealt}
              /* Snap, do not animate, until the deal is triggered. useMediaQuery
                 reports false on the server and corrects after hydration; if
                 that flip were animated, each card would still be travelling
                 to the deck when its turn came and would deal from mid-air
                 instead of from the deck. */
              transition={
                !play || reduceMotion
                  ? { duration: 0 }
                  : {
                      default: {
                        type: "spring",
                        duration: STATS.deal.duration,
                        bounce: STATS.deal.bounce,
                        delay,
                      },
                      opacity: { duration: 0.25, delay, ease: "easeOut" },
                    }
              }
            >
              <span className="stats__stat">{card.stat}</span>
              <p className="stats__body">{card.body}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.figure className="stats__photo" {...fade}>
        <Image
          src="/images/upstream-desk.jpg"
          alt="A man leaning back in his desk chair in a dim home office, looking away from a monitor that reads 1:30 PM."
          width={725}
          height={544}
        />
      </motion.figure>
    </section>
  );
}
