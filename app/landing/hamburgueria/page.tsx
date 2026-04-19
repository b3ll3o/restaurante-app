import type { Metadata } from 'next';
import { SocialProofSection, CTASection } from '../../components/landing';
import { HamburgueriaLanding } from '../../components/landing/segments';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Cardápio visual para hamburguerias | PediAi',
  description: 'Crie cardápio visual com QR code para pedidos direto na mesa. Sem comissão, sem complicações.',
};

export default function HamburgueriaLandingPage() {
  page_view({ segment: 'hamburgueria', url: '/landing/hamburgueria' });

  return (
    <main>
      <HamburgueriaLanding />
      <SocialProofSection />
      <CTASection />
    </main>
  );
}
