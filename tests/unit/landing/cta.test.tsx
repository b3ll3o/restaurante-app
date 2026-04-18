import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTASection } from "@/app/components/landing/CTASection";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ArrowRight: ({ className }: { className?: string }) => (
    <span data-testid="arrow-right" className={className} />
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="clock" className={className} />
  ),
  Zap: ({ className }: { className?: string }) => (
    <span data-testid="zap" className={className} />
  ),
}));

describe("CTASection", () => {
  it("deve renderizar título principal", () => {
    render(<CTASection />);
    const title = screen.getByText(/Comece a receber pedidos hoje mesmo/i);
    expect(title).toBeDefined();
  });

  it("deve renderizar subtítulo", () => {
    render(<CTASection />);
    const subtitle = screen.getByText(/Configure sua conta em menos de 2 minutos/i);
    expect(subtitle).toBeDefined();
  });

  it("deve renderizar botão CTA com texto Teste grátis 14 dias", () => {
    render(<CTASection />);
    // CA-LP-09: CTA final deve conter "Teste Grátis 14 Dias"
    const button = screen.getByRole("button", { name: /Teste grátis 14 dias/i });
    expect(button).toBeDefined();
  });

  it("deve renderizar elemento de urgência (teste gratuito)", () => {
    render(<CTASection />);
    const urgency = screen.getByText(/Teste gratuito por 14 dias/i);
    expect(urgency).toBeDefined();
  });

  it("deve renderizar badges de confiança", () => {
    render(<CTASection />);
    expect(screen.getByText(/Sem compromisso/i)).toBeDefined();
    expect(screen.getByText(/Cancele quando quiser/i)).toBeDefined();
  });

  it("deve renderizar formulário de lead capture", () => {
    render(<CTASection />);
    // REQ-LP-03: Formulário deve capturar nome, email, WhatsApp
    expect(screen.getByPlaceholderText(/Seu nome completo/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/seu@email\.com/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/\(11\) 99999-9999/i)).toBeDefined();
  });

  it("deve renderizar botão de envio do formulário", () => {
    render(<CTASection />);
    const submitButton = screen.getByRole("button", { name: /Teste grátis 14 dias/i });
    expect(submitButton).toBeDefined();
  });

  it("deve renderizar section com background primary", () => {
    render(<CTASection />);
    const section = document.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.className).toContain("bg-primary");
  });

  it("deve renderizar ícone de relógio para urgência", () => {
    render(<CTASection />);
    const clockIcon = document.querySelector("[data-testid=\"clock\"]");
    expect(clockIcon).toBeDefined();
  });

  it("deve renderizar elemento de urgência adicional", () => {
    render(<CTASection />);
    const urgencyElement = screen.getByText(/Ative hoje e ganhe 1 mês grátis/i);
    expect(urgencyElement).toBeDefined();
  });
});
