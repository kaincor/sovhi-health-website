"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE_GENTLE, PATHWAY } from "./motion-timeline";
import DownArrow from "./icons/DownArrow";
import PsychosocialStress from "./icons/PsychosocialStress";
import CortisolDysregulation from "./icons/CortisolDysregulation";
import SystemicInflammation from "./icons/SystemicInflammation";
import ChronicDisease from "./icons/ChronicDisease";

type Stage = {
  n: string;
  title: string;
  body: string;
  /** Card fill, and the tint of its graphic well. */
  bg: string;
  /**
   * Size multiplier for this stage's resting state. Drives padding, type and
   * the graphic well through --k, so the chain gets physically larger as the
   * pathology advances rather than only changing colour.
   */
  k: number;
  /** Title colour on that fill. */
  fg: string;
  /** Stage numeral and body colour on that fill. */
  muted: string;
/**
   * The stage icon, converted from design/icons. Each carries its own
   * aria-label, so the well needs no further description.
   */
  Icon: React.ComponentType<{ className?: string }>;
  /**
   * Per-icon optical correction. The four artboards are 75x66, 58x64, 74x74
   * and 89x49, so fitting them all to one box makes the square ones look
   * heavy and the wide one look small. These even them out by eye rather
   * than by bounding box.
   */
  iconScale: number;
};

/** The four-stage chain from the investor one-pager (design/Sovhi Health
 *  Investor OnePager 6.pdf). Stage names and their clinical detail are the
 *  document's own; nothing here is invented, because the point of the section
 *  is that the mechanism is established science rather than a Sovhi claim.
 *
 *  Colour escalates along the chain — teal and light blue for the upstream
 *  stages, orange and rust as it becomes pathology — reusing the same fill
 *  and text pairings the depth and team cards already use. */
const STAGES: readonly Stage[] = [
  {
    n: "01",
    title: "Psychosocial stress",
    body: "Isolation, loneliness, chronic burden",
    bg: "var(--teal)",
    fg: "var(--sovhi-green)",
    muted: "var(--sovhi-green)",
    k: 1,
    Icon: PsychosocialStress,
    iconScale: 1,
  },
  {
    n: "02",
    title: "Cortisol dysregulation",
    body: "HPA-axis activation, allostatic load",
    bg: "var(--light-blue)",
    fg: "var(--turquoise)",
    muted: "var(--turquoise)",
    k: 1.08,
    Icon: CortisolDysregulation,
    iconScale: 1.1,
  },
  {
    n: "03",
    title: "Systemic inflammation",
    body: "Cytokines, IL-6, CRP elevation",
    bg: "var(--orange)",
    fg: "var(--cream)",
    muted: "var(--rust)",
    k: 1.16,
    Icon: SystemicInflammation,
    iconScale: 1.04,
  },
  {
    n: "04",
    title: "Chronic disease",
    body: "Cardiovascular, metabolic, mental",
    bg: "var(--rust)",
    fg: "var(--cream)",
    muted: "var(--orange)",
    k: 1.24,
    Icon: ChronicDisease,
    iconScale: 1.15,
  },
];

export default function PathwaySection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: PATHWAY.inViewAmount });

  /** Every child waits on the same `inView` gate, so the chain plays once, in
   *  order, the first time the section is reached. */
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
    <section
      ref={ref}
      className="section section--green bleed-bg pathway"
      style={{ ["--bleed-color" as string]: "var(--sovhi-green)" }}
      aria-labelledby="pathway-title"
    >
      <div className="section__inner pathway__inner">
        <motion.p
          className="pathway__eyebrow"
          {...reveal(PATHWAY.fade.delay, PATHWAY.fade.duration)}
        >
          The biological pathway
        </motion.p>

        <motion.h2
          id="pathway-title"
          className="pathway__title"
          {...reveal(PATHWAY.fade.delay, PATHWAY.fade.duration)}
        >
          Stress doesn&rsquo;t stay psychological
        </motion.h2>

        <motion.p
          className="pathway__lede"
          {...reveal(PATHWAY.fade.delay + 0.1, PATHWAY.fade.duration)}
        >
          It becomes endocrine, then inflammatory, then structural. Each
          transition in this cascade is established in the peer-reviewed
          literature, and each one takes years &mdash; which is precisely why
          there is a window in which to intervene.
        </motion.p>

        <ol className="pathway__chain">
          {STAGES.map((stage, i) => (
            <li
              className="pathway__step"
              key={stage.n}
              style={{ ["--k" as string]: stage.k }}
            >
              {/* The arrow belongs to the card it points AT, so it renders
                  before that card and is skipped on the first. Rotating the
                  Figma-exported DownArrow keeps the stroke weight identical
                  to the arrows in "How it works". */}
              {i > 0 && (
                <motion.span
                  className="pathway__arrow"
                  aria-hidden="true"
                  {...reveal(
                    PATHWAY.arrow.base + (i - 1) * PATHWAY.arrow.stagger,
                    PATHWAY.arrow.duration,
                  )}
                >
                  <DownArrow className="pathway__arrow-icon" />
                </motion.span>
              )}

              {/* The entrance and the pulse are two separate elements on
                  purpose. A CSS animation outranks an inline style in the
                  cascade, so if both wrote `transform` on one node the
                  perpetual pulse would silently eat Motion's entrance
                  translate. The mount owns the entrance; the card inside it
                  owns the forever-loop. */}
              <motion.div
                className="pathway__mount"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={inView || reduceMotion ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: reduceMotion ? 0 : PATHWAY.stage.duration,
                  delay: reduceMotion
                    ? 0
                    : PATHWAY.stage.base + i * PATHWAY.stage.stagger,
                  ease: EASE_GENTLE,
                }}
              >
              <div
                className="pathway__card"
                /* Staggering the SAME keyframe track by one hold per card is
                   what produces the trade-off: card i is on its settle ramp
                   during exactly the window card i+1 is on its swell ramp. */
                data-pulse={inView && !reduceMotion ? "true" : "false"}
                style={{
                  ["--stage-bg" as string]: stage.bg,
                  ["--stage-fg" as string]: stage.fg,
                  ["--stage-muted" as string]: stage.muted,
                  ["--icon-scale" as string]: stage.iconScale,
                  ["--pulse-delay" as string]: `${i * PATHWAY.pulse.hold}s`,
                }}
              >
                {/* One Sovhi Green well on every card, whatever the card's
                    own fill. The icons were drawn for that background and it
                    is the only one all four read on — and a constant dark
                    window across four escalating cards reads as a specimen
                    series, which is the note this section wants. */}
                <div className="pathway__well">
                  <stage.Icon className="pathway__icon" />
                </div>

                <span className="pathway__stage-n">{stage.n}</span>
                <h3 className="pathway__stage-title">{stage.title}</h3>
                <p className="pathway__stage-body">{stage.body}</p>
              </div>
              </motion.div>
            </li>
          ))}
        </ol>

        <motion.p
          className="pathway__foot"
          {...reveal(PATHWAY.stage.base + 4 * PATHWAY.stage.stagger, 0.6)}
        >
          Every reimbursed measure in use today detects this at stage four.
          Sovhi instruments stage one.
        </motion.p>
      </div>
    </section>
  );
}
