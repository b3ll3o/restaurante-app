# Análise da Estrutura de Módulos - MenuLink

**Data**: 2026-04-17  
**Tipo**: Análise de Estado Atual  
**Objetivo**: Identificar conformidade com regras de proximidade AGENTS.md e BDD

---

## 1. Resumo Executivo

| Diretório | Total | Corretos | Incorretos | % Conformidade |
|-----------|-------|----------|------------|----------------|
| `app/` | 15 | 14 | 1 | 93% |
| `components/` | 8 | 8 | 0 | 100% |
| `lib/` | 7 | 7 | 0 | 100% |
| `context/` | 2 | 2 | 0 | 100% |
| `hooks/` | 1 | 1 | 0 | 100% |
| `types/` | 5 | 5 | 0 | 100% |
| **TOTAL** | **38** | **37** | **1** | **97%** |

---

## 2. Módulos CORRETOS

### 2.1 `app/` - Correto

| Módulo | AGENTS.md | .feature | Status |
|--------|-----------|----------|--------|
| `app/admin/login/` | `admin/login/AGENTS.md` | `login.feature` | ✅ |
| `app/admin/signup/` | `admin/signup/AGENTS.md` | `signup.feature` | ✅ |
| `app/admin/dashboard/` | `admin/dashboard/AGENTS.md` | `dashboard.feature` | ✅ |
| `app/admin/categories/` | `admin/categories/AGENTS.md` | `categories.feature` | ✅ |
| `app/admin/products/` | `admin/products/AGENTS.md` | `products.feature` | ✅ |
| `app/admin/orders/` | `admin/orders/AGENTS.md` | `orders.feature` | ✅ |
| `app/admin/settings/` | `admin/settings/AGENTS.md` | `settings.feature` | ✅ |
| `app/admin/auth/callback/` | `admin/auth/callback/AGENTS.md` | N/A (rota técnica) | ✅ |
| `app/menu/[slug]/` | `menu/[slug]/AGENTS.md` | `menu.feature` | ✅ |
| `app/api/orders/` | `api/orders/AGENTS.md` | `orders.feature` | ✅ |
| `app/admin/` (módulo) | `admin/AGENTS.md` | N/A | ✅ |
| `app/menu/` (módulo) | `menu/AGENTS.md` | N/A | ✅ |
| `app/api/` (módulo) | `api/AGENTS.md` | N/A | ✅ |
| `app/` (raiz) | `app/AGENTS.md` | N/A | ✅ |

### 2.2 `components/` - Correto

| Módulo | AGENTS.md | Status |
|--------|-----------|--------|
| `components/ui/` | `ui/AGENTS.md` | ✅ |
| `components/admin/` | `admin/AGENTS.md` | ✅ |
| `components/admin/header/` | `admin/header/AGENTS.md` | ✅ |
| `components/admin/sidebar/` | `admin/sidebar/AGENTS.md` | ✅ |
| `components/ui/card/` | `ui/card/AGENTS.md` | ✅ |
| `components/ui/button/` | `ui/button/AGENTS.md` | ✅ |
| `components/ui/input/` | `ui/input/AGENTS.md` | ✅ |
| `components/` (raiz) | `components/AGENTS.md` | ✅ |

### 2.3 `lib/` - Correto

| Módulo | AGENTS.md | Status |
|--------|-----------|--------|
| `lib/supabase/` | `supabase/AGENTS.md` | ✅ |
| `lib/supabase/client/` | `supabase/client/AGENTS.md` | ✅ |
| `lib/supabase/server/` | `supabase/server/AGENTS.md` | ✅ |
| `lib/whatsapp/` | `whatsapp/AGENTS.md` | ✅ |
| `lib/utils/` | `utils/AGENTS.md` | ✅ |
| `lib/domain/` | `domain/AGENTS.md` | ✅ |
| `lib/` (raiz) | `lib/AGENTS.md` | ✅ |

### 2.4 `context/`, `hooks/`, `types/` - Correto

