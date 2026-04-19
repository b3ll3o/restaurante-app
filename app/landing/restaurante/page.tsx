import type { Metadata } from 'next';
import { SocialProofSection, CTASection } from '../../components/landing';
import { RestauranteLanding } from '../../components/landing/segments';
import { page_view } from '../../../lib/analytics';

export const metadata: Metadata = {
  title: 'Reservas online e carta digital para restaurantes | PediAi',
  description: 'Aguarde reservas online, gerencie carta de vinhos digital e melhore a experiência dos clientes.',
};

export default function RestauranteLandingPage() {
  page_view({ segment: 'restaurante', url: '/landing/restaurante' });

  return (
    <main>
      <RestauranteLanding />
      <SocialProofSection />
      <CTASection />
    </main>
  );
}
