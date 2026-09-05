"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const REVEAL = 0.6;
/** Columns arrive left to right rather than all at once. */
const STAGGER = 0.12;

type Member = {
  tone: "blue" | "orange" | "teal";
  /** Column 2 puts the bio above the photo, so the grid zigzags. */
  bioFirst?: boolean;
  name: string;
  role: string;
  photo: string;
  alt: string;
  bio: string[];
};

const members: Member[] = [
  {
    tone: "blue",
    name: "Shilpa Parikh, MBA",
    role: "CEO",
    photo: "/images/team-shilpa.webp",
    alt: "Shilpa Parikh",
    bio: [
      "With 28+ years across biopharma, medical devices, and healthcare commercialization, Shilpa has launched 12+ brands, overseen $25B+ in product sales, & contributed to $41B+ in acquisitions and exits.",
      "She founded Sovhi to move healthcare beyond treating disease toward earlier prediction, prevention, and intervention.",
    ],
  },
  {
    tone: "orange",
    bioFirst: true,
    name: "Joe Salazar",
    role: "COO",
    photo: "/images/team-joe.webp",
    alt: "Joe Salazar",
    bio: [
      "With 27+ years across finance, operations, fundraising, and organizational growth, Joe has supported biotechnology companies including Genentech and Relypsa. He specializes in building the infrastructure that enables strategic partnerships, scalable growth, and successful exits.",
    ],
  },
  {
    tone: "teal",
    name: "Rupa Patel, MPH",
    role: "CMO",
    photo: "/images/team-rupa.webp",
    alt: "Rupa Patel",
    bio: [
      "With 20+ years across internal medicine, infectious diseases, public health, and implementation science, Rupa has worked with the CDC, WHO, and Washington University. She brings clinical rigor and implementation expertise to translating scientific evidence into practice across diverse healthcare settings.",
    ],
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  // With reduced motion the reveal is skipped outright: everything renders in
  // its final state rather than animating to it.
  const reveal = (index: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
          transition: { duration: REVEAL, delay: index * STAGGER, ease: EASE },
        };

  return (
    <section className="team" id="our-team" ref={sectionRef}>
      {/* The reveal's hidden state ships in the server HTML, so without
          scripting the whole section would never become visible. */}
      <noscript>
        <style>{
          ".team-intro,.team-member{opacity:1 !important;transform:none !important}"
        }</style>
      </noscript>

      <motion.div className="team-intro" {...reveal(0)}>
        <h2>Meet our dream team</h2>
        <p>
          The science could tell us what chronic stress does to the body, what
          was missing was a way to measure what was happening before the damage
          showed up
        </p>
      </motion.div>

      <ul className="team-grid">
        {members.map((member, index) => (
          <motion.li
            className="team-member"
            key={member.name}
            data-tone={member.tone}
            data-bio-first={member.bioFirst ? "true" : undefined}
            {...reveal(index + 1)}
          >
            <div className="team-photo">
              <Image
                src={member.photo}
                alt={member.alt}
                fill
                sizes="(max-width: 900px) 100vw, 332px"
              />
              <p className="team-role">{member.role}</p>
            </div>

            <div className="team-bio">
              <h3>{member.name}</h3>
              {member.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
