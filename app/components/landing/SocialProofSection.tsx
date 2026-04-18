"use client";

import { useEffect, useState } from "react";

interface PartnerLogo {
  name: string;
  logoUrl?: string;
}

/**
 * SocialProofSection - Seção de prova social
 * REQ-LP-04: Logos de parceiros (≥3)
 * CA-LP-05: Contador >2.000 restaurantes
 */
export function SocialProofSection() {
  const [counterValue, setCounterValue] = useState(0);

  // Counter animation for visual effect (>2000 per CA-LP-05)
  useEffect(() => {
    const targetValue = 2500;
    const duration = 2000;
    const step = targetValue / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= targetValue) {
        setCounterValue(targetValue);
        clearInterval(timer);
      } else {
        setCounterValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // Partner logos (≥3 per REQ-LP-04)
  const partners: PartnerLogo[] = [
    { name: "Restaurante São Paulo" },
    { name: "Pizzaria Napoli" },
    { name: "Hamburgueria Gourmet" },
    { name: "Bar do João" },
    { name: "Café Central" },
  ];

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        {/* Counter Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">
              +{counterValue.toLocaleString("pt-BR")}
            </div>
            <div className="text-sm text-muted-foreground">Restaurantes</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">+50K</div>
            <div className="text-sm text-muted-foreground">Pedidos processados</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">4.8</div>
            <div className="text-sm text-muted-foreground">Avaliação média</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">R$ 0</div>
            <div className="text-sm text-muted-foreground">Comissão</div>
          </div>
        </div>

        {/* Partner Logos Section - REQ-LP-04 */}
        <div className="border-t pt-12">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            Mais de 2.500 restaurantes já usam o MenuLink
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.slice(0, 3).map((partner) => (
              <div
                key={partner.name}
                className="flex h-12 items-center justify-center rounded-md bg-card px-6 shadow-sm"
              >
                <span className="font-semibold text-muted-foreground">
                  {partner.name}
                </span>
              </div>
            ))}
            {partners.length > 3 && (
              <div className="flex h-12 items-center justify-center rounded-md bg-card px-6 shadow-sm">
                <span className="text-sm text-muted-foreground">
                  +{partners.length - 3} outros
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
