"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import DownArrow from "./icons/DownArrow";
import useMediaQuery from "./useMediaQuery";
import { EASE_GENTLE, HOW } from "./motion-timeline";

/** Figma nodes 416-841 (collapsed) and 386-137 (expanded). */
const STEPS = [
  {
    id: "assess",
    title: "Start with a few questions",
    body: "Sovhi’s intelligent, science backed assessment looks at everyday factors that shape your health, from stress and connection to sleep and digital habits",
  },
  {
    id: "score",
    title: "Understand what’s driving your score",
    body: "Your Vitality Score brings those signals together, showing where you’re doing well, what may need attention, and why.",
  },
  {
    id: "act",
    title: "Know what to do next",
    body: "Get personalized, practical guidance built around your life — so you can make small changes that add up over time.",
  },
] as const;

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();
  /* Asks for (hover: none) rather than (hover: hover) on purpose. A media
     query is unknowable during SSR and reads false there, so phrasing it this
     way makes the server render the closed state — correct for Figma and for
     mouse users — and lets touch devices open card 1 after hydration. The
     inverse phrasing would render card 1 open on the server and visibly
     collapse it for every desktop visitor. */
  const isTouch = useMediaQuery("(hover: none)");

  /* null means "nobody has interacted yet", which is not the same as "nothing
     is open": hover devices rest closed, touch devices rest on the first card.
     Deriving it avoids correcting state in an effect after hydration. */
  const [active, setActive] = useState<number | null>(null);
  const openIndex = active ?? (isTouch ? 0 : null);

  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: HOW.inViewAmount });
  const play = Boolean(inView || reduceMotion);

  const fade = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0 },
    animate: play ? { opacity: 1 } : { opacity: 0 },
    transition: {
      duration: reduceMotion ? 0 : HOW.fade.duration,
      delay: reduceMotion ? 0 : HOW.fade.delay,
      ease: "easeOut" as const,
    },
  };

  return (
    <div className="how-shell">
      <section
        ref={ref}
        className="how bleed-bg"
        aria-labelledby="how-title"
        id="how-it-works"
      >
        <motion.h2 id="how-title" className="how__title" {...fade}>
          A clearer picture of what&rsquo;s shaping your health
        </motion.h2>

        <motion.figure className="how__figure" {...fade}>
          <Image
            src="/images/phone-in-hand-render.png"
            alt="A passenger on a plane holding a phone showing a Sovhi vitality score of 78 out of 100, with a breakdown of the signals driving it."
            width={1020}
            height={680}
            priority={false}
          />
        </motion.figure>

        <ul className="how__steps">
          {STEPS.map((step, i) => {
            const isOpen = openIndex === i;
            const open = () => setActive(i);
            return (
              <li key={step.id} className="how__step">
                <motion.button
                  type="button"
                  className="how__card"
                  data-open={isOpen}
                  data-ready={play}
                  aria-expanded={isOpen}
                  aria-controls={`how-body-${step.id}`}
                  onMouseEnter={open}
                  onFocus={open}
                  onClick={open}
                  initial={
                    reduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 24 }
                  }
                  animate={
                    play
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 24 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : HOW.cards.duration,
                    delay: reduceMotion ? 0 : HOW.cards.base + i * HOW.cards.stagger,
                    ease: EASE_GENTLE,
                  }}
                >
                  <span className="how__num">{i + 1}</span>
                  <span className="how__step-title">{step.title}</span>

                  {/* One block carries the whole 185 -> 367 growth. The arrow
                      and body sit at fixed offsets from its top, so neither
                      moves while the height animates. */}
                  <motion.span
                    className="how__reveal"
                    initial={{ "--reveal-t": 0 }}
                    animate={{ "--reveal-t": isOpen ? 1 : 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            duration: HOW.reveal.duration,
                            bounce: HOW.reveal.bounce,
                          }
                    }
                  >
                    <motion.span
                      className="how__arrow-slot"
                      animate={{ opacity: isOpen ? 0 : 1 }}
                      transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    >
                      <DownArrow className="how__arrow" />
                    </motion.span>

                    <motion.span
                      id={`how-body-${step.id}`}
                      className="how__body"
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.35,
                        delay: reduceMotion || !isOpen ? 0 : 0.15,
                        ease: "easeOut",
                      }}
                    >
                      {step.body}
                    </motion.span>
                  </motion.span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
