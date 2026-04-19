import type { Metadata } from 'next';
import { SocialProofSection, CTASection } from '../../components/landing';
import { BarLanding } from '../../components/landing/segments';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Controle de comanda para bares | PediAi',
  description: 'Divisão de conta automática e comanda individual. Gestão simplificada para bares.',
};

export default function BarLandingPage() {
  page_view({ segment: 'bar', url: '/landing/bar' });

  return (
    <main>
      <BarLanding />
      <SocialProofSection />
      <CTASection />
    </main>
  );
}
