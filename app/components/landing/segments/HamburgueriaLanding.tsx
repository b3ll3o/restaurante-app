"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Burger, QrCode, MapPin } from "lucide-react";

/**
 * HamburgueriaLanding - Landing page segmentada para hamburguerias
 * Foco: QR Code nas mesas, pedido direto na mesa, burgers visuais
 */
export function HamburgueriaLanding() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-background py-16 md:py-24">
      {/* Decoração */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-yellow-100/50 blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge específico */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
            <Burger className="h-4 w-4" />
            <span>Para Hamburguerias</span>
          </div>

          {/* Headline específica */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Seus burgers na mesa
            <span className="mt-2 block text-amber-600">sem chamar garçom</span>
          </h1>

          {/* Subheadline específica */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            QR Code nas mesas com cardápio visual. Clientes pedem direto pelo celular, 
            você recebe no WhatsApp. Mais praticidade, mais vendas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700 sm:w-auto"
              asChild
            >
              <a href="/admin/signup?utm_source=landing&utm_medium=cta&utm_content=hamburgueria-hero&utm_campaign=hamburgueria">
                Gerar QR Code gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-amber-200 text-amber-700 hover:bg-amber-50"
              asChild
            >
              <a href="#demo">
                Ver demo
              </a>
            </Button>
          </div>

          {/* Diferenciais específicos */}
          <div className="mt-12 grid grid-cols-3 gap-4 rounded-xl bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <QrCode className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-medium">QR na mesa</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-medium">Pedido na mesa</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-medium">Zero taxa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
