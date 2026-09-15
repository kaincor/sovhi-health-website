"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE_GENTLE, PROBLEM } from "./motion-timeline";

/** The problem column's three figures. `lead` is the part that carries the
 *  accent and the bold — the number is the argument, the rest is context. */
const PROBLEM_POINTS = [
  { lead: "~90%", rest: "of $4.1T U.S. spend tied to chronic disease" },
  {
    lead: "+26–32%",
    rest: "mortality risk from social isolation — comparable to smoking",
  },
  { lead: "+40%", rest: "higher depression risk from low social connection" },
] as const;

/** The thesis column. Measure / Predict / Intervene are the three verbs the
 *  one-pager hangs the model on, so each stays bold and leads its line. */
const THESIS_POINTS = [
  {
    lead: "Measure",
    rest: "clinical instruments: Chronic Stress Index™, Connection Index™",
  },
  { lead: "Predict", rest: "AI risk engine, 6–12 months pre-event" },
  { lead: "Intervene", rest: "wearable and AI coaching pathways" },
] as const;

export default function ProblemThesisSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: PROBLEM.inViewAmount });

  const reveal = (delay: number, duration: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    animate: inView || reduceMotion ? { opacity: 1, y: 0 } : undefined,
    transition: {
      duration: reduceMotion ? 0 : duration,
      delay: reduceMotion ? 0 : delay,
      ease: EASE_GENTLE,
    },
  });

  return (
    <section ref={ref} className="section problem" aria-labelledby="problem-title">
      <div className="section__inner problem__inner">
        <h2 id="problem-title" className="sr-only">
          The problem, and the Sovhi thesis
        </h2>

        <div className="problem__cols">
          {/* --- the problem ------------------------------------------- */}
          <motion.div
            className="problem__col"
            {...reveal(PROBLEM.fade.delay, PROBLEM.fade.duration)}
          >
            <p className="problem__eyebrow">The problem</p>
            <p className="problem__body">
              Healthcare is built on downstream data &mdash; diagnoses, labs,
              claims. By the time risk surfaces, intervention is late and
              costly. The upstream drivers, chronic stress and social
              disconnection, go unmeasured.
            </p>
            <ul className="problem__list">
              {PROBLEM_POINTS.map((p, i) => (
                <motion.li
                  className="problem__item"
                  key={p.lead}
                  {...reveal(
                    PROBLEM.item.base + i * PROBLEM.item.stagger,
                    PROBLEM.item.duration,
                  )}
                >
                  <strong className="problem__lead">{p.lead}</strong> {p.rest}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* --- the thesis -------------------------------------------- */}
          <motion.div
            className="problem__col problem__col--thesis"
            {...reveal(PROBLEM.fade.delay, PROBLEM.fade.duration)}
          >
            <p className="problem__eyebrow">The Sovhi thesis</p>
            <p className="problem__body">
              Make chronic stress and social connection{" "}
              <em className="problem__em">standardised vital signs</em>. Convert
              them into a predictive risk signal. Intervene continuously, months
              before clinical onset.
            </p>
            <ul className="problem__list">
              {THESIS_POINTS.map((p, i) => (
                <motion.li
                  className="problem__item"
                  key={p.lead}
                  {...reveal(
                    PROBLEM.item.base + i * PROBLEM.item.stagger,
                    PROBLEM.item.duration,
                  )}
                >
                  <strong className="problem__lead">{p.lead}</strong>{" "}
                  &mdash; {p.rest}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
