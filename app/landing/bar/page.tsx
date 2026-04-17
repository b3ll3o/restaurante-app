import type { Metadata } from 'next';
import { HeroSection, PillarsSection, SocialProofSection, CTASection } from '../../components/landing';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Controle de comanda para bares | MenuLink',
  description: 'Divisão de conta automática e comanda individual. Gestão simplificada para bares.',
};

export default function BarLandingPage() {
  page_view({ segment: 'bar', url: '/landing/bar' });

  return (
    <main>
      <HeroSection segment="bar" />
      <SocialProofSection segment="bar" />
      <PillarsSection segment="bar" />
      <CTASection segment="bar" />
    </main>
  );
}