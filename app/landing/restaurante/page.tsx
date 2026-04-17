import type { Metadata } from 'next';
import { HeroSection, PillarsSection, SocialProofSection, CTASection } from '../../components/landing';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Reservas online e carta digital para restaurantes | MenuLink',
  description: 'Aguarde reservas online, gerencie carta de vinhos digital e melhore a experiência dos clientes.',
};

export default function RestauranteLandingPage() {
  page_view({ segment: 'restaurante', url: '/landing/restaurante' });

  return (
    <main>
      <HeroSection segment="restaurante" />
      <SocialProofSection segment="restaurante" />
      <PillarsSection segment="restaurante" />
      <CTASection segment="restaurante" />
    </main>
  );
}