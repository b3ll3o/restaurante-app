import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

/**
 * CTASection - Seção de chamada para ação final
 */
export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Comece a receber pedidos hoje mesmo
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Configure sua conta em menos de 2 minutos. Sem cartão de crédito.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              asChild
            >
              <a href="/admin/signup">
                Criar minha conta grátis
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
