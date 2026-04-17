# PRD: 003 - Landing Pages Segmentadas

**ID:** 003-2026-04-17-landing-pages-segmentadas
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Aumentar taxa de conversão da landing page para 15% (atual: ~3%)
- **Objetivo 2:** Reduzir bounce rate com conteúdo personalizado por segmento de restaurante
- **Objetivo 3:** Atender diferentes personas (pizzarias, hamburguerias, bares, restaurantes à la carte)

---

## 1. Problema

### 1.1 Descrição do Problema

A landing page atual do MenuLink tem conversão muito baixa (~3%) porque não segmenta o público. Donos de diferentes tipos de restaurantes (pizzarias, hamburguerias, bares, restaurantes finos) têm necessidades e objeções diferentes, mas veem a mesma página genérica.

**Sintomas:**
- Taxa de rejeição alta (>70%)
- Tempo médio na página < 15 segundos
- CTA "Começar gratuitamente" tem CTR < 1%
- Zero bookings de trial

### 1.2 Contexto

- Landing page atual tem "zero comissão" como headline
- Mas pizzarias se preocupam mais com "integrar com sistema de delivery" (iFood, etc)
- Hamburguerias artesanal se preocupam com "cardápio visual bonito"
- Bares se preocupam com "gestão de consumo" (por pessoa, por consumo)
- Restaurantes finos se preocupam com "reservas" e "ambiente"

### 1.3 Evidências

- [Evidência 1: Analytics atual - 73% bounce rate, 3.2% conversão]
- [Evidência 2: Feedback de usuários - "não achei nada sobre[X]"]
- [Evidência 3: Heatmap mostra CTA ignorado]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Segmentar a landing page por tipo de restaurante (pizzaria, hamburgueria, bar, restaurante à la carte) com conteúdo personalizado e CTAs específicos.

**Hipótese:** Se mostrarmos conteúdo relevante para cada segmento, a conversão aumentar para 10-15%.

### 2.2 Benefícios Esperados

| Benefício | Métrica | Valor Atual | Valor Esperado |
|-----------|---------|-------------|----------------|
| Aumento de conversão | Taxa de trial | 3.2% | 12% |
| Redução de bounce | Bounce rate | 73% | 55% |
| Engajamento | Tempo na página | 14s | 45s |
| Qualificação de leads | Trial-to-paid | 8% | 15% |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Pizzaria Gourmet:** Proprietário de pizzaria artesanal que busca diferenciacao
  - **Papel no problema:** Decisor de tecnologia, precisa ver valor vs sistemas ja usados
  - **Necessidades:** Cardapio visual, integration com delivery, preco justo
  - **Dores:** Sistema de delivery cobra 25%+, quer manter margem

- **Hamburgueria Artesanal:** Dono de hamburgueria boutique
  - **Papel:** Marketing e operacao, preocupa com fotos do cardapio
  - **Necessidades:** Fotos grandes, cardapio instagramavel, QR code para pedidos
  - **Dores:** Perde pedidos por cardapio desatualizado no Instagram

- **Bar/Restaurante:** Bar com consumo por pessoa
  - **Papel:** Gestao de consumo, fechamento de conta
  - **Necessidades:** Dividir conta, controle de comanda, histograma de vendas
  - **Dores:** Cliente não pays, dificuldade de rateio

- **Restaurante Fine Dining:** Serviço de alta linha
  - **Papel:** Sommelier/gerente, foco em experiencia
  - **Necessidades:** Reservas, integração com OMS, carta de vinhos digital
  - **Dores:** Sistema de reservas atual é precario

### 3.2 Personas Secundárias

- **Barista/Operador:** Quem opera o sistema no dia-a-dia
  - **Papel:** Criar/atualizar cardápio, processar pedidos
  - **Necessidades:** Interface simples, atualizações rápidas

### 3.3 Stakeholders Impactados

| Stakeholder | Impacto | Comunicação |
|-------------|---------|-------------|
| Time de Marketing | Precisará criar assets por segmento | Briefing de assets |
| Time de Produto | Nova arquitetura de landing pages | Technical spec |
| Time de Vendas | Mudança no discurso de prospecção | Enablement |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

Criar landing pages segmentadas para 4 segmentos:
1. `/landing/pizzaria` - Pizzarias artesanais
2. `/landing/hamburgueria` - Hamburguerias boutique
3. `/landing/bar` - Bares e restaurantes de consumo
4. `/landing/restaurante` - Restaurantes à la carte e fine dining

