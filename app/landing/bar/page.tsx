import type { Metadata } from 'next';
import { HeroSection, SocialProofSection, PillarsSection, CTASection } from '../../components/landing';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Controle de comanda para bares | PediAi',
  description: 'Divisão de conta automática e comanda individual. Gestão simplificada para bares.',
};

export default function BarLandingPage() {
  page_view({ segment: 'bar', url: '/landing/bar' });

  return (
    <main>
      <HeroSection />
      <SocialProofSection />
      <PillarsSection />
      <CTASection />
    </main>
  );
}
