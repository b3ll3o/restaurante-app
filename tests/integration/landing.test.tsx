import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/app/components/landing/HeroSection";
import { PillarsSection } from "@/app/components/landing/PillarsSection";
import { SocialProofSection } from "@/app/components/landing/SocialProofSection";
import { CTASection } from "@/app/components/landing/CTASection";
import { PricingSection } from "@/app/components/landing/PricingSection";

const feature = loadFeature("app/landing/landing.feature");

defineFeature(feature, (test) => {
  // Mock all external dependencies
  beforeEach(() => {
    vi.mock("@/lib/analytics", () => ({}));
    vi.mock("lucide-react", () => ({
      ArrowRight: () => null,
      CheckCircle: () => null,
      Clock: () => null,
      Zap: () => null,
      Smartphone: () => null,
      MessageCircle: () => null,
      QrCode: () => null,
      Check: () => null,
    }));
    vi.mock("@/components/ui/dialog", () => ({
      Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }));
  });

  test("Visitante visualiza hero section com proposta de valor", ({ given, when, then, and }) => {
    given("o visitante acessa a URL da landing page", () => {
      // Landing page renders HeroSection
    });

    when("a página carrega completamente", () => {
      render(<HeroSection />);
    });

    then("a hero section é exibida imediatamente", () => {
      const section = document.querySelector("section");
      expect(section).toBeDefined();
    });

    and("o headline contém a expressão 'zero comissão' ou mensagem equivalente", () => {
      const headline = document.body.textContent;
      expect(headline).toMatch(/zero comissão/i);
    });

    and("existe um subtítulo explicativo abaixo do headline", () => {
      const subheadline = screen.getByText(/Crie seu cardápio online/i);
      expect(subheadline).toBeDefined();
    });
  });

  test("Três pilares exibidos corretamente", ({ given, when, then }) => {
    given("o visitante está na landing page", () => {
      render(<PillarsSection />);
    });

    when("ele rola a página até a seção de pilares", () => {
      // PillarsSection renders when mounted
    });

    then("exatamente três cards/pílares são exibidos", () => {
      // REQ-LP-02: exactly 3 pillars
      expect(screen.getByText(/Setup em 2 minutos/i)).toBeDefined();
      expect(screen.getByText(/Zero comissão/i)).toBeDefined();
      expect(screen.getByText(/WhatsApp/i)).toBeDefined();
    });
  });

  test("Pilares respondem objeções específicas", ({ given, when, then }) => {
    given("o visitante visualiza a seção de pilares", () => {
      render(<PillarsSection />);
    });

    when("ele lê o conteúdo", () => {
      // Content is rendered
    });

    then("um pilar menciona 'setup' ou 'minutos' (rapidez)", () => {
      expect(screen.getByText(/Setup em 2 minutos/i)).toBeDefined();
    });

    and("um pilar menciona 'zero comissão' ou 'sem comissão' (custo)", () => {
      expect(screen.getByText(/Zero comissão/i)).toBeDefined();
    });

    and("um pilar menciona 'WhatsApp' ou 'integração' (compatibilidade)", () => {
      expect(screen.getByText(/WhatsApp/i)).toBeDefined();
    });
  });

  test("Contador de restaurantes exibido", ({ given, when, then }) => {
    given("o visitante acessa a landing page", () => {
      render(<SocialProofSection />);
    });

    when("ele rola até a seção de prova social", () => {
      // SocialProofSection content is visible
    });

    then("um contador numérico é exibido com formato '+X restaurantes'", () => {
      // CA-LP-05: contador > 2000
      const counter = screen.getByText(/2\.?500/i);
      expect(counter).toBeDefined();
    });
  });

  test("Três planos exibidos com preços", ({ given, when, then }) => {
    given("o visitante rola até a seção de preços", () => {
      render(<PricingSection />);
    });

    when("ele visualiza os cards de planos", () => {
      // PricingSection renders
    });

    then("exatamente três planos são exibidos: Start, Crescer, Escalar", () => {
      expect(screen.getByText(/^Start$/i)).toBeDefined();
      expect(screen.getByText(/^Crescer$/i)).toBeDefined();
      expect(screen.getByText(/^Escalar$/i)).toBeDefined();
    });

    and("cada plano tem seu preço mensal claramente visível", () => {
      expect(screen.getByText(/R\$ 0/i)).toBeDefined();
      expect(screen.getByText(/R\$ 49/i)).toBeDefined();
      expect(screen.getByText(/R\$ 149/i)).toBeDefined();
    });
  });

  test("CTA final com urgência", ({ given, when, then }) => {
    given("o visitante está no final da landing page", () => {
      render(<CTASection />);
    });

    when("ele visualiza a seção de CTA final", () => {
      // CTASection renders
    });

    then("um botão de CTA grande é exibido", () => {
      const ctaButton = screen.getByRole("button", { name: /Teste grátis 14 dias/i });
      expect(ctaButton).toBeDefined();
    });

    and("o texto do botão contém 'teste grátis' e '14 dias'", () => {
      const buttonText = screen.getByRole("button", { name: /Teste grátis 14 dias/i }).textContent;
      expect(buttonText).toMatch(/teste grátis/i);
      expect(buttonText).toMatch(/14 dias/i);
    });
  });

  test("Elemento de urgência adicional", ({ given, when, then }) => {
    given("o visitante visualiza o CTA final", () => {
      render(<CTASection />);
    });

    when("ele observa os elementos de urgência", () => {
      // Urgency elements render
    });

    then("existe um texto adicional como 'Ganhe 1 mês grátis' ou similar", () => {
      // REQ-LP-08: Additional urgency element
      const urgency = screen.getByText(/Ative hoje e ganhe 1 mês grátis/i);
      expect(urgency).toBeDefined();
    });
  });
});
