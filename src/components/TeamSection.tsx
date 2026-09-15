"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import useMediaQuery from "./useMediaQuery";

/**
 * "Meet our dream team" — Figma node 435-77.
 *
 * Five cards on a 317.69 pitch from x=109; the track is 1558.45 wide inside a
 * 1440 frame, so the last card hangs 227px off the right edge and the pill
 * above scrolls it. See globals.css for why there is exactly one step.
 *
 * Each photo carries its own Figma box and offset — the designer sized and
 * nudged them individually, so there is no shared crop.
 */
const CARD_W = 287.69;
const GAP = 30;
const PITCH = CARD_W + GAP;
const TRACK = 5 * CARD_W + 4 * GAP;
const GUTTER = 109;
const MAX_SCROLL = TRACK - (1440 - 2 * GUTTER);
const MAX_INDEX = Math.max(0, Math.round(MAX_SCROLL / PITCH));

type Member = {
  id: string;
  name: string;
  /** CEO / COO / CMO. Absent for the two whose Figma badge has no text yet. */
  role?: string;
  accent: string;
  dark: string;
  x: number;
  y: number;
  photo: string;
  /**
   * Image box within the card: width, height, left, top.
   *
   * Usually Figma's own numbers. Shilpa's and Joe's are solved instead: the
   * supplied assets are looser crops than the ones in the Figma file, so
   * fitting them to Figma's box rendered each person ~20-40% too small and
   * too low. These boxes reproduce the reference render's head height and
   * subject width (design/Another Team.png).
   */
  box: [number, number, number, number];
  bio: readonly string[];
};

