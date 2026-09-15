"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import useMediaQuery from "./useMediaQuery";

/**
 * "Be among the first..." — Figma node 401-286.
 *
 * Eight photo cards deal in from a point past the bottom-right corner,
 * alternating right/left and building outward from the centre, then parallax
 * as the section passes through the viewport.
 *
 * Parallax and the deal both write translateY, so each card is two nested
 * elements: the outer drifts, the inner is dealt.
 */
const DECK = { x: 1520, y: 880 };
const DEAL = { base: 0.1, stagger: 0.22, duration: 0.9, bounce: 0.28 };

type Card = {
  id: string;
  /** Figma box: left, top, width, height. */
  box: [number, number, number, number];
  /** Figma's render inside that box: width, height, left, top. */
  img: [number, number, number, number];
  src: string;
  alt: string;
  /** Deal position: alternating sides, innermost first. */
  order: number;
  /** Parallax magnitude, 0.1 (distant) to 0.4 (near). */
  depth: number;
  /** Which compact strip it belongs to. */
  strip: "top" | "bottom";
  /** Idle drift: amplitude px, tilt deg, period s, phase offset s. */
  float: [number, number, number, number];
};

const CARDS: readonly Card[] = [
  {
    id: "dusk",
    box: [108, 142, 165, 140],
    img: [186.67, 140, -22, 0],
    src: "/images/hanging-out-at-dusk.jpg",
    alt: "Friends sitting together by the water at dusk.",
    order: 7,
    depth: 0.45,
    strip: "top",
    float: [6, 0.7, 7.2, -0.4],
  },
  {
    id: "steps",
    box: [263, 42, 124, 170],
    // AMBIGUOUS: needs ratio 1.4989, which both track photos match.
    img: [254.82, 170, -49, 0],
    src: "/images/aerial-track-view.jpg",
    alt: "An overhead view of a running track.",
    order: 3,
    depth: 0.16,
    strip: "top",
    float: [4, 0.5, 5.6, -2.3],
  },
  {
    id: "window",
    box: [376, 51, 190, 156],
    img: [253, 156, -24, 0],
    src: "/images/woman-at-window-with-mug.png",
    alt: "A woman stretching by a sunlit window with a mug.",
    order: 1,
    depth: 0.2,
    strip: "top",
    float: [5, 0.6, 8.1, -1.1],
  },
  {
    id: "track",
    box: [1137, 129, 125, 170],
    // AMBIGUOUS: needs ratio 1.4989, same pair as "steps".
    img: [254.82, 170, -13, 0],
    src: "/images/running-on-track.jpg",
    alt: "Runners on an outdoor track.",
    order: 4,
    depth: 0.55,
    strip: "top",
    float: [5, 0.8, 6.4, -3.0],
  },
  {
    id: "nutrition",
    box: [1176, 427, 156, 208],
    img: [369.97, 208, -70, 0],
    src: "/images/nutritionist-advice.png",
    alt: "A clinician reviewing nutrition guidance on a tablet.",
    order: 6,
    depth: 0.62,
    strip: "bottom",
    float: [6, 0.5, 7.8, -1.7],
  },
  {
    id: "picnic",
    box: [1003, 609, 190, 161],
    // AMBIGUOUS: needs ratio 1.2551 — hero.webp and teal-hero.png both match.
    // The render looks like the teal-shirt variant.
    img: [253.53, 202, 5, -41],
    src: "/images/teal-hero.png",
    alt: "Friends sharing a picnic on the grass.",
    order: 2,
    depth: 0.2,
    strip: "bottom",
    float: [5, 0.7, 6.9, -2.8],
  },
  {
    id: "desk",
    box: [873, 621, 165, 151],
    img: [201.33, 151, 0, 0],
    src: "/images/woman-coding.jpg",
    alt: "A developer at a desk with two monitors.",
    order: 0,
    depth: 0.19,
    strip: "bottom",
    float: [4, 0.4, 8.6, -0.9],
  },
  {
    id: "music",
    box: [175, 624, 200, 156],
    img: [208, 156, -4, 0],
    src: "/images/making-music.jpg",
    alt: "Two people playing music together on a rug.",
    order: 5,
    depth: 0.16,
    strip: "bottom",
    float: [4, 0.6, 6.1, -3.4],
  },
];

