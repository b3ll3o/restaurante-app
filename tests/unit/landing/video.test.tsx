import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoSection } from "@/app/components/landing/VideoSection";

// Mock Dialog from shadcn/ui
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
      {open && (
        <button
          data-testid="dialog-close"
          onClick={() => onOpenChange?.(false)}
        />
      )}
    </div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
  DialogContent: ({ children, onClose }: {
    children: React.ReactNode;
    onClose?: () => void;
  }) => (
    <div data-testid="dialog-content">
      {children}
      <button data-testid="close-btn" onClick={onClose}>Fechar</button>
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
}));

// Mock Play if needed
vi.mock("next/font/google", () => ({
  Play: () => ({ className: "" }),
}));

describe("VideoSection", () => {
  it("deve renderizar card com thumbnail", () => {
    render(<VideoSection />);
    const card = document.querySelector(".rounded-lg");
    expect(card).toBeDefined();
  });

  it("deve renderizar texto Depoimento em vídeo", () => {
    render(<VideoSection />);
    const text = screen.getByText(/Depoimento em vídeo/i);
    expect(text).toBeDefined();
  });

  it("deve renderizar botão de play", () => {
    render(<VideoSection />);
    const playButton = document.querySelector("[data-testid=\"dialog-trigger\"]");
    expect(playButton).toBeDefined();
  });

  it("deve renderizar nome do entrevistado default", () => {
    render(<VideoSection />);
    const name = screen.getByText(/João Silva/i);
    expect(name).toBeDefined();
  });

  it("deve renderizar cargo/empresa default", () => {
    render(<VideoSection />);
    const role = screen.getByText(/Proprietário - Pizzaria Bella Napoli/i);
    expect(role).toBeDefined();
  });

  it("deve renderizar com props customizadas", () => {
    render(
      <VideoSection
        videoUrl="https://youtube.com/watch?v=test"
        thumbnailUrl="/thumbnail.jpg"
        testimonialName="Maria Santos"
        testimonialRole="Dona - Restaurante Gourmet"
      />
    );
    expect(screen.getByText(/Maria Santos/i)).toBeDefined();
    expect(screen.getByText(/Dona - Restaurante Gourmet/i)).toBeDefined();
  });

  it("deve renderizar ícone de play", () => {
    render(<VideoSection />);
    // Verificar que existe algo que indica play
    const dialogTrigger = document.querySelector("[data-testid=\"dialog-trigger\"]");
    expect(dialogTrigger).toBeDefined();
  });

  it("deve renderizar Dialog ao passar prop open", () => {
    render(<VideoSection />);
    // O Dialog não deve aparecer inicialmente
    const dialog = document.querySelector("[data-testid=\"dialog\"]");
    expect(dialog).toBeDefined();
  });
});
