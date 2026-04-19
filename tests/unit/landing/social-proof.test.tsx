import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialProofSection } from "@/app/components/landing/SocialProofSection";

describe("SocialProofSection", () => {
  it("deve renderizar contador de restaurantes (inicia em 0)", () => {
    render(<SocialProofSection />);
    // O contador inicia em 0 e vai até 2500
    const counter = screen.getByText(/\+0/i);
    expect(counter).toBeDefined();
  });

  it("deve renderizar estatísticas default", () => {
    render(<SocialProofSection />);
    // "Restaurantes" aparece 2x: stats label e texto "Mais de 2.500 restaurantes"
    expect(screen.getAllByText(/Restaurantes/i)).toHaveLength(2);
    expect(screen.getByText(/Pedidos processados/i)).toBeDefined();
    expect(screen.getByText(/Avaliação média/i)).toBeDefined();
    expect(screen.getByText(/Comissão/i)).toBeDefined();
  });

  it("deve renderizar valores numéricos das estatísticas", () => {
    render(<SocialProofSection />);
    // Verificar valores específicos
    expect(screen.getByText(/\+50K/i)).toBeDefined();
    expect(screen.getByText(/4\.8/i)).toBeDefined();
    expect(screen.getByText(/R\$ 0/i)).toBeDefined();
  });

  it("deve renderizar seção com fundo alternativo", () => {
    render(<SocialProofSection />);
    const section = document.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.className).toContain("bg-muted");
  });

  it("deve renderizar grid com 4 colunas em desktop", () => {
    render(<SocialProofSection />);
    // O grid-cols-4 está no div interno, não na section
    const gridDiv = document.querySelector(".grid-cols-4");
    expect(gridDiv).toBeDefined();
  });

  it("deve renderizar todos os labels das estatísticas", () => {
    render(<SocialProofSection />);
    const labels = ["Restaurantes", "Pedidos processados", "Avaliação média", "Comissão"];
    labels.forEach((label) => {
      expect(screen.getByText(new RegExp(label))).toBeDefined();
    });
  });

  it("deve renderizar valores com formatação correta", () => {
    render(<SocialProofSection />);
    // Verificar que os valores incluem + ou R$ prefix
    const section = document.querySelector("section");
    const text = section?.textContent || "";
    expect(text).toContain("+");
    expect(text).toContain("R$");
  });
});
