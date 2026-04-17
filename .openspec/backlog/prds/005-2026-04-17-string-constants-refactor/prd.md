# PRD: 005 - String Constants Refactor

**ID:** 005-2026-04-17-string-constants-refactor
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Centralizar strings repetidas em constantes para facilitar manutenção
- **Objetivo 2:** Reduzir risco de inconsistências em mensagens, labels e statuses
- **Objetivo 3:** Melhorar internacionalização (i18n) futura

---

## 1. Problema

### 1.1 Descrição do Problema

Strings literais estão espalhadas pelo código, causing:
- **Inconsistência**: "Pendente" em um lugar, "pending" em outro
- **Duplicação**: Mesmo texto copiado em múltiplos arquivos
- **Manutenção difícil**: Mudar um texto requer editar vários arquivos
- **Tradução complexa**: Não há centralização para i18n

### 1.2 Contexto

**Strings identificadas com alta repetição:**

| Categoria | Strings | Ocorrências |
|-----------|---------|-------------|
| Locale | `"pt-BR"` | 8 |
| Order Status | `"pending"`, `"confirmed"`, `"cancelled"` | 15+ |
| Status Display | `"Pendente"`, `"Confirmado"`, `"Cancelado"` | 10+ |
| Toast Messages | `"Conexão restaurada"`, `"Você está offline"` | 2 |
| Currency | `"R$ "` prefix | 5+ |
| WhatsApp Format | `"*Total:* R$ {valor}*"` | 3 |

### 1.3 Evidências

- [Evidência 1: `lib/utils.ts` + 5 pages usam `Intl.NumberFormat("pt-BR", ...)`]
- [Evidência 2: Order status strings em types/index.ts, orders/page.tsx, orders-api.test.ts, etc.]
- [Evidência 3: Toast messages em `hooks/useOnlineStatus.ts` e `offline-provider.tsx`]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Criar um módulo de constantes `lib/constants.ts` (ou `lib/i18n.ts`) com:
1. Locales (`LOCALE.ptBR`)
2. Order statuses (`ORDER_STATUS.pending`)
3. Status display labels (`STATUS_LABELS.pending`)
4. Toast messages (`TOAST_MESSAGES.offline`)
5. Currency format (`CURRENCY.prefix`)

### 2.2 Benefícios Esperados

| Benefício | Antes | Depois |
|-----------|-------|--------|
| Manutenção | Editar 8 arquivos para mudar locale | Editar 1 arquivo |
| Consistência | "Pendente" vs "pending" | Constante única |
| i18n readiness | Não existe | Centralizado |
| Type safety | Strings literals | TypeScript constants |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Dev/Maintainer:** Precisa mudar mensagens ou labels frequentemente
  - **Necessidades:** Local único para mudanças, type safety
  - **Dores:** Encontrar todas as ocorrências de uma string

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto |
|-------------|---------|
| Dev Team | Padrão novo a seguir |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Novo arquivo `lib/constants.ts`** com:
   ```typescript
   // Locale
   export const LOCALE = {
     ptBR: "pt-BR",
   } as const;

   // Order Status
   export const ORDER_STATUS = {
     pending: "pending",
     confirmed: "confirmed",
     cancelled: "cancelled",
   } as const;

   // Status Labels (display)
   export const STATUS_LABELS = {
     pending: "Pendente",
     confirmed: "Confirmado",
     cancelled: "Cancelado",
   } as const;

   // Toast Messages
   export const TOAST_MESSAGES = {
     online: "Conexão restaurada",
     offline: "Você está offline",
   } as const;

   // Currency
   export const CURRENCY = {
     prefix: "R$ ",
     locale: LOCALE.ptBR,
   } as const;
   ```

2. **Refatoração** de arquivos que usam essas constantes

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** `lib/constants.ts` criado com todas as constantes identificadas
- [ ] **CA-02:** Todos os arquivos que usam strings repetidas importam de `lib/constants.ts`
- [ ] **CA-03:** Build passa (npm run build)
- [ ] **CA-04:** Lint passa sem novos errors
- [ ] **CA-05:** Testes passam (npm run test:unit)

### 4.3 fora do Escopo

**NÃO está Included:**
- Sistema de i18n completo (react-intl, next-i18n, etc.)
- Traduções para outros idiomas
- Alteração de funcionalidades

**Explicitamente fora:**
- Mudar strings em arquivos de teste (test files podem ter literals)

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Não fazer (manter literals)

**Descrição:** Continuar usando strings literais espalhadas.

**Prós:**
- Nenhum refactoring necessário

