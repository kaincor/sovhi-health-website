"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import SovhiMark from "./SovhiMark";
import { EASE_GENTLE, T } from "./motion-timeline";

/** Scroll past this before the bar starts reacting, so tiny jitters near the
 *  top of the page do not hide it. */
const HIDE_AFTER = 80;
/** Ignore direction changes smaller than this to avoid flicker on trackpads. */
const DIRECTION_THRESHOLD = 6;

export default function SiteHeader() {
  const reduceMotion = useReducedMotion();
  /** Nav is only scroll-reactive once the intro drop-in has played. */
  const [introDone, setIntroDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  /** Bar height plus its 16px top inset, so "hidden" clears the viewport at
   *  any width. Measured rather than hard-coded because the bar height is
   *  fluid below 1440. */
  const [tuckY, setTuckY] = useState(-61);
  const barRef = useRef<HTMLElement | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const measure = () => {
      const h = barRef.current?.offsetHeight ?? 45;
      setTuckY(-(h + 16));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (Math.abs(delta) < DIRECTION_THRESHOLD) return;

      if (delta > 0 && y > HIDE_AFTER) {
        setHidden(true); // scrolling down
      } else if (delta < 0) {
        setHidden(false); // scrolling up
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const restingY = hidden && introDone ? tuckY : 0;

  return (
    <div className="site-nav-dock">
      <motion.header
        ref={barRef}
        className="site-nav"
        initial={reduceMotion ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        animate={{ y: restingY, opacity: 1 }}
        transition={
          introDone
            ? { duration: 0.35, ease: "easeInOut" }
            : {
                duration: reduceMotion ? 0 : T.nav.duration,
                delay: reduceMotion ? 0 : T.nav.delay,
                ease: EASE_GENTLE,
              }
        }
        onAnimationComplete={() => setIntroDone(true)}
      >
        <nav className="site-nav__links" aria-label="Sections">
          <a className="site-nav__item site-nav__item--works" href="#how-it-works">
            How it works
          </a>
          <a className="site-nav__item site-nav__item--who" href="#who-its-for">
            Who it&rsquo;s for
          </a>
        </nav>

        <span className="site-nav__lockup">
          <span className="site-nav__brand">Sovhi Health</span>
          <SovhiMark className="site-nav__mark" />
        </span>

        <div className="site-nav__actions">
          <a className="site-nav__item site-nav__item--team" href="#our-team">
            Our team
          </a>
          <a className="site-nav__cta" href="#get-in-touch">
            Get in touch
          </a>
        </div>
      </motion.header>
    </div>
  );
}
