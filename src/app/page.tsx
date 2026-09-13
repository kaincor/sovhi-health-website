import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import SignalsSection from "@/components/SignalsSection";
import AudiencesSection from "@/components/AudiencesSection";

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <StatsSection />
      <HowItWorks />
      <SignalsSection />
      <AudiencesSection />
    </main>
  );
}