| Módulo | AGENTS.md | Status |
|--------|-----------|--------|
| `context/cart-context/` | `cart-context/AGENTS.md` | ✅ |
| `context/` (raiz) | `context/AGENTS.md` | ✅ |
| `hooks/` | `hooks/AGENTS.md` | ✅ |
| `types/category/` | `category/AGENTS.md` | ✅ |
| `types/product/` | `product/AGENTS.md` | ✅ |
| `types/order/` | `order/AGENTS.md` | ✅ |
| `types/cart/` | `cart/AGENTS.md` | ✅ |
| `types/` (raiz) | `types/AGENTS.md` | ✅ |

---

## 3. Módulos INCORRETOS

### 3.1 `app/menu/[slug]/checkout/` - AGENTS.md Ausente

| Aspecto | Status |
|---------|--------|
| Pasta | `app/menu/[slug]/checkout/` |
| AGENTS.md | ❌ AUSENTE |
| .feature | ✅ `checkout/checkout.feature` (correto local) |
| page.tsx | ❌ AUSENTE (pode ainda não ter sido implementado) |

**Problema**: O arquivo `.feature` está no local correto (nível do módulo checkout), mas falta o `AGENTS.md` no mesmo nível.

**Regra Violada**: "TODO elemento da arquitetura DEVE ter AGENTS.md" + "AGENTS.md DEVEM estar no nível mais próximo possível do elemento que documentam"

---

## 4. Ações Necessárias

### 4.1 Correção Obrigatória

| # | Módulo | Ação | Prioridade |
|---|--------|------|------------|
| 1 | `app/menu/[slug]/checkout/` | Criar `AGENTS.md` no mesmo nível do `checkout.feature` | Alta |

### 4.2 Documentação a Atualizar

| # | Módulo | Ação |
|---|--------|------|
| 1 | `app/menu/[slug]/AGENTS.md` | Adicionar referência ao sub-módulo `checkout/` |
| 2 | `app/menu/AGENTS.md` | Atualizar estrutura de diretórios para incluir `checkout/` |

---

## 5. Padrão Atual Verificado

### 5.1 Estrutura Típica CORRETA (padrão encontrado)

```
app/admin/login/
├── page.tsx
├── login.feature        ← BDD no mesmo nível do módulo
└── AGENTS.md            ← Documentação no mesmo nível
```

### 5.2 Estrutura do Módulo checkout/ (ATÍPICO)

```
app/menu/[slug]/checkout/
├── checkout.feature     ← BDD presente ✅
└── (AGENTS.md ausente)  ← ❌ VIOLAÇÃO
```

---

## 6. Observações

### 6.1 BDD com Tag `@integration-test`

Todos os `.feature` encontrados possuem tag `@integration-test` apontando para o teste de integração correspondente:

| .feature | Tag @integration-test |
|----------|----------------------|
| `login.feature` | `tests/integration/login.test.ts` |
| `signup.feature` | `tests/integration/signup.test.ts` |
| `dashboard.feature` | `tests/integration/dashboard.test.ts` |
| `categories.feature` | `tests/integration/categories.test.ts` |
| `products.feature` | `tests/integration/products.test.ts` |
| `orders.feature` | `tests/integration/orders.test.ts` |
| `settings.feature` | `tests/integration/settings.test.ts` |
| `menu.feature` | `tests/integration/menu.test.ts` |
| `checkout.feature` | `tests/integration/checkout.test.ts` |
| `orders.feature` (API) | `tests/integration/orders.test.ts` |

### 6.2 Hierarquia de AGENTS.md

A hierarquia de documentos está corretamente implementada:
- Raiz (`app/AGENTS.md`, `components/AGENTS.md`, etc.) → visão geral do módulo
- Sub-módulos (`app/admin/login/AGENTS.md`) → documentação detalhada

---

## 7. Conclusão

O projeto MenuLink está **97% conforme** as regras de documentação AGENTS.md e BDD. Apenas 1 módulo precisa de correção:

**Ação imediata necessária**: Criar `AGENTS.md` em `app/menu/[slug]/checkout/`

**Tempo estimado de correção**: 5 minutos

---

**Análise Concluída** ✅