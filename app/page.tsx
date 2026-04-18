import type { Metadata } from "next";
import { LandingPage } from "@/app/components/landing";

/**
 * Landing page principal do MenuLink
 * REQ-LP-01 a REQ-LP-08: Landing page de alta conversão
 * design 7.1: SEO metadata
 */
export const metadata: Metadata = {
  title: "MenuLink — Cardápio digital sem comissão",
  description:
    "Aumente suas vendas diretas sem pagar comissão. Crie seu cardápio digital e receba pedidos no WhatsApp em 2 minutos.",
  openGraph: {
    title: "MenuLink — Cardápio digital sem comissão",
    description: "Aumente suas vendas diretas sem pagar comissão.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuLink — Cardápio digital sem comissão",
    description: "Aumente suas vendas diretas sem pagar comissão.",
  },
};

export default function Home() {
  return <LandingPage />;
}
