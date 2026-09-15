import ThesisHero from "@/components/ThesisHero";
import PathwaySection from "@/components/PathwaySection";
import ProblemThesisSection from "@/components/ProblemThesisSection";
import StatBand from "@/components/StatBand";
import PlatformSection from "@/components/PlatformSection";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import SignalsSection from "@/components/SignalsSection";
import AudiencesSection from "@/components/AudiencesSection";
import DepthSection from "@/components/DepthSection";
import TeamSection from "@/components/TeamSection";
import WaitlistSection from "@/components/WaitlistSection";
import ClosingTagline from "@/components/ClosingTagline";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <main className="page">
      <ThesisHero />
      <PathwaySection />
      <ProblemThesisSection />
      <StatBand />
      <PlatformSection />
      <ClosingTagline />
      <Hero />
      <StatsSection />
      <HowItWorks />
      <SignalsSection />
      <AudiencesSection />
      <DepthSection />
      <TeamSection />
      <WaitlistSection />
      <SiteFooter />
    </main>
  );
}
