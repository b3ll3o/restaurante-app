"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, UtensilsCrossed, Calendar, Award } from "lucide-react";

/**
 * RestauranteLanding - Landing page segmentada para restaurantes
 * Foco: Experiência premium, carta digital, reservas
 */
export function RestauranteLanding() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-background py-16 md:py-24">
      {/* Decoração elegante */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-slate-100/50 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gray-100/50 blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge específico */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <UtensilsCrossed className="h-4 w-4" />
            <span>Para Restaurantes</span>
          </div>

          {/* Headline específica */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Eleve a experiência
            <span className="mt-2 block text-slate-700">do seu restaurante</span>
          </h1>

          {/* Subheadline específica */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Carta digital premium, reservas online, integração com sistema.
            A sofisticação que seus clientes esperam, sem complicações.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-slate-800 hover:bg-slate-900 sm:w-auto"
              asChild
            >
              <a href="/admin/signup?utm_source=landing&utm_medium=cta&utm_content=restaurante-hero&utm_campaign=restaurante">
                Conhecer solução
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
              asChild
            >
              <a href="#demo">
                Ver demonstração
              </a>
            </Button>
          </div>

          {/* Diferenciais específicos */}
          <div className="mt-12 grid grid-cols-3 gap-4 rounded-xl bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Award className="h-5 w-5 text-slate-600" />
              <span className="text-xs font-medium">Carta premium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-600" />
              <span className="text-xs font-medium">Reservas online</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-5 w-5 text-slate-600" />
              <span className="text-xs font-medium">Sem comissão</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
