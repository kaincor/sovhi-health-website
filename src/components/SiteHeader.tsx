"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import SovhiMark from "./SovhiMark";
import useMediaQuery from "./useMediaQuery";
import { EASE_GENTLE, T } from "./motion-timeline";

/** Scroll past this before the bar starts reacting, so tiny jitters near the
 *  top of the page do not hide it. */
const HIDE_AFTER = 80;
/** Ignore direction changes smaller than this to avoid flicker on trackpads. */
const DIRECTION_THRESHOLD = 6;

/**
 * Matches the CSS breakpoint where the bar becomes a phone navbar. Below it
 * the two inline section links are dropped for a hamburger, and the bar stops
 * tucking away on scroll — a phone navbar that disappears leaves the user with
 * no way back to the menu.
 */
const MOBILE_NAV = "(max-width: 560px)";

/** The links that live inline on the wide bar and inside the sheet on a
 *  phone. One list, so the two can never drift apart. */
const SECTIONS = [
  { href: "#how-it-works", label: "How it works", cls: "works" },
  { href: "#who-its-for", label: "Who it’s for", cls: "who" },
  { href: "#our-team", label: "Our team", cls: "team" },
] as const;

export default function SiteHeader() {
  const reduceMotion = useReducedMotion();
  /* Reports false during SSR and corrects after hydration. Everything that
     branches on it is either inert at the top of the page (the scroll tuck)
     or hidden by CSS anyway (the hamburger), so the false state is safe. */
  const isMobileNav = useMediaQuery(MOBILE_NAV);

  /** Nav is only scroll-reactive once the intro drop-in has played. */
  const [introDone, setIntroDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  /* What the button asked for. The sheet's actual open state is derived from
     it below, so widening past the breakpoint closes the sheet on its own —
     no effect syncing one piece of state to another. */
  const [menuRequested, setMenuRequested] = useState(false);
  /** Bar height plus its 16px top inset, so "hidden" clears the viewport at
   *  any width. Measured rather than hard-coded because the bar height is
   *  fluid below 1440. */
  const [tuckY, setTuckY] = useState(-61);
  const barRef = useRef<HTMLElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const lastY = useRef(0);

  /** The sheet only exists below the breakpoint: above it, every link in the
   *  sheet is already inline on the bar. */
  const menuOpen = menuRequested && isMobileNav;

  const closeMenu = useCallback(() => setMenuRequested(false), []);

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

  /** Escape closes and hands focus back to the button that opened it. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  /* The bar never tucks on a phone, and never tucks while the sheet is open
     at any width — taking the trigger off screen mid-interaction would leave
     the sheet anchored to nothing. */
  const canTuck = introDone && !isMobileNav && !menuOpen;
  const restingY = hidden && canTuck ? tuckY : 0;

  return (
    <div className="site-nav-dock" data-menu-open={menuOpen}>
      {/* Catches taps outside the sheet. Keyboard users get Escape and the
          toggle button, so this needs no role of its own. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="site-nav__scrim"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          />
        )}
      </AnimatePresence>

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
        {/* First in the DOM so it lands at the left end of the bar without
            any ordering tricks. display:none above the breakpoint. */}
        <button
          ref={btnRef}
          type="button"
          className="site-nav__menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-nav-menu"
          onClick={() => setMenuRequested((o) => !o)}
        >
          {/* Three bars that fold into a cross when open: the outer two
              rotate onto the middle's line and the middle fades out. */}
          <span className="site-nav__bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className="site-nav__links" aria-label="Sections">
          {SECTIONS.filter((s) => s.cls !== "team").map((s) => (
            <a
              key={s.href}
              className={`site-nav__item site-nav__item--${s.cls}`}
              href={s.href}
            >
              {s.label}
            </a>
          ))}
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

        {/* Drops from under the bar. Unmounted when closed, so it is out of
            the accessibility tree rather than merely invisible. */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="site-nav-menu"
              className="site-nav__menu"
              aria-label="Menu"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: reduceMotion ? 0 : 0.24,
                ease: EASE_GENTLE,
              }}
            >
              {SECTIONS.map((s) => (
                <a
                  key={s.href}
                  className="site-nav__menu-item"
                  href={s.href}
                  onClick={closeMenu}
                >
                  {s.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
