# Landing Pages Segmentadas - PediAi

## Visão Geral

Módulo de landing pages segmentadas do PediAi. Cada landing page é direcionada para um tipo específico de restaurante (pizzaria, hamburgueria, bar, restaurante) com conteúdo personalizado e UTM tracking.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict)
**Pasta**: `app/landing/`

---

## Estrutura de Diretórios

```
app/landing/
├── AGENTS.md                        # Este arquivo (documentação do módulo)
├── pizzaria/                        # Landing page para pizzaria
│   └── page.tsx                     # Server Component
├── hamburgueria/                    # Landing page para hamburgueria
│   └── page.tsx                     # Server Component
├── bar/                             # Landing page para bar
│   └── page.tsx                     # Server Component
└── restaurante/                     # Landing page para restaurante
    └── page.tsx                     # Server Component
```

---

## Landing Pages

### Segmentos

| Segmento | URL | Headline | Social Proof |
|----------|-----|----------|--------------|
| pizzaria | `/landing/pizzaria` | Cardápio digital para pizzarias | +500 pizzarias artesanais |
| hamburgueria | `/landing/hamburgueria` | Cardápio visual com QR code | +300 hamburguerias boutique |
| bar | `/landing/bar` | Controle de comanda por pessoa | +200 bares badalados |
| restaurante | `/landing/restaurante` | Reservas e carta digital | +150 restaurantes fine dining |

---

## Arquitetura

### Server Components

Cada landing page é um **Server Component** que:
1. Define metadata única para SEO
2. Chama `analytics.page_view({ segment, url })` para tracking
3. Renderiza componentes de landing com prop `segment` específica

### Componentes Segmentados

| Componente | Props | Descrição |
|------------|-------|-----------|
| `HeroSection` | `segment?: SegmentType` | Headline e CTAs customizados por segmento |
| `PillarsSection` | `segment?: SegmentType` | 5 pilares específicos por segmento |
| `SocialProofSection` | `segment?: SegmentType` | Estatísticas do segmento |
| `CTASection` | `segment?: SegmentType` | CTA com UTM params |

---

## Analytics (lib/analytics.ts)

### SegmentType

```typescript
type SegmentType = 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';
```

### page_view Function

```typescript
interface PageViewEvent {
  segment: SegmentType;
  url: string;
  timestamp?: number;
}

function page_view(event: PageViewEvent): void;
```

**Behavior**:
- Adiciona `timestamp` automaticamente se não fornecido
- Faz `console.log` do evento formatado em JSON

---

## UTM Tracking

### CTAs com UTM

Os CTAs de cada segmento incluyen UTM params:

```typescript
// Exemplo: pizzaria
href="/admin/signup?utm_source=landing&utm_medium=cta&utm_content=cta-pizzaria&utm_campaign=pizzaria"
```

| Segmento | utm_content |
|----------|-------------|
| pizzaria | `cta-pizzaria` |
| hamburgueria | `cta-hamburgueria` |
| bar | `cta-bar` |
| restaurante | `cta-restaurante` |

---

## Regras de Implementação

1. **Metadata única**: Cada landing page DEVE ter metadata específica para SEO
2. **Analytics**: Cada page DEVE chamar `page_view` com segment e url
3. **Componentes segmentados**: Passar prop `segment` para cada componente
4. **UTM params**: CTAs DEVEM include utm_source, utm_medium, utm_content, utm_campaign

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária (analytics) | ≥80% | Alta |
| Lint (ESLint) | 0 erros | Alta |
| TypeScript strict | Compliant | Alta |
| SEO metadata | Unique por page | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | UI Library |
| @/components/landing | local | Componentes de landing |
| @/lib/analytics | local | Tracking de page views |

---

## Referências

- [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [pediai-specification.md](../../../opencode/openspec/specs/pediai-specification.md)
- [landing.feature](./landing.feature)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent