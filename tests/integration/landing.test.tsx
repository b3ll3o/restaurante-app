import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/app/components/landing/HeroSection";
import { PillarsSection } from "@/app/components/landing/PillarsSection";
import { SocialProofSection } from "@/app/components/landing/SocialProofSection";
import { CTASection } from "@/app/components/landing/CTASection";
import { PricingSection } from "@/app/components/landing/PricingSection";

// Mocks must be at top level
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

describe("Landing Page Integration", () => {
  it("deve renderizar hero section com proposta de valor", () => {
    render(<HeroSection />);
    const section = document.querySelector("section");
    expect(section).toBeDefined();
    const headline = document.body.textContent;
    expect(headline).toMatch(/zero comissão/i);
  });

  it("deve renderizar subheadline correto", () => {
    render(<HeroSection />);
    const subheadline = screen.getByText(/Crie seu cardápio digital/i);
    expect(subheadline).toBeDefined();
  });

  it("deve renderizar três pilares", () => {
    render(<PillarsSection />);
    expect(screen.getByText(/Setup em 2 minutos/i)).toBeDefined();
    expect(screen.getByText(/Zero comissão/i)).toBeDefined();
    expect(screen.getByText(/WhatsApp/i)).toBeDefined();
  });

  it("deve renderizar contador de restaurantes", () => {
    render(<SocialProofSection />);
    // O contador inicia em 0 mas depois anima para 2500
    // Verificar que o elemento existe
    expect(screen.getByText(/Restaurantes/i)).toBeDefined();
  });

  it("deve renderizar três planos com preços", () => {
    render(<PricingSection />);
    expect(screen.getByText(/Start/i)).toBeDefined();
    expect(screen.getByText(/Crescer/i)).toBeDefined();
    expect(screen.getByText(/Escalar/i)).toBeDefined();
    expect(screen.getByText(/R\$ 0/i)).toBeDefined();
    expect(screen.getByText(/R\$ 49/i)).toBeDefined();
    expect(screen.getByText(/R\$ 149/i)).toBeDefined();
  });

  it("deve renderizar CTA com botão de teste grátis", () => {
    render(<CTASection />);
    const ctaButton = screen.getByRole("button", { name: /Teste grátis 14 dias/i });
    expect(ctaButton).toBeDefined();
  });

  it("deve renderizar elemento de urgência", () => {
    render(<CTASection />);
    const urgency = screen.getByText(/Ative hoje e ganhe 1 mês grátis/i);
    expect(urgency).toBeDefined();
  });
});