**Contras:**
- Manutenção difícil
- Inconsistências
- Sem i18n readiness

**Por que foi descartada:** Dívida técnica que grows over time.

### 5.2 Alternativa B: Módulo i18n completo

**Descrição:** Implementar sistema completo de internacionalização com react-intl ou similar.

**Prós:**
- Solução completa para i18n
- Suporte a múltiplos idiomas

**Contras:**
- Overhead desnecessário para projeto atual
- Complexidade adicional

**Por que foi descartada:** Projeto não requer múltiplos idiomas no momento.

### 5.3 Alternativa Escolhida

**Justificativa:** Criar `lib/constants.ts` simples com constantes centralizadas. Menor impacto, maior benefício imediato.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Sem Constants | Com Constants | Decisão |
|-----------|---------------|---------------|---------|
| Manutenção | Difícil (múltiplos arquivos) | Fácil (1 arquivo) | Constants |
| Type Safety | Nenhum | TypeScript verificado | Constants |
| Complexidade | Baixa | Mínima | Constants |
| i18n Ready | Não | Sim | Constants |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
|遗漏 alguns usos | Baixa | Médio | Grep thorough after refactor |
| Breaking changes | Muito baixa | Alto | Testes devem passar |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - apenas criar arquivo e refatorar imports
- [x] Módulos/Serviços afetados? **Múltiplos** - ver seção de arquivos impactados
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Não** (mantém mesmo valores)
- [ ] Migração necessária? **Sim** - renomear imports em múltiplos arquivos
- [ ] Novos dependencies? **Não**

### 7.3 Arquivos a Modificar

| Arquivo | Strings a substituir |
|---------|----------------------|
| `lib/utils.ts` | `LOCALE.ptBR` |
| `app/menu/[slug]/page.tsx` | Status labels, locale |
| `app/admin/orders/page.tsx` | Status labels, locale |
| `app/admin/products/page.tsx` | Locale |
| `app/admin/dashboard/page.tsx` | Status labels, locale |
| `hooks/useOnlineStatus.ts` | Toast messages |
| `types/index.ts` | Order status (types) |
| `app/api/orders/route.ts` | Status values |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | | 4h | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 7 | 0.3 | 2.1 |
| Urgency (1-10) | 5 | 0.25 | 1.25 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 2 | 0.25 | 0.5 |
| **TOTAL** | | | **4.05** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: Quais categorias de strings prioritizar?
- **Tipo:** scope
- **Data:** 2026-04-17
- **Resposta:** Order status, status labels, e locale (mais frequentes)

#### Q2: Devo criar um arquivo único ou separar por domínio?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Arquivo único `lib/constants.ts` com seções por domínio (mais simples)

#### Q3: Manter compatibilidade com valores atuais (ex: "pending")?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Sim - usar `as const` para manter os mesmos valores string

### 9.2 Resumo do Interview

- Constants prioritárias: order status, status labels, locale
- Arquivo único: `lib/constants.ts`
- Manter valores compatíveis (as const)

---

## 10. Arquitetura Proposta

### 10.1 Estrutura de `lib/constants.ts`

```typescript
/**
 * Constantes centralizadas do MenuLink
 * Substitui strings literais repetidas pelo codebase
 */

// Locale
export const LOCALE = {
  ptBR: "pt-BR",
} as const;

// Order Status (valores do banco)
export const ORDER_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
} as const;

// Status Display (labels para UI)
export const STATUS_LABELS = {
  [ORDER_STATUS.pending]: "Pendente",
  [ORDER_STATUS.confirmed]: "Confirmado",
  [ORDER_STATUS.cancelled]: "Cancelado",
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  online: "Conexão restaurada",
  offline: "Você está offline",
} as const;

// Currency
export const CURRENCY = {
  prefix: "R$ ",
  locale: LOCALE.ptBR,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  cart: "menulink_cart",
} as const;
```

### 10.2 Exemplo de Uso

```typescript
// Antes
new Intl.NumberFormat("pt-BR", ...)

// Depois
import { LOCALE } from "@/lib/constants";
new Intl.NumberFormat(LOCALE.ptBR, ...)

// Antes
status === "pending" && "Pendente"

// Depois
status === ORDER_STATUS.pending && STATUS_LABELS[ORDER_STATUS.pending]
```

---

## 11. Prompt Original

> crie um prd para identificar palavras e trechos que se repetem, analise se vale a pena colocar esses trechos e palavras em constante

---

## 12. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | string-constants-refactor |
| Commit | TBD |
| Sprint | 2026-04-Sprint-3 |

---

## 13. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado |

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent