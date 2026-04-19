import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/app/components/landing/HeroSection";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ArrowRight: ({ className }: { className?: string }) => (
    <span data-testid="arrow-right" className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="check-circle" className={className} />
  ),
}));

describe("HeroSection", () => {
  it("deve renderizar headline principal (primeira linha)", () => {
    render(<HeroSection />);
    const headline = screen.getByText(/Aumente suas vendas diretas/i);
    expect(headline).toBeDefined();
  });

  it("deve renderizar headline segunda linha", () => {
    render(<HeroSection />);
    const headlineSecondLine = screen.getByText(/sem pagar comissão/i);
    expect(headlineSecondLine).toBeDefined();
  });

  it("deve renderizar badge zero comissão", () => {
    render(<HeroSection />);
    const badge = screen.getByText(/Zero comissão/i);
    expect(badge).toBeDefined();
  });

  it("deve renderizar botão CTA principal", () => {
    render(<HeroSection />);
    const ctaButton = screen.getByRole("link", { name: /Começar gratuitamente/i });
    expect(ctaButton).toBeDefined();
    expect(ctaButton.getAttribute("href")).toBe("/admin/signup");
  });

  it("deve renderizar botão ver demo", () => {
    render(<HeroSection />);
    const demoButton = screen.getByRole("link", { name: /Ver demo/i });
    expect(demoButton).toBeDefined();
    expect(demoButton.getAttribute("href")).toBe("#demo");
  });

  it("deve renderizar social proof mini", () => {
    render(<HeroSection />);
    const socialProof = screen.getByText(/\+500 restaurantes/i);
    expect(socialProof).toBeDefined();
  });

  it("deve renderizar sem props (conteúdo default)", () => {
    render(<HeroSection />);
    const headline = screen.getByText(/Aumente suas vendas diretas/i);
    expect(headline).toBeDefined();
  });

  it("deve renderizar subheadline", () => {
    render(<HeroSection />);
    const subheadline = screen.getByText(/Crie seu cardápio digital em minutos/i);
    expect(subheadline).toBeDefined();
  });

  it("deve ter estrutura de seção com background gradient", () => {
    render(<HeroSection />);
    const section = document.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.className).toContain("bg-gradient-to-b");
  });
});
