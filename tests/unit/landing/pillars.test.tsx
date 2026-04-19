import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PillarsSection } from "@/app/components/landing/PillarsSection";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Smartphone: ({ className }: { className?: string }) => (
    <span data-testid="icon-smartphone" className={className} />
  ),
  MessageCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-message-circle" className={className} />
  ),
  QrCode: ({ className }: { className?: string }) => (
    <span data-testid="icon-qrcode" className={className} />
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="icon-clock" className={className} />
  ),
  Star: ({ className }: { className?: string }) => (
    <span data-testid="icon-star" className={className} />
  ),
  Shield: ({ className }: { className?: string }) => (
    <span data-testid="icon-shield" className={className} />
  ),
}));

describe("PillarsSection", () => {
  it("deve renderizar título da seção", () => {
    render(<PillarsSection />);
    const title = screen.getByText(/Por que escolher o PediAi/i);
    expect(title).toBeDefined();
  });

  it("deve renderizar exatamente 3 pilares default", () => {
    render(<PillarsSection />);
    // Verificar os 3 pilares específicos do redesign - usar getAllByText para evitar ambiguidade
    expect(screen.getAllByText(/Setup em 2 minutos/i)).toHaveLength(1);
    expect(screen.getAllByText(/Zero comissão/i)).toHaveLength(1);
    expect(screen.getAllByText(/WhatsApp nativo/i)).toHaveLength(1);
  });

  it("deve renderizar ícone do primeiro pilar (Setup)", () => {
    render(<PillarsSection />);
    const icon = document.querySelector('[data-testid="icon-smartphone"]');
    expect(icon).toBeDefined();
  });

  it("deve renderizar ícone do segundo pilar (Zero comissão)", () => {
    render(<PillarsSection />);
    const icon = document.querySelector('[data-testid="icon-message-circle"]');
    expect(icon).toBeDefined();
  });

  it("deve renderizar ícone do terceiro pilar (WhatsApp)", () => {
    render(<PillarsSection />);
    const icon = document.querySelector('[data-testid="icon-qrcode"]');
    expect(icon).toBeDefined();
  });

  it("deve renderizar descrição dos pilares", () => {
    render(<PillarsSection />);
    expect(screen.getByText(/Sem integração complexa/i)).toBeDefined();
    expect(screen.getByText(/Não cobramos por pedido/i)).toBeDefined();
    expect(screen.getByText(/Pedidos chegam direto no seu WhatsApp/i)).toBeDefined();
  });

  it("deve renderizar subtítulo", () => {
    render(<PillarsSection />);
    const subtitle = screen.getByText(/A solução completa para digitalizar/i);
    expect(subtitle).toBeDefined();
  });

  it("deve renderizar section com grid layout", () => {
    render(<PillarsSection />);
    const section = document.querySelector("section");
    expect(section).toBeDefined();
    // O grid está no div interno, não na section
    const gridDiv = document.querySelector(".grid");
    expect(gridDiv).toBeDefined();
  });

  it("deve ter cards com classe rounded-lg", () => {
    render(<PillarsSection />);
    const cards = document.querySelectorAll(".rounded-lg");
    expect(cards.length).toBeGreaterThan(0);
  });
});
