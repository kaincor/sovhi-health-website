"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * One card is expanded at a time. Each grows over EXPAND, holds for HOLD, and
 * contracts over CONTRACT — only once it is back at rest does the next card
 * begin, so the four never overlap.
 */
const EXPAND = 0.5;
const HOLD = 2.5;
const CONTRACT = 0.5;
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Fallback until --stat-growth is read off the DOM (design value at 1728px). */
const DEFAULT_GROWTH = 213;

type Stat = {
  tone: "green" | "orange" | "blue" | "teal";
  /** Symbols render at regular weight; the numeral itself is bold. */
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
};

const stats: Stat[] = [
  {
    tone: "green",
    value: "30",
    suffix: "%",
    label:
      "Higher mortality risk associated with chronic disconnection and isolation",
  },
  {
    tone: "orange",
    prefix: "$",
    value: "150B+",
    label: "Annual employer cost associated with burnout and disconnection.",
  },
  {
    tone: "blue",
    value: "58",
    suffix: "%",
    label: "U.S. adults reporting meaningful chronic connection",
  },
  {
    tone: "teal",
    prefix: "~",
    value: "30",
    suffix: "%",
    label:
      "Higher cardiovascular risk associated with chronic stress and isolation",
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const [growth, setGrowth] = useState(DEFAULT_GROWTH);
  const [cycle, setCycle] = useState({ index: 0, active: true });

  // Idle while scrolled away so the loop is not burning frames off-screen.
  const animating = inView && !reducedMotion;

  // Each rectangle grows by exactly the room the stylesheet reserves above it,
  // which keeps the breakpoints as the single source of truth for sizing.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const readGrowth = () => {
      const reserved = Number.parseFloat(
        getComputedStyle(section).getPropertyValue("--stat-growth"),
      );
      if (!Number.isNaN(reserved)) setGrowth(reserved);
    };

    readGrowth();
    window.addEventListener("resize", readGrowth);
    return () => window.removeEventListener("resize", readGrowth);
  }, [reducedMotion]);

  // Hold the active card for its expansion plus its dwell, then rest for the
  // length of a contraction before handing off to the next card.
  useEffect(() => {
    if (!animating) return;

    const timer = setTimeout(
      () =>
        setCycle((prev) =>
          prev.active
            ? { index: prev.index, active: false }
            : { index: (prev.index + 1) % stats.length, active: true },
        ),
      (cycle.active ? EXPAND + HOLD : CONTRACT) * 1000,
    );

    return () => clearTimeout(timer);
  }, [cycle, animating]);

  const activeIndex = animating && cycle.active ? cycle.index : -1;

  return (
    <section className="stats" id="evidence" ref={sectionRef}>
      <div className="stats-intro">
        <h2>
          {/* The space survives when the break is hidden at mobile widths,
              where the two sentences reflow into one balanced block. */}
          Stress doesn&rsquo;t just feel heavy.{" "}
          <br />
          It wears your body down
        </h2>
        <p>
          Not all wear is visible. Chronic stress and social disconnection can
          accumulate over time, creating a measurable biological burden known as
          allostatic load. The effects can begin long before they appear as a
          diagnosis.
        </p>
      </div>

      <ul className="stats-grid">
        {stats.map((stat, index) => {
          const isActive = index === activeIndex;

          return (
            <li className="stat" key={stat.label} data-tone={stat.tone}>
              <div className="stat-card" data-active={isActive}>
                {/* Bottom-anchored: the top edge travels up, the bottom stays put. */}
                <motion.div
                  className="stat-fill"
                  aria-hidden="true"
                  initial={false}
                  animate={{ top: isActive ? -growth : 0 }}
                  transition={{
                    duration: isActive ? EXPAND : CONTRACT,
                    ease: EASE,
                  }}
                />
                <div className="stat-body">
                  <p className="stat-value">
                    {stat.prefix ? (
                      <span className="stat-symbol">{stat.prefix}</span>
                    ) : null}
                    {stat.value}
                    {stat.suffix ? (
                      <span className="stat-symbol">{stat.suffix}</span>
                    ) : null}
                  </p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
