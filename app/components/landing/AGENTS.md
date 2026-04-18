# Landing Page Components - MenuLink

## Visão Geral

Módulo de componentes da Landing Page do MenuLink. Composto por seções reutilizáveis que formam uma página de alta conversão para conquista de restaurantes.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4
**Pasta**: `app/components/landing/`

---

## Estrutura de Diretórios

```
app/components/landing/
├── AGENTS.md              # Este arquivo (documentação do módulo)
├── index.ts               # Exportações públicas
├── LandingPage.tsx        # Componente compositor (organiza todas as seções)
├── HeroSection.tsx        # Seção principal (headline + CTAs)
├── PillarsSection.tsx      # Seção de pilares/benefícios (EXATAMENTE 3 pilares)
├── SocialProofSection.tsx # Seção de prova social (estatísticas + logos)
├── VideoSection.tsx       # Seção de depoimento em vídeo com modal (NOVO)
├── DemoSection.tsx        # Seção de demonstração do fluxo
├── PricingSection.tsx     # Seção de preços (plans)
└── CTASection.tsx         # Seção de chamada para ação final + formulário
```

---

## Componente Principal: LandingPage

### Responsabilidade
Componente compositor que organiza todas as seções da landing page em ordem de conversão otimizada.

### Interface Pública

```typescript
// app/components/landing/LandingPage.tsx
export function LandingPage(): JSX.Element
```

### Arquitetura
```
LandingPage
├── HeroSection          (posicionamento: conversão imediata)
├── SocialProofSection   (posicionamento: gerar credibilidade)
├── PillarsSection       (posicionamento: benefícios - EXATAMENTE 3)
├── VideoSection         (posicionamento: prova social - NOVO)
├── DemoSection          (posicionamento: como funciona)
├── PricingSection       (posicionamento: decisão de plano)
└── CTASection           (posicionamento: ação final + lead capture)
```

---

## Sub-módulo: HeroSection

### Responsabilidade
Seção principal da landing page. Destaca o proposition unique de valor: **zero comissão**. Contém headline unificado "Aumente suas vendas diretas sem pagar comissão", CTAs e social proof mini.

### Interface Pública

```typescript
// app/components/landing/HeroSection.tsx
export function HeroSection(): JSX.Element
```

### Estrutura Visual
- Badge "Zero comissão nos seus pedidos"
- Headline: "Aumente suas vendas diretas sem pagar comissão" (unificado)
- Subheadline: descrição do valor
- 2 CTAs: "Começar gratuitamente" (primário) e "Ver demo" (secundário)
- Social proof mini: "+500 restaurantes"
- Analytics tracking em clicks de CTA

### Props
Nenhuma (componente standalone - sem prop `segment`)

### Dependências
- `@/components/ui/button` - Botão primário
- `lucide-react` - Ícones (ArrowRight, CheckCircle)

---

## Sub-módulo: PillarsSection

### Responsabilidade
Seção de pilares/benefícios. Mostra os **3 principais diferenciais** do MenuLink em cards.

### Interface Pública

```typescript
// app/components/landing/PillarsSection.tsx
export function PillarsSection(): JSX.Element
```

### Pilares Definidos (EXATAMENTE 3 - REQ-LP-02)
1. **Setup em 2 minutos** - Sem integração complexa
2. **Zero comissão** - Não cobramos por pedido
3. **WhatsApp nativo** - Pedidos chegam direto no seu WhatsApp

### Props
Nenhuma (componente standalone)

### Dependências
- `lucide-react` - Ícones (Smartphone, MessageCircle, QrCode)

---

## Sub-módulo: SocialProofSection

### Responsabilidade
Seção de prova social com estatísticas do produto e logos de parceiros. Gera credibilidade através de números.

### Interface Pública

```typescript
// app/components/landing/SocialProofSection.tsx
export function SocialProofSection(): JSX.Element
```

### Estatísticas Exibidas (com animação de contador)
| Métrica | Valor |
|---------|-------|
| Restaurantes | +2.500 (animado - CA-LP-05) |
| Pedidos processados | +50K |
| Avaliação média | 4.8 |
| Comissão | R$ 0 |

### Logos de Parceiros (≥3 - REQ-LP-04)
- Exibe logos de pelo menos 3 parceiros
- Parceiros example: Restaturante São Paulo, Pizzaria Napoli, Hamburgueria Gourmet

### Props
Nenhuma (componente standalone)

### Dependências
Nenhuma (componente puro)

---

## Sub-módulo: VideoSection (NOVO)

### Responsabilidade
Seção de depoimento em vídeo com Dialog modal. Contém card com thumbnail que abre modal com player de vídeo (REQ-LP-05).

### Interface Pública

```typescript
// app/components/landing/VideoSection.tsx
interface VideoSectionProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  testimonialName?: string;
  testimonialRole?: string;
}
export function VideoSection(props?: VideoSectionProps): JSX.Element
```

