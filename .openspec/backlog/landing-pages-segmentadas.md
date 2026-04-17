# Backlog Item: Landing Pages Segmentadas

## Problema/Oportunidade

O MenuLink atende diferentes perfis de restaurantes (pizzarias, lanchonetes, restaurantes populares, bares, hamburguerias, etc.). Cada perfil tem dores e linguagem diferentes. Uma landing page genérica pode não ressoar com todos.

## Premissa (REGRA)

**As landing pages NÃO DEVEM fugir do propósito do SaaS**: cardápio digital para restaurantes com pedidos via WhatsApp sem comissão.

Elas devem comunicar o MESMO produto com DIFERENTES abordagens para diferentes públicos.

---

## Landing Pages Propostas

### 1. Landing "Pizzaria" (`/lp/pizzaria`)

**Público**: Donos de pizzarias e casas de pizza
**Âncora**: QR Code na mesa + Pedidos sem atender

```
Headline: "Sua pizzaria merece pedidos mesmo quando você está ocupado"
Sub: "QR Code na mesa = pedidos no WhatsApp = mais vendas"
```

### 2. Landing "Hamburgueria" (`/lp/hamburgueria`)

**Público**: Donos de hamburguerias artesanais
**Âncora**: Delivery direto + Gestão de pedidos

```
Headline: "Hamburgueria lotada? Deixe os pedidos no automático"
Sub: "Seus clientes pedem pelo celular, você só confirma no WhatsApp"
```

### 3. Landing "Bar Restaurante" (`/lp/bar`)

**Público**: Bares que servem comida
**Âncora**: Sem garçon + Sem taxa

```
Headline: "Mais vendas sem contratar mais garçon"
Sub: "Clientes pedem pelo QR Code, você foca no que importa"
```

### 4. Landing "Restaurante Popular" (`/lp/restaurante-popular`)

**Público**: Restaurantes de comida por quilo, marmitas
**Âncora**: Praticidade + Baixo custo

```
Headline: "Digitalize seu restaurante sem gastar fortune"
Sub: "R$ 0 de comissão. Só cobra quando você cresce."
```

### 5. Landing "Esportivo/Boteco" (`/lp/esportivo`)

**Público**: Bares de sport, botecos
**Âncora**: Pedidos durante o jogo

```
Headline: "Nunca mais perca uma venda no dia do jogo"
Sub: "Pedidos chegam no WhatsApp enquanto você acompanha o jogo"
```

---

## Arquitetura Técnica

### Estrutura de Diretórios

```
app/
├── page.tsx                    # Landing page principal (genérica)
└── lp/
    ├── [segment]/
    │   └── page.tsx          # Landing pages segmentadas
    └── layout.tsx            # Layout específico para LPs
```

### Padrão de Componentes

```
app/components/landing/
├── index.ts
├── LandingPage.tsx            # Componente principal
├── HeroSection.tsx
├── PillarsSection.tsx
├── SocialProofSection.tsx
├── DemoSection.tsx
├── PricingSection.tsx
└── CTASection.tsx

app/components/landing/segments/
├── HeroPizzaria.tsx
├── HeroHamburgueria.tsx
├── HeroBar.tsx
└── HeroRestaurantePopular.tsx
```

### Padrão de Segmentação

```typescript
// segments/hero-content.ts
export const heroContent = {
  pizzaria: {
    headline: "Sua pizzaria merece pedidos mesmo quando você está ocupado",
    subheadline: "QR Code na mesa = pedidos no WhatsApp = mais vendas",
    cta: "Criar cardápio para pizzaria",
  },
  hamburgueria: {
    headline: "Hamburgueria lotada? Deixe os pedidos no automático",
    subheadline: "Seus clientes pedem pelo celular, você só confirma no WhatsApp",
    cta: "Criar cardápio para hamburgueria",
  },
  // ... outros segmentos
};
```

---

## Regras de Implementação

### REGRA 1: Mesma estrutura, diferentes mensagens

Todas as landing pages DEVEM seguir a MESMA estrutura de seções:
1. Hero (com copy segmentado)
2. Social Proof
3. Pillars/Benefícios
4. Demo/Como funciona
5. Preços
6. CTA

### REGRA 2: O produto é o MESMO

- QR Code para pedidos
- Pedidos via WhatsApp
- Sem comissão
- Funciona offline

A ÚNICA diferença é a LINGUAGEM e EXEMPLOS usados.

### REGRA 3: Cada landing page TEM seu próprio AGENTS.md

```
app/lp/pizzaria/
├── page.tsx
├── AGENTS.md        ← Obrigatório
└── lp-pizzaria.feature  ← Se BDD
```

### REGRA 4: Rastreamento

Cada landing page DEVE ter UTMs diferentes para análise:
```
/lp/pizzaria?utm_source=google&utm_campaign=pizzaria
```

---

## Tarefas para Implementação

### Fase 1: Infraestrutura de Landing Pages Segmentadas

- [ ] 1.1: Criar estrutura `app/lp/[segment]/page.tsx`
- [ ] 1.2: Criar `app/components/landing/segments/hero-content.ts`
- [ ] 1.3: Criar `HeroSection` genérico com prop de segmento
- [ ] 1.4: Criar AGENTS.md para `app/lp/`

### Fase 2: Landing Pages Individuais

- [ ] 2.1: Landing Pizzaria (`/lp/pizzaria`)
- [ ] 2.2: Landing Hamburgueria (`/lp/hamburgueria`)
- [ ] 2.3: Landing Bar/Esportivo (`/lp/bar`)
- [ ] 2.4: Landing Restaurante Popular (`/lp/restaurante-popular`)

### Fase 3: Analytics

- [ ] 3.1: Configurar UTM parameters
- [ ] 3.2: Criar goals no analytics
- [ ] 3.3: A/B test headlines

### Fase 4: SEO

- [ ] 4.1: Meta tags segmentadas
- [ ] 4.2: Schema markup local
- [ ] 4.3: Sitemap com landing pages

---

## Priorização

| Landing Page | Prioridade | Justificativa |
|-------------|-----------|----------------|
| Pizzaria | Alta | Mercado grande, QR code faz muito sentido |
| Hamburgueria | Alta | Mercado grande, tendência artesanal |
| Bar/Esportivo | Média | Mercado relevante, timing de jogos |
| Restaurante Popular | Média | Mercado de massa, preço é âncora |

---

## Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Taxa de conversão por LP | ≥ 2% |
| Tempo na página | ≥ 30s |
| Taxa de bounce | ≤ 60% |
| CTAs clicados | Monitorar por UTM |

---

## Status
Backlog