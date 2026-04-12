import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import MockTerminal from "../components/landing/MockTerminal";
import FeaturesSection from "../components/landing/FeaturesSection";
import AIIntegrationSection from "../components/landing/AIIntegrationSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-mono text-white">
      <LandingNav />
      <main>
        <HeroSection />
        <MockTerminal />
        <FeaturesSection />
        <AIIntegrationSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
