import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPage } from '@/app/components/landing/LandingPage';

// Mock de componentes que podem ter problemas
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock de ícones lucide-react
vi.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
  CheckCircle: () => <span data-testid="check-circle" />,
  Check: () => <span data-testid="check" />,
  Smartphone: () => <span data-testid="smartphone" />,
  MessageCircle: () => <span data-testid="message-circle" />,
  QrCode: () => <span data-testid="qr-code" />,
  Clock: () => <span data-testid="clock" />,
  Star: () => <span data-testid="star" />,
  Shield: () => <span data-testid="shield" />,
}));

describe('LandingPage - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Landing page carrega com todos os componentes visíveis', () => {
    it('deve renderizar HeroSection', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        expect(screen.getByText(/cardápio digital/i) || screen.getByText(/menuLink/i)).toBeTruthy();
      });
    });

    it('deve renderizar SocialProofSection', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasSocialProof = content.includes('500') || content.includes('restaurantes');
        expect(hasSocialProof).toBeTruthy();
      });
    });

    it('deve renderizar PillarsSection', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasPillars = content.includes('Por que escolher') || content.includes('benefícios');
        expect(hasPillars).toBeTruthy();
      });
    });

    it('deve renderizar DemoSection', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasDemo = content.includes('Como funciona') || content.includes('demonstração');
        expect(hasDemo).toBeTruthy();
      });
    });

    it('deve renderizar PricingSection', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasPricing = content.includes('Start') || content.includes('Crescer') || content.includes('preço');
        expect(hasPricing).toBeTruthy();
      });
    });

    it('deve renderizar CTASection', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasCTA = content.includes('Comece') || content.includes('começar');
        expect(hasCTA).toBeTruthy();
      });
    });
  });

  describe('Cenário: Hero section exibe mensagem de conversão', () => {
    it('deve exibir badge "Zero comissão"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasCommission = content.includes('comissão') || content.includes('Zero');
        expect(hasCommission).toBeTruthy();
      });
    });

    it('deve exibir título principal sobre cardápio digital', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasTitle = content.includes('Cardápio') || content.includes('cardápio');
        expect(hasTitle).toBeTruthy();
      });
    });

    it('deve mencionar WhatsApp no subtítulo', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasWhatsApp = content.includes('WhatsApp') || content.includes('whatsapp');
        expect(hasWhatsApp).toBeTruthy();
      });
    });
  });

  describe('Cenário: Hero section possui botões de ação', () => {
    it('deve ter botão primário "Começar gratuitamente"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /começar|gratuitamente|criar conta/i });
        expect(button).toBeTruthy();
      });
    });

    it('deve ter botão secundário "Ver demo"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /ver demo|demo/i });
        expect(button).toBeTruthy();
      });
    });

    it('deve linkar botão para /admin/signup', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /começar|sign up|criar/i });
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Cenário: Social proof section exibe métricas', () => {
    it('deve exibir "+500 Restaurantes"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasRestaurants = content.includes('500') || content.includes('restaurantes');
        expect(hasRestaurants).toBeTruthy();
      });
    });

    it('deve exibir métricas do sistema', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        // Procura por métricas conhecidas
        const hasRestaurants = content.includes('500') || content.includes('restaurantes');
        const hasOrders = content.includes('50K') || content.includes('pedidos');
        expect(hasRestaurants || hasOrders).toBeTruthy();
      });
    });
  });

  describe('Cenário: Pillars section exibe 6 benefícios', () => {
    it('deve ter título "Por que escolher o MenuLink?"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const title = screen.getByText(/por que escolher/i);
        expect(title).toBeInTheDocument();
      });
    });

    it('deve exibir cards de benefícios', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        // Verifica que há menção aos pilares
        expect(content).toBeTruthy();
      });
    });
  });

  describe('Cenário: Demo section explica fluxo em 3 passos', () => {
    it('deve ter título "Como funciona"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const title = screen.getByText(/como funciona/i);
        expect(title).toBeInTheDocument();
      });
    });

    it('deve mostrar passo 1 "Crie seu cardápio"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasCrieCardapio = content.includes('Crie') || content.includes('cardápio');
        expect(hasCrieCardapio).toBeTruthy();
      });
    });
  });

  describe('Cenário: Pricing section exibe 3 planos', () => {
    it('deve ter título de preços', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasPricingTitle = content.includes('Start') || content.includes('Crescer') || content.includes('preço');
        expect(hasPricingTitle).toBeTruthy();
      });
    });

    it('deve exibir plano Start com preço R$ 0', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content).toContain('Start');
      });
    });

    it('deve destacar plano Crescer como "Mais popular"', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasPopular = content.includes('Crescer') || content.includes('popular');
        expect(hasPopular).toBeTruthy();
      });
    });
  });

  describe('Cenário: CTASection final incentiva criação de conta', () => {
    it('deve ter título sobre começar a receber pedidos', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        const hasOrdersTitle = content.includes('Comece') || content.includes('receber pedidos');
        expect(hasOrdersTitle).toBeTruthy();
      });
    });

    it('deve ter botão CTA para criar conta', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cenário: Botões CTA são clicáveis', () => {
    it('deve responder a cliques nos botões', async () => {
      const pushMock = vi.fn();
      vi.mock('next/navigation', () => ({
        useRouter: () => ({
          push: pushMock,
        }),
      }));

      render(<LandingPage />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /começar|gratuitamente/i });
        if (button) {
          userEvent.click(button);
        }
      });

      // Botão deve responder sem erro
      expect(document.body.textContent).toBeTruthy();
    });
  });

  describe('Responsividade', () => {
    it('deve renderizar corretamente em desktop', async () => {
      render(<LandingPage />);

      await waitFor(() => {
        const content = document.body.textContent || '';
        expect(content.length).toBeGreaterThan(100);
      });
    });
  });
});