### Estrutura
- Card com thumbnail de vídeo
- Dialog modal com iframe do YouTube
- Botão de fechar (X)
- Controles de pausar/retomar

### Props
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| videoUrl | string | YouTube embed URL | URL do vídeo |
| thumbnailUrl | string | undefined | Thumbnail customizado |
| testimonialName | string | "João Silva" | Nome do entrevistado |
| testimonialRole | string | "Proprietário - Pizzaria..." | Cargo/empresa |

### Dependências
- `@/components/ui/dialog` - Dialog do shadcn/ui
- `lucide-react` - Ícones (Play, X)

---

## Sub-módulo: DemoSection

### Responsabilidade
Seção de demonstração do fluxo. Mostra os 3 passos para começar a usar + preview visual do QR→cardápio→pedido→WhatsApp.

### Interface Pública

```typescript
// app/components/landing/DemoSection.tsx
export function DemoSection(): JSX.Element
```

### Fluxo Demonstrado
1. **Crie seu cardápio** - Cadastro de produtos
2. **Gere o QR Code** - Impressão nas mesas
3. **Receba pedidos** - Via WhatsApp

### Preview Visual
- Cliente escaneia QR Code → acessa cardápio
- Pedido chega no WhatsApp → com itens e valor

### Props
Nenhuma (componente standalone)

### Dependências
- `lucide-react` - Ícones (QrCode, MessageCircle, CheckCircle)

---

## Sub-módulo: PricingSection

### Responsabilidade
Seção de preços com 3 planos (Start, Crescer, Escalar). Destaca o plano "Crescer" como mais popular.

### Interface Pública

```typescript
// app/components/landing/PricingSection.tsx
export function PricingSection(): JSX.Element
```

### Planos Definidos (REQ-LP-07)
| Plano | Preço | Características |
|-------|-------|----------------|
| Start | R$ 0 (para sempre) | Até 20 produtos, 1 restaurante |
| Crescer | R$ 49/mês | Ilimitado, até 3 restaurantes, mais popular |
| Escalar | R$ 149/mês | Ilimitado total, API, white-label |

### Props
Nenhuma (componente standalone)

### Dependências
- `@/components/ui/button` - Botões de CTA
- `lucide-react` - Ícones (Check)

---

## Sub-módulo: CTASection

### Responsabilidade
Seção de chamada para ação final com formulário de lead capture (REQ-LP-03) e urgência (REQ-LP-08).

### Interface Pública

```typescript
// app/components/landing/CTASection.tsx
export function CTASection(): JSX.Element
```

### Elementos
- Headline: "Comece a receber pedidos hoje mesmo"
- Elemento de urgência: "Ative hoje e ganhe 1 mês grátis!" (Zap icon)
- Formulário de lead capture:
  - Campo Nome (texto)
  - Campo Email (email)
  - Campo WhatsApp (telefone)
  - Botão: "Teste grátis 14 dias"
- Subtext: Teste 14 dias | Sem compromisso | Cancele quando quiser

### Props
Nenhuma (componente standalone)

### Dependências
- `@/components/ui/button` - Botão secundário
- `lucide-react` - Ícones (ArrowRight, Clock, Zap)

---

## Regras de Implementação

1. **Ordem de Renderização**: As seções DEVEM seguir a ordem definida em LandingPage para máxima conversão
2. **Componentes Puros**: Cada seção é standalone, sem dependências externas de estado
3. **Responsividade**: TODA seção DEVE implementar layouts mobile-first (breakpoints: sm, md, lg)
4. **Links de Navegação**: Links para `/admin/signup` DEVEM usar âncoras válidas
5. **Nomenclatura**: Props e variáveis em português (pt-BR)
6. **Propagação de IDs**: DemoSection define `id="demo"` para navegação via âncora
7. **EXATAMENTE 3 pilares**: PillarsSection deve exibir exatamente 3 pilares (REQ-LP-02)
8. **Counter > 2000**: SocialProofSection deve mostrar valor > 2000 (CA-LP-05)
9. **≥3 logos**: SocialProofSection deve exibir pelo menos 3 logos de parceiros (REQ-LP-04)

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Lint (ESLint) | 0 erros | Alta |
| TypeScript strict | Compliant | Alta |
| Responsividade | Mobile-first | Alta |
| Testes E2E | 100% fluxos críticos | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | UI Library |
| @/components/ui/button | local | Botões (shadcn/ui) |
| @/components/ui/dialog | local | Modal de vídeo (shadcn/ui) |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Referências

- [React Documentation](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)
- [menulink-specification.md](../../../.openspec/specs/menulink-specification.md)
- [menulink-technical-plan.md](../../../.openspec/specs/menulink-technical-plan.md)
- [landing-page-redesign spec](../../../.openspec/changes/landing-page-redesign/spec.md)

---

**Versão**: 2.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
