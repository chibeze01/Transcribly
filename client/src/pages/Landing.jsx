import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import MockTerminal from "../components/landing/MockTerminal";
import AIIntegrationSection from "../components/landing/AIIntegrationSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <LandingNav />
      <HeroSection />
      <MockTerminal />
      <AIIntegrationSection />
      <LandingFooter />
    </div>
  );
}
