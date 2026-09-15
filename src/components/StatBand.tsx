"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { BAND, EASE_GENTLE } from "./motion-timeline";

/** The four headline figures from the investor one-pager, in its order.
 *
 *  `source` is the attribution shown under the label. Only the WHO figure
 *  carries one, because that is the only citation the one-pager itself
 *  states — the other three are asserted there without a source. They are
 *  left unattributed rather than credited to a plausible-sounding body.
 */
const STATS = [
  { value: "$4.1T", label: "U.S. healthcare spend", source: "" },
  {
    value: "871K",
    label: "Annual deaths tied to disconnection",
    source: "WHO",
  },
  { value: "+68%", label: "Higher ER utilisation from isolation", source: "" },
  { value: "6–12mo", label: "Early detection window before onset", source: "" },
] as const;

export default function StatBand() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: BAND.inViewAmount });

  /** Both rules draw outward from the centre. scaleX on a 1px-tall element is
   *  compositor-only, so this costs nothing on scroll. */
  const rule = {
    initial: reduceMotion ? { scaleX: 1 } : { scaleX: 0 },
    animate: inView || reduceMotion ? { scaleX: 1 } : undefined,
    transition: {
      duration: reduceMotion ? 0 : BAND.rule.duration,
      delay: reduceMotion ? 0 : BAND.rule.delay,
      ease: EASE_GENTLE,
    },
  };

  const stats = STATS.map((stat) => (
    <div className="band__stat" key={stat.value}>
      <dt className="band__value">{stat.value}</dt>
      <dd className="band__label">
        {stat.label}
        {stat.source ? (
          <span className="band__source"> ({stat.source})</span>
        ) : null}
      </dd>
    </div>
  ));

  return (
    <section ref={ref} className="section band" aria-label="Key figures">
      <div className="section__inner band__inner">
        <motion.span className="band__rule" aria-hidden="true" {...rule} />

        {/* The track holds the four figures twice and slides by exactly half
            its width, so the moment it wraps, copy two is sitting where copy
            one began and the seam is invisible. The duplicate is hidden from
            assistive tech — it is the same four facts, not eight.

            Under prefers-reduced-motion the CSS drops the animation and the
            track becomes a static four-up grid, so the duplicate collapses
            away rather than showing the numbers twice. */}
        <div className="band__viewport">
          <dl
            className="band__track"
            data-animated={reduceMotion ? "false" : "true"}
          >
            <div className="band__group">{stats}</div>
            <div className="band__group" aria-hidden="true">
              {stats}
            </div>
          </dl>
        </div>

        <motion.span className="band__rule" aria-hidden="true" {...rule} />
      </div>
    </section>
  );
}
