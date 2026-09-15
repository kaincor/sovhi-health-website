"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import FooterLogo from "./icons/FooterLogo";

/**
 * Footer — Figma node 401-318.
 *
 * The dark panel rises out of the bottom as you scroll and the logo grows
 * from 80% to full size, both tied to scroll position so they reach their
 * resting state exactly at the bottom of the page. The copy is a one-shot
 * stagger once the footer is properly in view.
 */
const RISE = 160; // how far below its resting place the panel starts
const LOGO_FROM = 0.8;

/**
 * Stagger, in seconds. Centre outward: wordmark, tagline, the two buttons in
 * the order specified, then the side columns, then the legal pills.
 * Slowed from the first pass — the buttons in particular now hold back so the
 * tagline finishes its wipe before they arrive. Last item lands at 2.7s.
 */
const T = {
  wordmark: 0,
  tagline: 0.3,
  waitlist: 0.75,
  contactBtn: 1.0,
  contactCol: 1.25,
  exploreCol: 1.45,
  pills: 1.7,
} as const;

/** Each item's own fade-and-rise, lengthened to match. */
const ITEM_DURATION = 1;

const EXPLORE = [
  [
    { label: "How it works", href: "#how-it-works" },
    { label: "The science", href: "#the-science" },
    { label: "For organizations", href: "#for-organizations" },
  ],
  [
    { label: "The research", href: "#the-research" },
    { label: "About us", href: "#about-us" },
    { label: "The team", href: "#our-team" },
  ],
] as const;

export default function SiteFooter() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  /* "end end" rather than "end start": the footer is the last thing on the
     page, so it can never scroll fully past the viewport. This range ends
     when the page bottom is reached, which is exactly where the panel and
     logo should be at rest. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], [RISE, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [LOGO_FROM, 1]);

  /* once: false so the copy replays whenever the footer is scrolled back to,
     rather than being spent the first time you reach the bottom. */
  const inView = useInView(ref, { amount: 0.35 });
  const play = Boolean(inView || reduceMotion);

  /** Fade and slide up from below. */
  const up = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: {
      duration: reduceMotion ? 0 : ITEM_DURATION,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="footer-shell">
      <footer ref={ref} className="footer" id="site-footer">
        <motion.div
          className="footer__panel"
          style={{ y: reduceMotion ? 0 : panelY }}
        >
          <motion.div
            className="footer__logo"
            style={{ scale: reduceMotion ? 1 : logoScale }}
          >
            <FooterLogo />
          </motion.div>

          <motion.p className="footer__wordmark" {...up(T.wordmark)}>
            Sovhi
            <br />
            Health
          </motion.p>

          <p className="footer__tagline" data-lit={play}>
            Restore what&rsquo;s already yours
          </p>

          {/* Wrappers below are inert on the wide layout: they are static,
              and every child inside them is absolutely positioned against
              .footer__panel, which skips static ancestors. They exist so the
              compact layout has something to lay out with, instead of every
              element becoming a separate row in one long centred column. */}
          <div className="footer__actions">
          <motion.a
            className="footer__cta footer__cta--waitlist"
            href="#join"
            {...up(T.waitlist)}
          >
            Join the waitlist
          </motion.a>
          <motion.a
            className="footer__cta footer__cta--contact"
            href="#get-in-touch"
            {...up(T.contactBtn)}
          >
            Get in touch
          </motion.a>
          </div>

          <div className="footer__cols">
          <div className="footer__col footer__col--contact">
          <motion.h2
            className="footer__col-title footer__col-title--contact"
            {...up(T.contactCol)}
          >
            Contact
          </motion.h2>
          <div className="footer__list">
          <motion.p className="footer__item footer__item--phone" {...up(T.contactCol)}>
            000 - 000 0000
          </motion.p>
          <motion.a
            className="footer__item footer__item--email footer__item--link"
            href="mailto:info@sovhi.com"
            {...up(T.contactCol)}
          >
            info@sovhi.com
          </motion.a>
          <motion.a
            className="footer__item footer__item--linkedin footer__item--link"
            href="https://www.linkedin.com/"
            {...up(T.contactCol)}
          >
            LinkedIn
          </motion.a>
          </div>
          </div>

          <div className="footer__col footer__col--explore">
          <motion.h2
            className="footer__col-title footer__col-title--explore"
            {...up(T.exploreCol)}
          >
            Explore
          </motion.h2>
          <div className="footer__list">
          {EXPLORE.map((col, ci) =>
            col.map((link, ri) => (
              <motion.a
                key={link.label}
                className={`footer__item footer__item--link footer__item--c${ci + 1} footer__item--r${ri + 1}`}
                href={link.href}
                {...up(T.exploreCol)}
              >
                {link.label}
              </motion.a>
            )),
          )}
          </div>
          </div>
          </div>

          <div className="footer__pills">
          <motion.p
            className="footer__pill footer__pill--copyright"
            {...up(T.pills)}
          >
            © 2026 Sovhi Health
          </motion.p>
          <motion.p className="footer__pill footer__pill--legal" {...up(T.pills)}>
            <a href="#privacy">Privacy policy</a>
            <a href="#terms">Terms of Use</a>
          </motion.p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
