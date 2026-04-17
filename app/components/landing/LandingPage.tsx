import { HeroSection } from "./HeroSection";
import { PillarsSection } from "./PillarsSection";
import { SocialProofSection } from "./SocialProofSection";
import { DemoSection } from "./DemoSection";
import { PricingSection } from "./PricingSection";
import { CTASection } from "./CTASection";

/**
 * LandingPage - Componente principal da landing page
 * Compõe todas as seções da página de alta conversão
 */
export function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SocialProofSection />
      <PillarsSection />
      <DemoSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