Cada página terá:
- Hero personalizado com benefícios específicos do segmento
- Prova social (cases de sucesso do mesmo segmento)
- Features highlighting os benefícios mais relevantes
- Pricing adaptado ao segmento

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** 4 landing pages segmentadas criadas (pizzaria, hamburgueria, bar, restaurante)
- [ ] **CA-02:** Cada página tem headline e beneficios específicos do segmento
- [ ] **CA-03:** CTAs em cada página direcionam para trial comUTM correto
- [ ] **CA-04:** Build passa (npm run build)
- [ ] **CA-05:** Lint passa sem novos errors
- [ ] **CA-06:** Analytics event "page_view" com segment tag em cada página

### 4.3 fora do Escopo

**NÃO está Included:**
- Sistema de reservas completo (feature单独的)
- Integração com iFood/delivery (futuro)
- A/B testing framework (infra单独的)

**Explicitamente fora:**
- Página para food trucks (próximo ciclo)
- Landing page em outros idiomas

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Landing Page Unica com Tabs

**Descrição:** Uma única página com tabs para selecionar o segmento.

**Prós:**
- Manter apenas uma página para manter
- Usuário escolhe seu segmento

**Contras:**
- UX mais complexa
- Performance impactada por carregar todos os conteúdos
- Menos impacto visual de segmentação

**Por que foi descartada:** Menos impacto na conversão, UX mais complexa.

### 5.2 Alternativa B: Dynamic Landing Page (SSR)

**Descrição:** Uma página única `/landing` que detecta o segmento via query param ou cookie e renderiza conteúdo personalizado no server.

**Prós:**
- Manter uma página
- Personalização instantânea

**Contras:**
- Complexidade técnica maior
- Dificuldade de SEO para cada segmento
- Cache mais complexo

**Por que foi descartada:** Complexidade de SSR não justifica benefício sobre 4 páginas estáticas.

### 5.3 Alternativa Escolhida

**Justificativa:** 4 páginas estáticas em `/landing/{segmento}` é a melhor relação custo-benefício. Permite SEO por segmento, desenvolvimento paralelo, e impacto claro na conversão.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Opção A (Estático) | Opção B (SSR) | Decisão | Justificativa |
|-----------|---------------------|---------------|---------|---------------|
| Manutenção | 4 arquivos | 1 arquivo | Estático | Simplicidade > DRY |
| SEO | URLs específicas | path único | Estático | URLs específicas melhor |
| Performance | 4 páginas separadas | 1 página dinâmica | Estático | Prerender ganha |
| Desenvolvimento | Paralelo por segmento | Sequencial | Paralelo | Agilizar entrega |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Conteúdo não ressoa com segmento | Alta | Alto | User research antes de implementar |
| Manutenção duplicada | Média | Médio | Componentes compartilhados via design system |
| Assets não prontos (fotos, logos) | Alta | Médio | Usar placeholders inicialmente |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - Next.js com App Router, basta criar novas rotas em `/app/landing/{segmento}/`
- [x] Módulos/Serviços afetados? **Frontend** - nenhuma mudança em API ou database
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

### 7.3 Módulos Afetados

| Módulo | Impacto | Mudanças Necessárias |
|--------|---------|---------------------|
| `app/` (rotas) | Alto | Criar 4 novas landing pages |
| `components/landing/` | Médio | Componentes compartilhados |
| `lib/analytics.ts` | Baixo | Adicionar evento de page_view |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | | 8h | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 9 | 0.3 | 2.7 |
| Urgency (1-10) | 8 | 0.25 | 2.0 |
| Confidence (0.5-1) | 0.9 | 0.2 | 0.18 |
| Effort (1-10) | 4 | 0.25 | 1.0 |
| **TOTAL** | | | **5.88** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: Quais segmentos prioritários?
- **Tipo:** scope
- **Data:** 2026-04-17
- **Resposta:** Pizzaria, Hamburgueria, Bar, Restaurante (definidos no PRD)

#### Q2: Os cases de sucesso por segmento existem?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Não ainda - usar texto placeholder e generic social proof

#### Q3: A homepage atual deve continuar existindo?
- **Tipo:** scope
- **Data:** 2026-04-17
- **Resposta:** Sim - as segmentadas são adicionais, não replacements

### 9.2 Resumo do Interview

- 4 segmentos confirmados: pizzaria, hamburgueria, bar, restaurante
- Cases de sucesso serão genéricos inicialmente (placeholder)
- Homepage existente continua como fallback

---

## 10. Prompt Original

> # Backlog Item: Landing Pages Segmentadas

---

## 11. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | landing-pages-segmentadas |
| Commit | TBD |
| Sprint | 2026-04-Sprint-3 |

---

## 12. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado |

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent