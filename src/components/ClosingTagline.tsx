"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { BAND, CLOSING, EASE_GENTLE } from "./motion-timeline";

/**
 * The line the investor one-pager opens and closes on. It is the same
 * sentence as the thesis hero at the top of the page, deliberately: the
 * document bookends itself with it, and so does the site.
 *
 * The sweep across the middle clause is the hero's highlight, reused
 * verbatim — same gradient, same --t-sweep-dur, same data-lit switch.
 */
export default function ClosingTagline() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: CLOSING.inViewAmount });

  /** The sweep waits for the line to finish landing, so the sentence is read
   *  before it lights rather than during. */
  const [lineLanded, setLineLanded] = useState(false);

  return (
    <section ref={ref} className="closing" aria-label="Sovhi in one line">
      <motion.p
        className="closing__line"
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={inView || reduceMotion ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: reduceMotion ? 0 : CLOSING.line.duration,
          delay: reduceMotion ? 0 : CLOSING.line.delay,
          ease: EASE_GENTLE,
        }}
        onAnimationComplete={() => setLineLanded(true)}
      >
        Healthcare measures disease.{" "}
        <span
          className="closing__highlight"
          data-lit={reduceMotion || (inView && lineLanded) ? "true" : "false"}
        >
          Sovhi measures the biology that causes it
        </span>{" "}
        &mdash; early enough to prevent it.
      </motion.p>

      {/* The seam between the investor argument above and "Restore what's
          already yours" below. Same hairline and the same draw-from-centre
          as the stat band's rules, so the page has one divider treatment
          rather than two. */}
      <motion.span
        className="closing__rule"
        aria-hidden="true"
        initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={inView || reduceMotion ? { scaleX: 1 } : undefined}
        transition={{
          duration: reduceMotion ? 0 : BAND.rule.duration,
          delay: reduceMotion ? 0 : CLOSING.sweepAfter,
          ease: EASE_GENTLE,
        }}
      />
    </section>
  );
}
