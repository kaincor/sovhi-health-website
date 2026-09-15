"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_GENTLE, THESIS } from "./motion-timeline";

/** Lifted from the investor one-pager (design/Sovhi Health Investor
 *  OnePager 6.pdf). The claim is the reason this hero exists, so it is kept
 *  verbatim; only the typography is translated to the site's own voice. */
const EYEBROW = "The missing vital sign of modern medicine";

export default function ThesisHero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number, duration: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : duration,
      delay: reduceMotion ? 0 : delay,
      ease: EASE_GENTLE,
    },
  });

  return (
    <section className="thesis" aria-labelledby="thesis-title">
      <motion.p
        className="thesis__eyebrow"
        {...fadeUp(THESIS.eyebrow.delay, THESIS.eyebrow.duration)}
      >
        {EYEBROW}
      </motion.p>

      <motion.h1
        id="thesis-title"
        className="thesis__title"
        {...fadeUp(THESIS.title.delay, THESIS.title.duration)}
      >
        Healthcare measures disease.{" "}
        {/* The turn of the sentence, and the whole positioning, sits on this
            clause — it carries the accent so the contrast lands even when the
            headline is skimmed rather than read. */}
        <em className="thesis__turn">Sovhi measures the biology that causes it</em>{" "}
        &mdash; early enough to prevent it.
      </motion.h1>

      <motion.p
        className="thesis__lede"
        {...fadeUp(THESIS.lede.delay, THESIS.lede.duration)}
      >
        Chronic stress and social connection, captured on validated clinical
        instruments as standardised 0&ndash;100 vital signs, then converted into a
        predictive risk signal 6&ndash;12 months before clinical onset.
      </motion.p>
    </section>
  );
}
