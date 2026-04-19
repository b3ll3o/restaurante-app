"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Pizza, Clock, Users } from "lucide-react";

/**
 * PizzariaLanding - Landing page segmentada para pizzarias
 * Foco: Entrega rápida, cardápio de pizzas, zero comissão
 */
export function PizzariaLanding() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-background py-16 md:py-24">
      {/* Decoração */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-red-100/50 blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge específico */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            <Pizza className="h-4 w-4" />
            <span>Especial para Pizzarias</span>
          </div>

          {/* Headline específica */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Venda mais pizzas
            <span className="mt-2 block text-orange-600">sem pagar comissão</span>
          </h1>

          {/* Subheadline específica */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Cardápio digital para pizzarias com pedidos via WhatsApp. 
            Seus clientes pedem direto, você recebe na hora, sem taxas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
              asChild
            >
              <a href="/admin/signup?utm_source=landing&utm_medium=cta&utm_content=pizzaria-hero&utm_campaign=pizzaria">
                Criar cardápio gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50"
              asChild
            >
              <a href="#demo">
                Ver exemplo
              </a>
            </Button>
          </div>

          {/* Diferenciais específicos */}
          <div className="mt-12 grid grid-cols-3 gap-4 rounded-xl bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium">Entrega em 30min</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium">+200 pizzarias</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium">Zero taxa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
