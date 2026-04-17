# PRD: 010 - Fix Login Reload Loop

**ID:** 010-2026-04-17-login-reload-loop
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent (via análise)
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Corrigir reload infinito na página /admin/login
- **Objetivo 2:** Garantir que autenticação funcione corretamente
- **Objetivo 3:** Prevenir loop de redirect

---

## 1. Problema

### 1.1 Descrição do Problema

Ao acessar `/admin/login`, a página fica recarregando infinitamente sem parar, causando um loop de refresh.

### 1.2 Contexto

**Sintoma:**
- Usuário acessa `/admin/login`
- Página recarrega automaticamente
- Loop infinito de reload
- Usuário não consegue fazer login

**Stacktrace/Comportamento Observado:**
```
render → useEffect re-runs → supabase.auth é nova referência →
getSession() retorna null → router.push("/admin/login") →
render → useEffect re-runs → loop...
```

### 1.3 Evidências

| Linha | Código | Problema |
|-------|--------|----------|
| `app/admin/layout.tsx:18` | `const supabase = createClient();` | Nova instância a cada render |
| `app/admin/layout.tsx:59` | `[router, supabase.auth]` | Dependência instável (novo objeto a cada render) |
| `lib/supabase/client/index.ts:14` | `return createBrowserClient(...)` | Cria novo cliente a cada chamada |

---

## 2. Oportunidade

### 2.1 Causa Raiz

O problema está em `app/admin/layout.tsx`:

1. `createClient()` é chamado no nível do componente (linha 18)
2. Isso gera **uma nova instância a cada render**
3. `supabase.auth` é um objeto novo a cada renderização
4. O `useEffect` com dependência `[router, supabase.auth]` re-executa
5. Isso dispara uma nova subscription `onAuthStateChange`
6. `getSession()` retorna `null` → `router.push("/admin/login")` é chamado
7. **Loop infinito**

### 2.2 Solução Identificada

Usar `useMemo` para estabilizar a referência do cliente Supabase:

```tsx
// ❌ ERRADO - nova instância a cada render
const supabase = createClient();

// ✅ CORRETO - mesma instância em todas as renders
const supabase = useMemo(() => createClient(), []);
```

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Owner (Admin):** Não consegue acessar painel admin
  - **Necessidades:** Fazer login sem loop
  - **Dores:** Loop infinito impede acesso

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto |
|-------------|---------|
| Admin/Owner | Não consegue gerenciar restaurante |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Loop corrigido** - Página `/admin/login` carrega normalmente
2. **Auth funcional** - Redirecionamento para login quando não autenticado funciona
3. **Sem reload infinito** - Login funciona em uma única renderização

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** `/admin/login` carrega sem reload infinito
- [ ] **CA-02:** Usuário não autenticado é redirecionado para `/admin/login`
- [ ] **CA-03:** Usuário autenticado consegue acessar `/admin/dashboard`
- [ ] **CA-04:** Login com credenciais funciona corretamente
- [ ] **CA-05:** Build passa (npm run build)
- [ ] **CA-06:** Lint passa sem novos errors
- [ ] **CA-07:** Testes passam

---

## 5. fora do Escopo

**NÃO está Included:**
- Alteração na lógica de autenticação do Supabase
- Mudanças no schema do banco
- Alteração de rotas

---

## 6. Trade-offs

| Trade-off | Impacto |
|-----------|---------|
| Sem side effects - correção simples |
| Sem breaking changes - apenas estabiliza referência |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - apenas adicionar `useMemo`
- [x] Módulos/Serviços afetados? **`app/admin/layout.tsx`**
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

### 7.3 Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `app/admin/layout.tsx` | Adicionar `useMemo` para estabilizar `createClient()` |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | 0.5h | | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 10 | 0.3 | 3.0 |
| Urgency (1-10) | 10 | 0.25 | 2.5 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 1 | 0.25 | 0.25 |
| **TOTAL** | | | **5.95** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: A correção deve ser aplicada em outros layouts também?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Sim, verificar se `app/menu/[slug]/layout.tsx` ou outros layouts têm o mesmo problema.

### 9.2 Resumo do Interview

- Aplicar `useMemo` em `app/admin/layout.tsx`
- Verificar outros layouts por problema similar

---

## 10. Arquitetura Proposta

### 10.1 Correção em `app/admin/layout.tsx`

**Antes (com bug):**
```tsx
"use client";

import { useEffect, useState } from "react";
// ...

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>();
  const router = useRouter();

  // ❌ ERRADO: nova instância a cada render
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(user.email);
      setIsLoading(false);
    };

    getUser();
  }, [router, supabase.auth]); // ⚠️ supabase.auth muda a cada render!

  // ...
}
```

**Depois (corrigido):**
```tsx
"use client";

import { useEffect, useState, useMemo } from "react";
// ...

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>();
  const router = useRouter();

  // ✅ CORRETO: mesma instância em todas as renders
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(user.email);
      setIsLoading(false);
    };

    getUser();
  }, [router, supabase.auth]); // ✅ supabase.auth é estável agora

  // ...
}
```

### 10.2 Verificação em Outros Layouts

Verificar se existem outros layouts com o mesmo problema:
- `app/menu/[slug]/layout.tsx`
- `app/admin/dashboard/layout.tsx`
- `app/admin/orders/layout.tsx`

---

## 11. Prompt Original

> ao acessar a url /admin/login a pagina fica recarregando sem parar

---

## 12. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | login-reload-loop-fix |
| Commit | TBD |
| Sprint | 2026-04-Sprint-3 |

---

## 13. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado via análise Oracle |

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent