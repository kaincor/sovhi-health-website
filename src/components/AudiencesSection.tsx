"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * "One problem. Four places to intervene".
 *
 * Selecting a tab changes the background, photo and copy. The bar never moves
 * or fades — only its colours cross-fade and the highlight pill slides.
 *
 * !! THEME COLOURS ARE PROVISIONAL !!
 * Only the Employers state has machine-generated Figma values; the other three
 * are read off the renders. `pill` / `pillFg` in particular disagree between
 * sources: the JSX gives a dark pill with cream text, which matches the
 * Providers and Public Health renders, but the Employers and Payers renders
 * look like a light pill with coloured text. Everything else is built around
 * this table, so correcting it is a four-line change.
 */
type Audience = {
  id: string;
  tab: string;
  /** Figma tile width inside the 680 bar: 154 | 193.5 | 187 | 135.5 = 670. */
  tabWidth: number;
  title: string;
  body: string;
  image: string;
  /** section background */
  bg: string;
  /** heading and copy on that background */
  fg: string;
  /** inactive tab label, sitting on the cream bar */
  accent: string;
  /** the moving highlight */
  pill: string;
  /** the selected tab's label */
  pillFg: string;
};

const AUDIENCES: readonly Audience[] = [
  {
    id: "employers",
    tabWidth: 154,
    tab: "Employers & HR",
    title: "Catch burnout before it becomes turnover",
    body: "Identify patterns of stress, disconnection, and wellbeing risk before they become attrition, absence, or rising costs.",
    // TODO: awaiting the desk-with-code photo; placeholder until it lands.
    image: "/images/making-music.jpg",
    bg: "var(--sovhi-green)",
    fg: "var(--cream)",
    accent: "var(--sovhi-green)",
    pill: "var(--sovhi-green)",
    pillFg: "var(--cream)",
  },
  {
    id: "payers",
    tabWidth: 193.5,
    tab: "Health Plans & Payers",
    title: "See risk before utilization",
    body: "Surface upstream signals that can help identify members who may need support earlier.",
    // TODO: awaiting the runners photo.
    image: "/images/making-music.jpg",
    bg: "var(--orange)",
    fg: "var(--cream)",
    accent: "var(--orange)",
    pill: "var(--rust)",
    pillFg: "var(--cream)",
  },
  {
    id: "providers",
    tabWidth: 187,
    tab: "Healthcare Providers",
    title: "Bring context into care",
    body: "Understand the conditions surrounding a patient's health alongside the clinical picture.",
    // TODO: awaiting the doctor photo.
    image: "/images/making-music.jpg",
    bg: "var(--light-blue)",
    fg: "var(--turquoise)",
    accent: "var(--turquoise)",
    pill: "var(--turquoise)",
    pillFg: "var(--cream)",
  },
  {
    id: "public",
    tabWidth: 135.5,
    tab: "Public Health",
    title: "Move prevention upstream",
    body: "Measure the conditions shaping community wellbeing and identify where intervention can begin.",
    image: "/images/making-music.jpg",
    bg: "var(--teal)",
    fg: "var(--sovhi-green)",
    accent: "var(--sovhi-green)",
    pill: "var(--sovhi-green)",
    pillFg: "var(--cream)",
  },
];

export default function AudiencesSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = AUDIENCES[active];

  /* The pill is placed from the selected tab's measured box rather than from
     hard-coded offsets, so it stays correct when the bar becomes a 2x2 grid
     on narrow screens. */
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const measure = useCallback(() => {
    const bar = barRef.current;
    const tab = tabRefs.current[active];
    if (!bar || !tab) return;
    const b = bar.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    setPill({
      x: t.left - b.left,
      y: t.top - b.top,
      w: t.width,
      h: t.height,
    });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const swap = { duration: reduceMotion ? 0 : 0.3, ease: "easeOut" as const };

  return (
    <div className="audiences-shell">
      <section
        className="audiences bleed-bg"
        aria-labelledby="audiences-title"
        id="for-organizations"
        style={
          {
            "--aud-bg": current.bg,
            "--aud-fg": current.fg,
            "--aud-accent": current.accent,
            "--aud-pill": current.pill,
            "--aud-pill-fg": current.pillFg,
          } as React.CSSProperties
        }
      >
        <h2 id="audiences-title" className="audiences__title">
          One problem. Four places to intervene
        </h2>

        {/* Cross-fades: the old photo leaves while the new one arrives, both
            stacked in the same clipped box so the card never collapses. */}
        <figure className="audiences__figure">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.id}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={swap}
              style={{ position: "absolute", inset: 0 }}
            >
              <Image
                src={current.image}
                alt=""
                fill
                sizes="(max-width: 1179px) 92vw, 1224px"
              />
            </motion.div>
          </AnimatePresence>
        </figure>

        <div className="audiences__tabs" ref={barRef} role="tablist">
          <motion.div
            className="audiences__pill"
            aria-hidden="true"
            animate={{ x: pill.x, y: pill.y, width: pill.w, height: pill.h }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.45, bounce: 0.2 }
            }
          />
          {AUDIENCES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              id={`aud-tab-${a.id}`}
              aria-selected={active === i}
              aria-controls={`aud-panel-${a.id}`}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className="audiences__tab"
              style={{ width: `calc(${a.tabWidth} * var(--u))` }}
              onClick={() => setActive(i)}
            >
              {a.tab}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false} mode="wait">
          <motion.h3
            key={`${current.id}-t`}
            id={`aud-panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`aud-tab-${current.id}`}
            className="audiences__panel-title"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={swap}
          >
            {current.title}
          </motion.h3>
        </AnimatePresence>

        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={`${current.id}-b`}
            className="audiences__panel-body"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={swap}
          >
            {current.body}
          </motion.p>
        </AnimatePresence>
      </section>
    </div>
  );
}
