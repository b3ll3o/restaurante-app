import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import type { SegmentType } from "@/lib/analytics";

interface CTASectionProps {
  segment?: SegmentType;
}

interface CTAContent {
  title: string;
  subtitle: string;
  buttonText: string;
  utmContent: string;
}

const segmentCTA: Record<NonNullable<SegmentType>, CTAContent> = {
  pizzaria: {
    title: "Comece a vender mais na sua pizzaria hoje mesmo",
    subtitle: "Configure sua conta em menos de 2 minutos. Sem cartão de crédito.",
    buttonText: "Criar conta grátis para pizzaria",
    utmContent: "cta-pizzaria",
  },
  hamburgueria: {
    title: "Digitalize seu hamburgão hoje mesmo",
    subtitle: "Configure sua conta em menos de 2 minutos. Sem cartão de crédito.",
    buttonText: "Criar conta grátis para hamburgueria",
    utmContent: "cta-hamburgueria",
  },
  bar: {
    title: "Organize seu bar hoje mesmo",
    subtitle: "Configure sua conta em menos de 2 minutos. Sem cartão de crédito.",
    buttonText: "Criar conta grátis para bar",
    utmContent: "cta-bar",
  },
  restaurante: {
    title: "Modernize seu restaurante hoje mesmo",
    subtitle: "Configure sua conta em menos de 2 minutos. Sem cartão de crédito.",
    buttonText: "Criar conta grátis para restaurante",
    utmContent: "cta-restaurante",
  },
};

const defaultCTA: CTAContent = {
  title: "Comece a receber pedidos hoje mesmo",
  subtitle: "Configure sua conta em menos de 2 minutos. Sem cartão de crédito.",
  buttonText: "Criar minha conta grátis",
  utmContent: "cta-default",
};

/**
 * CTASection - Seção de chamada para ação final
 */
export function CTASection({ segment }: CTASectionProps) {
  const content = segment ? segmentCTA[segment] : defaultCTA;
  const href = segment ? `/admin/signup?utm_source=landing&utm_medium=cta&utm_content=${content.utmContent}&utm_campaign=${segment}` : "/admin/signup";

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {content.title}
          </h2>
          <p className="mb-8 text-lg opacity-90">
            {content.subtitle}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              asChild
            >
              <a href={href}>
                {content.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-80">
            <Clock className="h-4 w-4" />
            <span>Teste gratuito por 14 dias</span>
            <span>•</span>
            <span>Sem compromisso</span>
            <span>•</span>
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}
