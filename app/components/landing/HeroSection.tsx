"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

/**
 * HeroSection - Seção principal da Landing Page
 * Destaca o proposition unique de valor: zero comissão
 * Headline unificado: "Aumente suas vendas diretas sem pagar comissão"
 */
export function HeroSection() {
  // Analytics tracking para CTA clicks
  // Note: In production, connect to analytics.page_view()
  const handleCTAClick = () => {
    // Analytics tracking would go here
    // analytics.page_view({ segment: 'landing', url: '/', cta_id: 'hero-cta' })
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge - "Zero comissão" */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle className="h-4 w-4" />
            <span>Zero comissão nos seus pedidos</span>
          </div>

          {/* Headline - unificado conforme REQ-LP-01 */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Aumente suas vendas diretas
            <span className="mt-2 block text-primary">sem pagar comissão</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Crie seu cardápio digital em minutos e receba pedidos direto no WhatsApp.
            Sem taxas escondidas, sem complicações.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              asChild
              onClick={() => handleCTAClick()}
            >
              <a href="/admin/signup">
                Começar gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              asChild
              onClick={() => handleCTAClick()}
            >
              <a href="#demo">
                Ver demo
              </a>
            </Button>
          </div>

          {/* Social proof mini */}
          <p className="mt-8 text-sm text-muted-foreground">
            Junte-se a{" "}
            <span className="font-semibold text-foreground">+500 restaurantes</span>
            {" "}que já usam o PediAi
          </p>
        </div>
      </div>
    </section>
  );
}
