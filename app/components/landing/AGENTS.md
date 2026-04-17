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
├── PillarsSection.tsx     # Seção de pilares/benefícios
├── SocialProofSection.tsx # Seção de prova social (estatísticas)
├── DemoSection.tsx        # Seção de demonstração do fluxo
├── PricingSection.tsx     # Seção de preços (plans)
└── CTASection.tsx         # Seção de chamada para ação final
```

---

## Componente Principal: LandingPage

### Responsabilidade
Componente compositor que organiza todas as seções da landing page em ordem de conversão.

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
├── PillarsSection       (posicionamento: benefícios)
├── DemoSection          (posicionamento: como funciona)
├── PricingSection       (posicionamento: decisão de plano)
└── CTASection           (posicionamento: ação final)
```

---

## Sub-módulo: HeroSection

### Responsabilidade
Seção principal da landing page. Destaca o proposition unique de valor: **zero comissão**. Contém headline, subheadline, CTAs e social proof mini.

### Interface Pública

```typescript
// app/components/landing/HeroSection.tsx
export function HeroSection(): JSX.Element
```

### Estrutura Visual
- Badge "Zero comissão nos seus pedidos"
- Headline com proposition value
- Subheadline com descrição
- 2 CTAs: "Começar gratuitamente" (primário) e "Ver demo" (secundário)
- Social proof mini: "+500 restaurantes"

### Props
Nenhuma (componente standalone)

### Dependências
- `@/components/ui/button` - Botão primário
- `lucide-react` - Ícones (ArrowRight, CheckCircle)

---

## Sub-módulo: PillarsSection

### Responsabilidade
Seção de pilares/benefícios. Mostra os 6 principais diferenciais do MenuLink em cards.

### Interface Pública

```typescript
// app/components/landing/PillarsSection.tsx
export function PillarsSection(): JSX.Element
```

### Pilares Definidos
1. **Setup em 2 minutos** - Interface simples
2. **Pedidos no WhatsApp** - Sem apps para instalar
3. **QR Code na Mesa** - Clientes escaneiam e pedem
4. **Funciona Offline** - Nunca perde pedidos
5. **Avaliações** - Coleta de feedbacks
6. **Seguro e Confiável** - Proteção de dados

### Props
Nenhuma (componente standalone)

### Dependências
- `lucide-react` - Ícones (Smartphone, MessageCircle, QrCode, Clock, Star, Shield)

---

## Sub-módulo: SocialProofSection

### Responsabilidade
Seção de prova social com estatísticas do produto. Gera credibilidade através de números.

### Interface Pública

```typescript
// app/components/landing/SocialProofSection.tsx
export function SocialProofSection(): JSX.Element
```

### Estatísticas Exibidas
| Métrica | Valor |
|---------|-------|
| Restaurantes | +500 |
| Pedidos processados | +50K |
| Avaliação média | 4.8 |
| Comissão | R$ 0 |

### Props
Nenhuma (componente standalone)

### Dependências
Nenhuma (componente puro)

---

## Sub-módulo: DemoSection

### Responsabilidade
Seção de demonstração do fluxo. Mostra os 3 passos para começar a usar + preview visual.

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

### Planos Definidos
| Plano | Preço | Destaque |
|-------|-------|----------|
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
Seção de chamada para ação final. Incentiva criação de conta com oferta de teste gratuito.

### Interface Pública

```typescript
// app/components/landing/CTASection.tsx
export function CTASection(): JSX.Element
```

### Elementos
- Headline: "Comece a receber pedidos hoje mesmo"
- CTA: "Criar minha conta grátis"
- Subtext: Teste 14 dias | Sem compromisso | Cancele quando quiser

### Props
Nenhuma (componente standalone)

### Dependências
- `@/components/ui/button` - Botão secundário
- `lucide-react` - Ícones (ArrowRight, Clock)

---

## Regras de Implementação

1. **Ordem de Renderização**: As seções DEVEM seguir a ordem definida em LandingPage para máxima conversão
2. **Componentes Puros**: Cada seção é standalone, sem dependências externas de estado
3. ** Responsividade**: TODA seção DEVE implementar layouts mobile-first (breakpoints: sm, md, lg)
4. **Links de Navegação**: Links para `/admin/signup` DEVEM usar âncoras válidas
5. **Nomenclatura**: Props e variáveis em português (pt-BR)
6. **Propagação de IDs**: DemoSection define `id="demo"` para navegação via âncora

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Lint (ESLint) | 0 erros | Alta |
| TypeScript strict | Compliant | Alta |
| Responsividade | Mobile-first | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | UI Library |
| @/components/ui/button | local | Botões (shadcn/ui) |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Referências

- [React Documentation](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui Button](https://ui.shadcn.com/docs/components/button)
- [menulink-specification.md](../../../.openspec/specs/menulink-specification.md)
- [menulink-technical-plan.md](../../../.openspec/specs/menulink-technical-plan.md)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
