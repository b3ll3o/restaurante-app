import type { Metadata } from 'next';
import { HeroSection, PillarsSection, SocialProofSection, CTASection } from '../../components/landing';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Cardápio digital para pizzarias | MenuLink',
  description: 'Digitalize sua pizzaria com cardápio online, integração com iFood e pedidos via WhatsApp sem pagar comissão.',
};

export default function PizzariaLandingPage() {
  page_view({ segment: 'pizzaria', url: '/landing/pizzaria' });

  return (
    <main>
      <HeroSection />
      <SocialProofSection />
      <PillarsSection />
      <CTASection />
    </main>
  );
}