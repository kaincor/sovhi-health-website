"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE_GENTLE, PLATFORM, PLATFORM_DECK } from "./motion-timeline";
import useMediaQuery from "./useMediaQuery";

/** The three product layers. Each fill/text pairing is one the site already
 *  uses on the depth cards, so the row reads as part of the same family
 *  rather than as three new colours. */
const LAYERS = [
  {
    n: "01",
    kicker: "Clinical layer",
    name: "SovhiQ Suite™",
    body: "Validated screening instruments — Chronic Stress Index™ and Connection Index™ — producing standardised 0–100 vital signs at the point of care. FHIR / EHR integrated.",
    bg: "var(--sovhi-green)",
    fg: "var(--light-blue)",
  },
  {
    n: "02",
    kicker: "Risk engine",
    name: "Sovhi Signal™",
    body: "Proprietary multimodal AI converts those vital signs into a predictive psychosocial risk score. Population stratification, utilisation forecasting, chronic disease early warning.",
    bg: "var(--teal)",
    fg: "var(--sovhi-green)",
  },
  {
    n: "03",
    kicker: "Consumer layer",
    name: "Sovhi IQ™",
    body: "Continuous monitoring via wearables — HRV, sleep, activity. AI nudges, behavioural coaching and personalised intervention pathways. Surfaces the Sovhi Score™.",
    bg: "var(--light-blue)",
    fg: "var(--turquoise)",
  },
] as const;

/** Market Opportunity's three figures. */
const MARKET = [
  { value: "$514B", label: "Population health management by 2033" },
  { value: "$44–60B", label: "SDOH / risk analytics" },
  { value: "$400B+", label: "Economic burden of disconnection" },
] as const;

/** SAFE terms, as a definition list — these are label/value pairs, not prose. */
const TERMS = [
  { k: "Instrument", v: "SAFE" },
  { k: "Discount", v: "15%" },
  { k: "Valuation cap", v: "None" },
  { k: "Conversion", v: "Next round" },
  { k: "Use of proceeds", v: "35 / 25 / 25 / 15" },
] as const;

export default function PlatformSection() {
  const reduceMotion = useReducedMotion();
  /* Matches the CSS breakpoint where the three cards stop being a row. Below
     it they are stacked in one column, so dealing them sideways across the
     page would make no sense — they simply rise, as the stats cards do. */
  const isRow = useMediaQuery("(min-width: 1001px)");

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: PLATFORM.inViewAmount });
  const play = inView || reduceMotion;

  const reveal = (delay: number, duration: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: inView || reduceMotion ? { opacity: 1, y: 0 } : undefined,
    transition: {
      duration: reduceMotion ? 0 : duration,
      delay: reduceMotion ? 0 : delay,
      ease: EASE_GENTLE,
    },
  });

  return (
    <section
      ref={ref}
      className="section platform"
      aria-labelledby="platform-title"
    >
      <div className="section__inner platform__inner">
        <motion.p
          className="platform__eyebrow"
          {...reveal(PLATFORM.fade.delay, PLATFORM.fade.duration)}
        >
          The platform
        </motion.p>

        <motion.h2
          id="platform-title"
          className="platform__title"
          {...reveal(PLATFORM.fade.delay, PLATFORM.fade.duration)}
        >
          Three integrated layers, from measurement to intervention
        </motion.h2>

        <ol className="platform__layers">
          {LAYERS.map((layer, i) => {
            /* The deck sits past the bottom-right corner. Card i backs off by
               the columns between it and that corner, plus a common
               overshoot, so all three wait at roughly one point and are then
               thrown into place left to right. Offsets are percentages of the
               card's own box, which is how a flow-laid row reproduces the
               absolute DECK point StatsSection deals from. */
            const dealt = isRow
              ? {
                  x: `${(LAYERS.length - 1 - i) * PLATFORM_DECK.column + PLATFORM_DECK.overshoot.x}%`,
                  y: `${PLATFORM_DECK.overshoot.y}%`,
                  rotate: PLATFORM_DECK.rotFrom[i],
                  opacity: 0,
                }
              : { x: 0, y: 28, rotate: 0, opacity: 0 };
            const rest = { x: 0, y: 0, rotate: 0, opacity: 1 };
            const delay = PLATFORM.deal.base + i * PLATFORM.deal.stagger;

            return (
            <motion.li
              className="platform__card"
              key={layer.name}
              style={{
                ["--card-bg" as string]: layer.bg,
                ["--card-fg" as string]: layer.fg,
              }}
              initial={reduceMotion ? rest : dealt}
              animate={play ? rest : dealt}
              /* Snap rather than animate until the deal fires. useMediaQuery
                 reports false on the server and corrects after hydration; if
                 that flip were animated each card would still be travelling
                 to the deck when its turn came, and would deal from mid-air. */
              transition={
                !play || reduceMotion
                  ? { duration: 0 }
                  : {
                      default: {
                        type: "spring",
                        duration: PLATFORM.deal.duration,
                        bounce: PLATFORM.deal.bounce,
                        delay,
                      },
                      opacity: { duration: 0.25, delay, ease: "easeOut" },
                    }
              }
            >
              <div className="platform__card-head">
                <span className="platform__card-kicker">{layer.kicker}</span>
                <span className="platform__card-n">{layer.n}</span>
              </div>
              <h3 className="platform__card-name">{layer.name}</h3>
              <p className="platform__card-body">{layer.body}</p>
            </motion.li>
            );
          })}
        </ol>

        <div className="platform__panels">
          {/* Market Opportunity is the argument of this section, so it takes
              the one orange fill on the page, the wider column, and the only
              display-size numerals. The SAFE panel is deliberately quiet
              beside it — outlined rather than filled — so the pair reads as
              claim and footnote, not as two equal boxes. */}
          <motion.div
            className="platform__panel platform__panel--market"
            {...reveal(PLATFORM.panel.base, PLATFORM.panel.duration)}
          >
            <p className="platform__panel-eyebrow">Market opportunity</p>
            <dl className="platform__market">
              {MARKET.map((m) => (
                <div className="platform__market-item" key={m.value}>
                  <dt className="platform__market-value">{m.value}</dt>
                  <dd className="platform__market-label">{m.label}</dd>
                </div>
              ))}
            </dl>
            <p className="platform__panel-foot">
              First-mover in a regulatory tailwind: CMS SDOH weighting, the
              post-pandemic isolation crisis, and the shift to value-based care
              all converge on the upstream signal.
            </p>
          </motion.div>

          <motion.div
            className="platform__panel platform__panel--terms"
            {...reveal(
              PLATFORM.panel.base + PLATFORM.panel.stagger,
              PLATFORM.panel.duration,
            )}
          >
            <p className="platform__panel-eyebrow">SAFE &mdash; key terms</p>
            <dl className="platform__terms">
              {TERMS.map((t) => (
                <div className="platform__term" key={t.k}>
                  <dt className="platform__term-k">{t.k}</dt>
                  <dd className="platform__term-v">{t.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
