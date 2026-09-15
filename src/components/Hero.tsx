"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_GENTLE, T } from "./motion-timeline";

/** Per Figma (node 382-111), confirmed against the "Find your baseline"
 *  wording that appeared in the motion brief. */
const CTA_LABEL = "Join the waitlist";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  /** The lede highlight waits for the CTA to finish landing. */
  const [ctaLanded, setCtaLanded] = useState(false);

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : T.title.duration,
      delay: reduceMotion ? 0 : delay,
      ease: EASE_GENTLE,
    },
  });

  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.h1 id="hero-title" className="hero__title" {...fadeUp(T.title.delay)}>
        Restore what&rsquo;s already yours
      </motion.h1>

      <motion.figure
        className="hero__figure"
        initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduceMotion ? 0 : T.figure.duration,
          delay: reduceMotion ? 0 : T.figure.delay,
          ease: EASE_GENTLE,
        }}
      >
        {/* `fill`, not width/height: the 1020x529 window crops a 1.25 photo to
            1.93, so declaring intrinsic dimensions makes next/image warn that
            one axis was modified without the other. The crop itself lives in
            .hero__image via object-fit and object-position. */}
        <Image
          className="hero__image"
          src="/images/hero.webp"
          alt="Three friends laughing together on a picnic blanket in a sunlit park, reaching for a tray of strawberries and pastries."
          fill
          sizes="(max-width: 1436px) 71vw, 1020px"
          priority
        />
      </motion.figure>

      <motion.p className="hero__lede" {...fadeUp(T.lede.delay)}>
        <span className="hero__lede-copy">
          Restore your own steadiness with{" "}
          <span
            className="hero__highlight"
            data-lit={reduceMotion || ctaLanded ? "true" : "false"}
          >
            intelligence trained on your history
          </span>{" "}
          rather than a population average, and guidance that adapts as you do
        </span>
      </motion.p>

      <motion.a
        className="hero__cta"
        href="#get-in-touch"
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : T.cta.duration,
          delay: reduceMotion ? 0 : T.cta.delay,
          ease: EASE_GENTLE,
        }}
        onAnimationComplete={() => setCtaLanded(true)}
      >
        {CTA_LABEL}
      </motion.a>
    </section>
  );
}