const TEAM: readonly Member[] = [
  {
    id: "shilpa",
    name: "Shilpa Parikh, MBA",
    role: "CEO",
    accent: "var(--light-blue)",
    dark: "var(--turquoise)",
    x: 109,
    y: 180,
    photo: "/images/shilpa-parikh.png",
    box: [390.9, 390.9, -51.6, 15.2], // solved; Figma has [287, 318, -14, 65]
    bio: [
      "With 28+ years across biopharma, medical devices, and healthcare commercialization, Shilpa has launched 12+ brands, overseen $25B+ in product sales, & contributed to $41B+ in acquisitions and exits.",
      "She founded Sovhi to move healthcare beyond treating disease toward earlier prediction, prevention, and intervention.",
    ],
  },
  {
    id: "joe",
    name: "Joe Salazar",
    role: "COO",
    accent: "var(--orange)",
    dark: "var(--rust)",
    x: 426.69,
    y: 179,
    photo: "/images/joe-salazar.png",
    box: [430.1, 645.1, -71.2, 29.0], // solved; Figma has [332, 622, 10, 49]
    bio: [
      "With 27+ years across finance, operations, fundraising, and organizational growth, Joe has supported biotechnology companies including Genentech and Relypsa.",
      "He specializes in building the infrastructure that enables strategic partnerships, scalable growth, and successful exits.",
    ],
  },
  {
    id: "rupa",
    name: "Rupa Patel, MPH",
    role: "CMO",
    accent: "var(--teal)",
    dark: "var(--sovhi-green)",
    x: 744.38,
    y: 180,
    photo: "/images/rupa-patel.png",
    box: [286.69, 246, 1, 65],
    bio: [
      "With 20+ years across internal medicine, infectious diseases, public health, and implementation science, Rupa has worked with the CDC, WHO, and Washington University.",
      "She brings clinical rigor and implementation expertise to translating scientific evidence into practice across diverse healthcare settings.",
    ],
  },
  {
    id: "ts",
    name: "TS Harigopal",
    // TODO: Figma renders the badge shape with no text for this card.
    accent: "var(--teal)",
    dark: "var(--sovhi-green)",
    x: 1062.07,
    y: 179,
    photo: "/images/ts-harigopal.png",
    box: [341, 341, -53, 66],
    bio: [
      "With 30+ years in technology leadership across life sciences, TS brings expertise in AI, data, cloud platforms, cybersecurity, and enterprise systems.",
      "He has held senior roles at IGM Biosciences, Cytokinetics, Pharmacyclics/AbbVie, and Johnson & Johnson, with a focus on technology innovation in regulated environments.",
    ],
  },
  {
    id: "colin",
    name: "Colin Lacey",
    // TODO: Figma renders the badge shape with no text for this card.
    accent: "var(--light-blue)",
    dark: "var(--turquoise)",
    x: 1379.77,
    y: 181,
    photo: "/images/colin-lacey.png",
    box: [287, 319, 0, 35],
    bio: [
      "With extensive experience across product strategy, technology, & business transformation, Colin has led product, engineering, & operations across enterprise software, AI, clean energy, & professional services.",
      "He currently leads product strategy & development at Sovhi, following senior product roles at Alegion, MTPV Power, Unisys, HP, & Acer.",
    ],
  },
];

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 11 18" fill="none" aria-hidden="true" focusable="false">
      <path
        d={dir === "prev" ? "M9 1.5 2 9l7 7.5" : "M2 1.5 9 9l-7 7.5"}
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TeamSection() {
  const reduceMotion = useReducedMotion();
  /* Below this the track scrolls natively, so the transform is not used. */
  const isCarousel = useMediaQuery("(min-width: 1180px)");
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLUListElement | null>(null);

  const offset = Math.min(index * PITCH, MAX_SCROLL);

  /* Two mechanisms, one control. Above 1180 the track is transformed and the
     index drives it; below, the track is a native scroller (so touch users can
     swipe), and the same buttons nudge its scrollLeft instead. Without this
     the pill is visible on mobile but inert. */
  const step = useCallback(
    (dir: -1 | 1) => {
      if (isCarousel) {
        setIndex((i) => Math.min(MAX_INDEX, Math.max(0, i + dir)));
        return;
      }
      const el = trackRef.current;
      if (!el) return;
      const card = el.querySelector(".team__card");
      const by = card ? card.getBoundingClientRect().width + GAP : PITCH;
      el.scrollBy({ left: dir * by, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [isCarousel, reduceMotion],
  );

  return (
    <div className="team-shell">
      <section className="team" aria-labelledby="team-title" id="our-team">
        <h2 id="team-title" className="team__title">
          Meet our dream team
        </h2>

        <div className="team__nav">
          <button
            type="button"
            className="team__nav-btn"
            onClick={() => step(-1)}
            disabled={isCarousel && index === 0}
            aria-label="Previous team members"
          >
            <Chevron dir="prev" />
          </button>
          <button
            type="button"
            className="team__nav-btn"
            onClick={() => step(1)}
            disabled={isCarousel && index === MAX_INDEX}
            aria-label="Next team members"
          >
            <Chevron dir="next" />
          </button>
        </div>

        <motion.ul
          ref={trackRef}
          className="team__track"
          animate={{ x: isCarousel ? -offset : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.6, bounce: 0.16 }
          }
        >
          {TEAM.map((m) => {
            const [bw, bh, bx, by] = m.box;
            return (
              <li
                key={m.id}
                className="team__card"
                style={
                  {
                    left: `calc(${m.x} * var(--u))`,
                    top: `calc(${m.y} * var(--u))`,
                    "--team-accent": m.accent,
                    "--team-dark": m.dark,
                  } as React.CSSProperties
                }
              >
                <Image
                  className="team__photo"
                  src={m.photo}
                  alt={m.name}
                  width={Math.round(bw)}
                  height={Math.round(bh)}
                  style={{
                    width: `calc(${bw} * var(--u))`,
                    height: `calc(${bh} * var(--u))`,
                    left: `calc(${bx} * var(--u))`,
                    top: `calc(${by} * var(--u))`,
                  }}
                />
                <div className="team__panel" />
                <div className="team__badge" />
                {m.role ? <span className="team__badge-text">{m.role}</span> : null}
                <h3 className="team__name">{m.name}</h3>
                <div className="team__bio">
                  {m.bio.map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>
              </li>
            );
          })}
        </motion.ul>
      </section>
    </div>
  );
}
