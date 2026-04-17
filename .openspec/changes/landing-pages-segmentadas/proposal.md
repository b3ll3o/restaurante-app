# Proposta: Landing Pages Segmentadas

**Change ID:** landing-pages-segmentadas  
**PRD de Origem:** `.openspec/backlog/prds/003-2026-04-17-landing-pages-segmentadas/prd.md`  
**Data:** 2026-04-17  
**Autor:** AI Agent  
**Status:** Proposta

---

## Problema

A landing page atual do MenuLink tem taxa de conversão de ~3% com bounce rate >70%.
O motivo central é a falta de segmentação: donos de pizzarias, hamburguerias, bares e
restaurantes à la carte têm necessidades, dores e objeções diferentes, mas todos veem
a mesma página genérica com headline "zero comissão".

**Evidências:**
- Bounce rate: 73%
- Conversão para trial: 3,2%
- CTR do CTA principal: <1%
- Tempo médio na página: 14 segundos
- Feedbacks de usuários indicando falta de conteúdo relevante por segmento

---

## Solução Proposta

Criar 4 landing pages estáticas segmentadas, cada uma em uma rota dedicada:

| Rota | Segmento | Persona-alvo |
|------|----------|--------------|
| `/landing/pizzaria` | Pizzarias artesanais | Proprietário que busca diferenciação e integração com delivery |
| `/landing/hamburgueria` | Hamburguerias boutique | Dono focado em cardápio visual e QR code para pedidos |
| `/landing/bar` | Bares e consumo por pessoa | Gestor que precisa de controle de comanda e divisão de conta |
| `/landing/restaurante` | À la carte e fine dining | Gerente focado em reservas e carta de vinhos digital |

Cada página reutilizará os componentes existentes de `app/components/landing/`
(`HeroSection`, `PricingSection`, `SocialProofSection`, `PillarsSection`, `CTASection`)
com props personalizadas por segmento. Não será criada nova infraestrutura de componentes.

As 4 páginas são **adicionais** à homepage existente — não a substituem.

---

## Impacto

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**
- Impacto em banco de dados: **Nenhum**
- Impacto em API routes: **Nenhum**
- Impacto em autenticação: **Nenhum**
- Módulos afetados: `app/landing/` (novas rotas), `app/components/landing/` (props por segmento), `lib/analytics.ts` (evento `page_view` com tag de segmento)

---

## Áreas Afetadas

| Módulo | Tipo de Mudança | Detalhe |
|--------|----------------|---------|
| `app/landing/pizzaria/page.tsx` | **Criar** | Nova rota estática |
| `app/landing/hamburgueria/page.tsx` | **Criar** | Nova rota estática |
| `app/landing/bar/page.tsx` | **Criar** | Nova rota estática |
| `app/landing/restaurante/page.tsx` | **Criar** | Nova rota estática |
| `app/components/landing/HeroSection.tsx` | **Modificar** | Aceitar props de segmento (headline, benefícios) |
| `app/components/landing/SocialProofSection.tsx` | **Modificar** | Aceitar props de cases por segmento |
| `app/components/landing/PillarsSection.tsx` | **Modificar** | Aceitar props de features por segmento |
| `app/components/landing/CTASection.tsx` | **Modificar** | Aceitar UTM por segmento |
| `lib/analytics.ts` | **Modificar** | Adicionar evento `page_view` com `segment` tag |

---

## Alternativas Consideradas

### Alternativa A: Landing Page Única com Tabs

Uma única `/landing` com tabs de seleção de segmento.

**Descartada porque:** UX mais complexa (usuário precisa se identificar), carrega todos os conteúdos simultaneamente prejudicando performance, e o impacto visual de personalização é menor. Menos impacto esperado na conversão.

### Alternativa B: Dynamic Landing Page (SSR)

Uma rota `/landing` que detecta o segmento via query param ou cookie e personaliza o conteúdo no servidor.

**Descartada porque:** Complexidade de SSR, cache mais difícil de gerenciar, e prejudica SEO por segmento (todas as variações compartilhariam a mesma URL base). Não justifica o benefício sobre 4 páginas estáticas com URLs dedicadas.

### Alternativa Escolhida: 4 Páginas Estáticas

4 rotas independentes em `/landing/{segmento}`. Permite SEO por segmento (Google indexa cada página como um documento distinto), desenvolvimento paralelo, prerender nativo pelo Next.js, e manutenção clara por segmento.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Conteúdo não ressoa com o segmento | Alta | Alto | Usar textos baseados no PRD e personas; iterar após métricas |
| Duplicação de lógica de componentes | Média | Médio | Componentes compartilhados com props parametrizadas (design system) |
| Assets (fotos/logos) não prontos | Alta | Médio | Usar placeholders com qualidade visual satisfatória inicialmente |
| Manutenção de 4 arquivos vs 1 | Baixa | Baixo | Componentes reutilizados minimizam duplicação; trade-off aceitável |

---

## Plano de Rollback

Páginas novas são adicionais e isoladas. Em caso de problema:
1. Remover as 4 rotas em `/landing/`
2. Nenhum impacto na homepage existente ou em qualquer outra funcionalidade
3. Zero risco para fluxo de pedidos, admin ou cardápio público

---

## Critérios de Sucesso

- [ ] **CA-01:** 4 landing pages criadas e acessíveis (`/landing/pizzaria`, `/landing/hamburgueria`, `/landing/bar`, `/landing/restaurante`)
- [ ] **CA-02:** Cada página possui hero, benefícios, prova social e features específicos do segmento
- [ ] **CA-03:** CTAs direcionam para trial com UTM correto por segmento (ex: `?utm_source=landing&utm_content=pizzaria`)
- [ ] **CA-04:** `npm run build` passa sem erros
- [ ] **CA-05:** `npm run lint` passa sem novos erros
- [ ] **CA-06:** Evento `page_view` com `segment` tag é disparado em cada página

---

## Urgência

- [ ] Crítica
- [x] **Alta** — Melhoria de conversão com impacto direto em receita; esforço estimado S (8h)
- [ ] Média
- [ ] Baixa

---

## Fora do Escopo

- Sistema de reservas
- Integração com iFood/delivery
- Framework de A/B testing
- Landing page para food trucks
- Landing pages em outros idiomas
- Alteração ou remoção da homepage existente

---

**Versão:** 1.0  
**Última Atualização:** 2026-04-17  
**Autor:** AI Agent
