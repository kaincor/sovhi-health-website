"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import useMediaQuery from "./useMediaQuery";

/**
 * "Health doesn't start with a diagnosis" — layout from Figma node 435-77,
 * the two text states from 436-183 (which uses different sizes and colours;
 * only its copy is taken).
 *
 * One blurb is expanded at a time. Expanded is 700 wide on Cream with
 * Turquoise text, a longer body and a photo; collapsed is 244 on Turquoise
 * with Cream text and a one-line summary. Connection starts open, and a blurb
 * stays open until a different one is hovered.
 */
const WIDE = 700;
const NARROW = 244;

type Signal = {
  id: string;
  title: string;
  /** Shown collapsed. */
  summary: string;
  /** Shown expanded. */
  body: string;
  photo: string;
  alt: string;
  row: 1 | 2;
};

const SIGNALS: readonly Signal[] = [
  {
    id: "connection",
    title: "Connection",
    summary: "The relationships around you",
    body: "The strength of your relationships, sense of belonging, and social support can shape resilience and long term health.",
    photo: "/images/making-music.jpg",
    alt: "Two people playing music together on a patterned rug.",
    row: 1,
  },
  {
    id: "stress",
    title: "Stress & Resilience",
    summary: "How you respond to pressure",
    body: "Stress is inevitable. What matters is how often your system is activated, and also how well it recovers.",
    // TODO: placeholder until this blurb gets its own photo.
    photo: "/images/hanging-out-at-dusk.jpg",
    alt: "",
    row: 1,
  },
  {
    id: "sleep",
    title: "Sleep & Recovery",
    summary: "The time your body has to reset",
    // Verbatim from Figma, including the full stop after "repair" — flagged
    // as a likely typo for a comma.
    body: "Sleep gives the body time to repair. regulate, and recover from the demands of every day life.",
    photo: "/images/hanging-out-at-dusk.jpg",
    alt: "",
    row: 1,
  },
  {
    id: "digital",
    title: "Digital Balance",
    summary: "Your relationship with tech",
    body: "The way we use screens can shape attention, mood, behavior, and the quality of our recovery.",
    photo: "/images/hanging-out-at-dusk.jpg",
    alt: "",
    row: 2,
  },
  {
    id: "purpose",
    title: "Purpose & Wellbeing",
    summary: "How life feels from the inside",
    body: "Meaning, agency, and the ability to manage daily demands can influence how we cope, connect, and recover.",
    photo: "/images/hanging-out-at-dusk.jpg",
    alt: "",
    row: 2,
  },
  {
    id: "environment",
    title: "Environment",
    summary: "The world around you",
    body: "Where you live, work, and spend your time can shape stress, connection, recovery, and wellbeing.",
    photo: "/images/hanging-out-at-dusk.jpg",
    alt: "",
    row: 2,
  },
];

/** Gentle ease in, ease out, per the brief. */
const EASE = [0.42, 0, 0.35, 1] as const;
const DURATION = 0.55;

function Card({
  signal,
  open,
  onOpen,
  reduceMotion,
  animate,
}: {
  signal: Signal;
  open: boolean;
  onOpen: () => void;
  reduceMotion: boolean | null;
  animate: boolean;
}) {
  const t = reduceMotion
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE };

  return (
    <motion.li
      className="signals__card"
      data-open={open}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onOpen}
      tabIndex={0}
      aria-expanded={open}
      animate={
        animate
          ? { width: `calc(${open ? WIDE : NARROW} * var(--u))` }
          : undefined
      }
      transition={t}
      style={
        animate
          ? { width: `calc(${open ? WIDE : NARROW} * var(--u))` }
          : undefined
      }
    >
      <motion.h3
        className="signals__card-title"
        animate={
          animate
            ? { width: `calc(${open ? 333 : 180} * var(--u))` }
            : undefined
        }
        transition={t}
      >
        {signal.title}
      </motion.h3>

      <motion.p
        className="signals__card-body"
        animate={
          animate
            ? { width: `calc(${open ? 220 : 180} * var(--u))` }
            : undefined
        }
        transition={t}
      >
        {open ? signal.body : signal.summary}
      </motion.p>

      <motion.div
        className="signals__photo"
        animate={animate ? { opacity: open ? 1 : 0 } : undefined}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: DURATION, ease: EASE, delay: open ? 0.12 : 0 }
        }
      >
        <Image
          src={signal.photo}
          alt={signal.alt}
          width={461}
          height={346}
        />
      </motion.div>
    </motion.li>
  );
}

export default function SignalsSection() {
  const reduceMotion = useReducedMotion();
  /* Below this the blurbs stack and all show their full copy, so there is
     nothing to expand and the widths must not be animated. */
  const isRow = useMediaQuery("(min-width: 1180px)");
  const [open, setOpen] = useState("connection");
  const select = useCallback((id: string) => setOpen(id), []);

  const row = (n: 1 | 2) =>
    SIGNALS.filter((s) => s.row === n).map((s) => (
      <Card
        key={s.id}
        signal={s}
        open={isRow ? open === s.id : true}
        onOpen={() => select(s.id)}
        reduceMotion={reduceMotion}
        animate={isRow}
      />
    ));

  return (
    <div className="signals-shell">
      <section
        className="signals bleed-bg"
        aria-labelledby="signals-title"
        id="who-its-for-signals"
      >
        <h2 id="signals-title" className="signals__title">
          Health doesn&rsquo;t start with a diagnosis
        </h2>

        <ul className="signals__row signals__row--1">{row(1)}</ul>
        <ul className="signals__row signals__row--2">{row(2)}</ul>
      </section>
    </div>
  );
}