/**
 * How far a depth-1.0 card would travel across the section's full pass.
 *
 * Raised from 240 to 420 and the depths retuned per card: each card's limit
 * is how much room it has to the nearer section edge, and those differ a lot
 * (the bottom row has ~42-52px, the middle-right has 187). Assigning by
 * headroom rather than uniformly lets the roomy cards travel 130px while
 * nothing clips.
 */
const PARALLAX_RANGE = 420;

function PhotoCard({
  card,
  play,
  scatter,
  reduceMotion,
  progress,
}: {
  card: Card;
  play: boolean;
  scatter: boolean;
  reduceMotion: boolean | null;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [bx, by, bw, bh] = card.box;
  const [iw, ih, ix, iy] = card.img;
  const [fAmp, fRot, fDur, fPhase] = card.float;
  const travel = card.depth * PARALLAX_RANGE;

  /* Neutral at the midpoint of the pass, so the Figma position is what you
     see when the section is centred. */
  const y = useTransform(progress, [0, 1], [travel / 2, -travel / 2]);

  const rest = { x: 0, y: 0, opacity: 1 };
  const dealt = scatter
    ? { x: DECK.x - bx, y: DECK.y - by, opacity: 0 }
    : { x: 0, y: 24, opacity: 0 };
  const delay = DEAL.base + card.order * DEAL.stagger;

  return (
    <motion.div
      className="waitlist__card"
      style={{
        left: `calc(${bx} * var(--u))`,
        top: `calc(${by} * var(--u))`,
        width: `calc(${bw} * var(--u))`,
        height: `calc(${bh} * var(--u))`,
        y: reduceMotion || !scatter ? 0 : y,
      }}
    >
      <div
        className="waitlist__card-float"
        style={
          {
            "--float-y": `${fAmp}px`,
            "--float-rot": `${fRot}deg`,
            "--float-dur": `${fDur}s`,
            "--float-delay": `${fPhase}s`,
          } as React.CSSProperties
        }
      >
      <motion.div
        className="waitlist__card-inner"
        initial={reduceMotion ? rest : dealt}
        animate={play ? rest : dealt}
        /* Snap until the deal fires: useMediaQuery is false during SSR and
           corrects after hydration, and animating that flip would leave later
           cards still travelling to the deck when their turn came. */
        transition={
          !play || reduceMotion
            ? { duration: 0 }
            : {
                default: {
                  type: "spring",
                  duration: DEAL.duration,
                  bounce: DEAL.bounce,
                  delay,
                },
                opacity: { duration: 0.25, delay, ease: "easeOut" },
              }
        }
      >
        <Image
          src={card.src}
          alt={card.alt}
          width={Math.round(iw)}
          height={Math.round(ih)}
          style={{
            width: `calc(${iw} * var(--u))`,
            height: `calc(${ih} * var(--u))`,
            left: `calc(${ix} * var(--u))`,
            top: `calc(${iy} * var(--u))`,
          }}
        />
      </motion.div>
      </div>
    </motion.div>
  );
}

export default function WaitlistSection() {
  const reduceMotion = useReducedMotion();
  const scatter = useMediaQuery("(min-width: 1180px)");
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const play = Boolean(inView || reduceMotion);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const fade = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0 },
    animate: play ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8, ease: "easeOut" as const },
  };

  const strip = (which: "top" | "bottom") =>
    CARDS.filter((c) => c.strip === which).map((c) => (
      <PhotoCard
        key={c.id}
        card={c}
        play={play}
        scatter={scatter}
        reduceMotion={reduceMotion}
        progress={scrollYProgress}
      />
    ));

  return (
    <div className="waitlist-shell">
      <section
        ref={ref}
        className="waitlist"
        aria-labelledby="waitlist-title"
        id="get-in-touch"
      >
        <div className="waitlist__strip waitlist__strip--top">
          {strip("top")}
        </div>

        <motion.p className="waitlist__eyebrow" {...fade}>
          The Next Step
        </motion.p>

        <motion.h2 id="waitlist-title" className="waitlist__title" {...fade}>
          Be among the first to see
          <br />
          what&rsquo;s shaping health earlier
        </motion.h2>

        <motion.a className="waitlist__cta" href="#join" {...fade}>
          Join the waitlist
        </motion.a>

        <div className="waitlist__strip waitlist__strip--bottom">
          {strip("bottom")}
        </div>
      </section>
    </div>
  );
}
