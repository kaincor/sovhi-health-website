"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

/**
 * "One problem. Four places to intervene".
 *
 * Selecting a tab changes the background, photo and copy. The bar never moves
 * or fades — only its colours cross-fade and the highlight pill slides.
 *
 * Every value below is from Figma Dev Mode for that state — all four states
 * were exported, so nothing here is inferred. The rule turned out to be:
 * active pill = the state's accent colour with Cream text; inactive labels =
 * the same accent on the Cream bar.
 *
 * Tab widths tile the bar exactly: 5 + 154 + 193 + 188 + 135 + 5 = 680.
 *
 * Each state crops its photo differently. Figma renders every image 1224 wide
 * and offsets it vertically; since all four source ratios are below the
 * container's 2.003, `cover` scales by width, so the offset converts to an
 * object-position of offset / (renderedHeight - 611).
 */
type Audience = {
  id: string;
  tab: string;
  /** Figma tile width inside the 680 bar: 154 | 193 | 188 | 135 = 670. */
  tabWidth: number;
  title: string;
  body: string;
  image: string;
  /** vertical object-position reproducing Figma's crop for this state */
  cropY: string;
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
    image: "/images/woman-coding.jpg",
    cropY: "49.837%", // 1224x918 at -153
    bg: "var(--sovhi-green)",
    fg: "var(--cream)",
    accent: "var(--sovhi-green)",
    pill: "var(--sovhi-green)",
    pillFg: "var(--cream)",
  },
  {
    id: "payers",
    tabWidth: 193,
    tab: "Health Plans & Payers",
    title: "See risk before utilization",
    body: "Surface upstream signals that can help identify members who may need support earlier.",
    image: "/images/running-on-track.jpg",
    cropY: "25.243%", // 1224x817 at -52
    bg: "var(--orange)",
    fg: "var(--cream)",
    accent: "var(--orange)",
    pill: "var(--orange)",
    pillFg: "var(--cream)",
  },
  {
    id: "providers",
    tabWidth: 188,
    tab: "Healthcare Providers",
    title: "Bring context into care",
    body: "Understand the conditions surrounding a patient's health alongside the clinical picture.",
    image: "/images/healthcare-providers.png",
    cropY: "66.667%", // 1224x689 at -52
    bg: "var(--light-blue)",
    fg: "var(--turquoise)",
    accent: "var(--turquoise)",
    pill: "var(--turquoise)",
    pillFg: "var(--cream)",
  },
  {
    id: "public",
    tabWidth: 135,
    tab: "Public Health",
    title: "Move prevention upstream",
    body: "Measure the conditions shaping community wellbeing and identify where intervention can begin.",
    image: "/images/making-music.jpg",
    cropY: "16.938%", // 1224x918 at -52
    bg: "var(--teal)",
    fg: "var(--sovhi-green)",
    accent: "var(--sovhi-green)",
    pill: "var(--sovhi-green)",
    pillFg: "var(--cream)",
  },
];

/** Dwell time before the tabs advance on their own. */
const AUTOPLAY_MS = 4000;

export default function AudiencesSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = AUDIENCES[active];

  /* Advances on its own every 4s. The timer is keyed on `active`, so any click
     restarts the countdown rather than fighting it. Paused off-screen so the
     section is not cycling where nobody can see it, and disabled outright
     under reduced-motion, where unrequested movement is the whole complaint. */
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });

  /* Bumped on every click. Keying the timer on `active` alone is not enough:
     clicking the tab that is already selected sets the same value, React bails
     out of the re-render, the effect never re-runs, and the old countdown
     keeps going — so that click would be ignored and the section could advance
     a fraction of a second later. */
  const [nudge, setNudge] = useState(0);
  const select = useCallback((i: number) => {
    setActive(i);
    setNudge((n) => n + 1);
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setTimeout(
      () => setActive((i) => (i + 1) % AUDIENCES.length),
      AUTOPLAY_MS,
    );
    return () => clearTimeout(id);
  }, [active, nudge, inView, reduceMotion]);

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

  /* Out fast, in a touch slower and behind the background, so the copy hands
     over rather than blinking. */
  const swapIn = {
    duration: reduceMotion ? 0 : 0.3,
    delay: reduceMotion ? 0 : 0.1,
    ease: "easeOut" as const,
  };
  const swapOut = { duration: reduceMotion ? 0 : 0.18, ease: "easeIn" as const };

  return (
    <div className="audiences-shell">
      <section
        ref={sectionRef}
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

        {/* All four stay mounted and cross-fade on opacity. Swapping a single
            <Image> through AnimatePresence meant the incoming photo began
            downloading as the fade started, which read as a jump rather than
            a fade. */}
        <figure className="audiences__figure">
          {AUDIENCES.map((a, i) => (
            <motion.div
              key={a.id}
              className="audiences__slide"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                ease: "easeInOut",
              }}
              aria-hidden={i !== active}
            >
              <Image
                src={a.image}
                alt=""
                fill
                sizes="(max-width: 1179px) 92vw, 1224px"
                style={{ objectPosition: `center ${a.cropY}` }}
                priority={i === 0}
              />
            </motion.div>
          ))}
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
              onClick={() => select(i)}
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
            exit={{ opacity: 0, transition: swapOut }}
            transition={swapIn}
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
            exit={{ opacity: 0, transition: swapOut }}
            transition={swapIn}
          >
            {current.body}
          </motion.p>
        </AnimatePresence>
      </section>
    </div>
  );
}
