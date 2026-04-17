"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { SegmentType } from "@/lib/analytics";

interface HeroSectionProps {
  segment?: SegmentType;
}

const segmentContent: Record<NonNullable<SegmentType>, { badge: string; headline: string; subheadline: string }> = {
  pizzaria: {
    badge: "Zero comissão nos seus pedidos",
    headline: "Cardápio digital para pizzarias",
    subheadline: "Entrega via iFood, WhatsApp e cardápio digital sem comissão. Aumente suas vendas sem pagar taxa.",
  },
  hamburgueria: {
    badge: "Pedidos direto na mesa",
    headline: "Cardápio visual com QR code",
    subheadline: "Clientes escaneiam, pedem e pagam direto na mesa. Sem esperaninhas, sem erros.",
  },
  bar: {
    badge: "Comanda individual",
    headline: "Controle de comanda por pessoa",
    subheadline: "Divisão de conta automática, consumo individual e histórico. Gestão simplificada para bares.",
  },
  restaurante: {
    badge: "Reservas online",
    headline: "Reservas e carta digital",
    subheadline: "Aguarde reservas online, gerencie carta de vinhos digital e decepcione clientes.",
  },
};

const defaultContent = {
  badge: "Zero comissão nos seus pedidos",
  headline: "Cardápio digital para restaurantes",
  subheadline: "Crie seu cardápio online em minutos e receba pedidos direto no WhatsApp. Sem taxas escondidas, sem complicações.",
};

/**
 * HeroSection - Seção principal da Landing Page
 * Destaca o proposition unique de valor: zero comissão
 */
export function HeroSection({ segment }: HeroSectionProps) {
  const content = segment ? segmentContent[segment] : defaultContent;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle className="h-4 w-4" />
            <span>{content.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {content.headline}
            <span className="mt-2 block text-primary">sem pagar comissão</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            {content.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <a href="/admin/signup">
                Começar gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <a href="#demo">
                Ver demo
              </a>
            </Button>
          </div>

          {/* Social proof mini */}
          <p className="mt-8 text-sm text-muted-foreground">
            Junte-se a{" "}
            <span className="font-semibold text-foreground">+500 restaurantes</span>
            {" "}que já usam o MenuLink
          </p>
        </div>
      </div>
    </section>
  );
}
