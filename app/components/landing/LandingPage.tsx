import { HeroSection } from "./HeroSection";
import { PillarsSection } from "./PillarsSection";
import { SocialProofSection } from "./SocialProofSection";
import { VideoSection } from "./VideoSection";
import { DemoSection } from "./DemoSection";
import { PricingSection } from "./PricingSection";
import { CTASection } from "./CTASection";

/**
 * LandingPage - Componente principal da landing page
 * Compõe todas as seções da página de alta conversão
 * Ordem de renderização otimizada para conversão:
 * 1. HeroSection - Proposta de valor imediata
 * 2. SocialProofSection - Credibilidade
 * 3. PillarsSection - Benefícios
 * 4. VideoSection - Depoimento em vídeo (REQ-LP-05)
 * 5. DemoSection - Como funciona
 * 6. PricingSection - Planos
 * 7. CTASection - CTA final com formulário
 */
export function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SocialProofSection />
      <PillarsSection />
      <VideoSection />
      <DemoSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}
