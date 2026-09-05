"use client";

import Image from "next/image";
import { useState } from "react";

import StatsSection from "@/components/StatsSection";
import TeamSection from "@/components/TeamSection";

const navigation = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Who it's for", href: "#who-its-for" },
  { label: "Our team", href: "#our-team" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Sovhi Health home">
            <Image src="/logo.svg" alt="" width={30} height={30} priority />
            <span>Sovhi Health</span>
          </a>

          <div
            className={`nav-links ${menuOpen ? "is-open" : ""}`}
            id="main-navigation"
          >
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a className="nav-cta" href="#baseline" onClick={() => setMenuOpen(false)}>
              Find your baseline
            </a>
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <Image
          className="hero-image"
          src="/images/hero.webp"
          alt="Friends enjoying a sunny picnic in a park"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">A clearer path to better health</p>
          <h1>Restore what&apos;s already yours</h1>
          <p className="hero-subtext">
            Restore your own steadiness with intelligence trained on your
            history rather than a population average, and guidance that
            adapts as you do
          </p>
          <a className="hero-cta" href="#baseline" id="baseline">
            Find Your Baseline
          </a>
        </div>
      </section>

      <StatsSection />

      <section className="story-section">
        <div className="story-content">
          <h2>Your body tells a complete story</h2>
          <div className="story-icon">
            <Image src="/logo.svg" alt="" width={56} height={56} />
          </div>
          <p>
            When traditional answers fall short, your intuition becomes your
            guide. Our root-cause approach combines individualized support
            and functional testing to reveal the path to healing your body
            has been showing all along.
          </p>
          <a className="story-cta" href="#how-it-works">
            Discover the Sovhi Method
          </a>
        </div>
        <div className="story-image">
          <Image
            src="/images/Sovhi Health Website Stock.webp"
            alt="Woman relaxing on a porch with a cup of tea"
            fill
            sizes="(max-width: 720px) 100vw, 50vw"
          />
        </div>
      </section>

      <section id="how-it-works" className="page-section" />
      <section id="who-its-for" className="page-section" />

      <TeamSection />
    </main>
  );
}
