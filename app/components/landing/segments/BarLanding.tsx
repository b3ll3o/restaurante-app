"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Wine, Receipt, Users } from "lucide-react";

/**
 * BarLanding - Landing page segmentada para bares
 * Foco: Divisão de conta, comanda individual, gestão de bar
 */
export function BarLanding() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-background py-16 md:py-24">
      {/* Decoração */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-100/50 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge específico */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            <Wine className="h-4 w-4" />
            <span>Para Bares</span>
          </div>

          {/* Headline específica */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Divida a conta
            <span className="mt-2 block text-purple-600">sem dor de cabeça</span>
          </h1>

          {/* Subheadline específica */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Comanda individual por pessoa, divisão automática da conta, 
            gestão simplificada. O bar que seus clientes merecem.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 sm:w-auto"
              asChild
            >
              <a href="/admin/signup?utm_source=landing&utm_medium=cta&utm_content=bar-hero&utm_campaign=bar">
                Começar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50"
              asChild
            >
              <a href="#demo">
                Ver como funciona
              </a>
            </Button>
          </div>

          {/* Diferenciais específicos */}
          <div className="mt-12 grid grid-cols-3 gap-4 rounded-xl bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Receipt className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium">Comanda individual</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium">Divisão automática</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium">Sem taxa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
