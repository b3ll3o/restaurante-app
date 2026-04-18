import type { Metadata } from 'next';
import { HeroSection, PillarsSection, SocialProofSection, CTASection } from '../../components/landing';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Cardápio visual para hamburguerias | MenuLink',
  description: 'Crie cardápio visual com QR code para pedidos direto na mesa. Sem comissão, sem complicações.',
};

export default function HamburgueriaLandingPage() {
  page_view({ segment: 'hamburgueria', url: '/landing/hamburgueria' });

  return (
    <main>
      <HeroSection />
      <SocialProofSection />
      <PillarsSection />
      <CTASection />
    </main>
  );
}