# PRD: 008 - Fix Supabase Environment Variables Build Error

**ID:** 008-2026-04-17-supabase-env-build-fix
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Corrigir build que falha por ausência de variáveis Supabase
- **Objetivo 2:** Garantir que build funciona sem `.env.local` (CI/CD)
- **Objetivo 3:** Implementar graceful handling de env vars ausentes

---

## 1. Problema

### 1.1 Descrição do Problema

O build do Next.js falha durante prerendering de páginas admin porque tenta criar Supabase client sem as variáveis de ambiente configuradas:

```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

**Causa raiz:**
- Páginas admin são Server Components que tentam criar Supabase client no build
- `createServerClient()` é chamado durante `generateStaticParams()` ou renderização
- Variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` não existem no build (CI/CD)

### 1.2 Contexto

**Stacktrace:**
```
Error occurred prerendering page "/admin/dashboard"
→ createServerClient() throws error
→ Supabase client initialization fails
→ Build worker exits with code 1
```

**Quando ocorre:**
- Build em CI/CD (GitHub Actions)
- Build sem arquivo `.env.local`
- Prerendering de páginas estáticas admin

### 1.3 Evidências

- [Evidência 1: GitHub Actions build falha com exit code 1]
- [Evidência 2: Console mostra "Variáveis de ambiente não configuradas" 5 vezes]
- [Evidência 3: Error message indica @supabase/ssr requer URL e API key]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Implementar defesa contra env vars ausentes:
1. Verificar existência de env vars antes de criar client
2. Retornar null ou mock em build/CI
3. Não bloquear build por falta de env vars
4. Logs claros quando env vars estão ausentes

### 2.2 Benefícios Esperados

| Benefício | Antes | Depois |
|-----------|-------|--------|
| Build em CI/CD | Falha | Passa |
| Prerendering | Bloqueado | Funcional com graceful fallback |
| DX | Erro confuso | Mensagem clara |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Dev em CI/CD:** Build automático precisa passar
  - **Necessidades:** Build não depender de vars locais
  - **Dores:** Build falha em PR sem `.env` configurado

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto |
|-------------|---------|
| Dev Team | Build mais confiável |
| CI/CD | Build passa sem env vars |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Supabase Client com Graceful Fallback**
   - `createServerClient()` verifica se env vars existem
   - Se não existem, retorna client com null ou dados mock
   - Build continua normalmente

2. **Build CI/CD Friendly**
   - Build passa sem `.env.local`
   - warning em vez de erro
   - Páginas admin são dynamic (não static)

3. **Mensagens Claras**
   - Console avisa quais vars faltam
   - Nãorepete mensagem 5 vezes

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** Build passa sem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **CA-02:** Console mostra warning (não error) sobre vars ausentes
- [ ] **CA-03:** Supabase client retorna null quando vars ausentes
- [ ] **CA-04:** Páginas admin funcionam como dynamic (SSR) quando vars ausentes
- [ ] **CA-05:** Mensagem não se repete 5 vezes
- [ ] **CA-06:** Build passa (npm run build)

### 4.3 fora do Escopo

**NÃO está Included:**
- Configuração real de env vars no GitHub Secrets
- Deploy em produção

**Explicitamente fora:**
- Mudar arquitetura de autenticação

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Configurar env vars no GitHub Actions

**Descrição:** Adicionar secrets do Supabase no GitHub Actions workflow.

**Prós:**
- Solução "correta"
- Funciona em produção

**Contras:**
- Não resolve build local sem .env
- Secrets ficam expostos no log se não configurado corretamente

**Por que foi descartada:** Não resolve o problema raiz - build deveria funcionar sem env vars.

### 5.2 Alternativa B: Usar `next.config.js` env config

**Descrição:** Configurar env vars defaults no `next.config.ts`.

**Prós:**
- Built-in Next.js

**Contras:**
- Ainda requer valores válidos do Supabase
- Não resolve graceful fallback

**Por que foi descartada:** Não é a melhor solução para CI/CD.

### 5.3 Alternativa Escolhida

**Justificativa:** Implementar graceful fallback no Supabase client. Build passa mesmo sem env vars, com warning claro.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Solução atual | Com fallback | Decisão |
|-----------|---------------|-------------|---------|
| Segurança | Falha loud | Warning + null | Fallback |
| DX | Erro confuso | Mensagem clara | Fallback |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Cliente null em produção | Baixa | Alto | Só ocorre em build, produção sempre tem env vars |
| Dados inconsistentes | Muito baixa | Alto | Condicional null-check |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - modificar `lib/supabase/server.ts`
- [x] Módulos/Serviços afetados? **`lib/supabase/server.ts`**
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Não** - comportamento existente mantido
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

### 7.3 Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `lib/supabase/server.ts` | Verificar env vars, graceful fallback |
| `lib/supabase/client.ts` | Verificar env vars, graceful fallback |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | 1h | | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 9 | 0.3 | 2.7 |
| Urgency (1-10) | 10 | 0.25 | 2.5 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 1 | 0.25 | 0.25 |
| **TOTAL** | | | **5.65** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: O que deve acontecer quando env vars estão ausentes no build?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Build deve passar com warning. Client retorna null.

#### Q2: Páginas admin devem ser dynamic ou static?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Dynamic (SSR) é mais apropriado já que requerem autenticação.

#### Q3: Como evitar a mensagem repetida 5 vezes?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Usar flag/deduplicação ou só mostrar uma vez por sessão de build.

### 9.2 Resumo do Interview

- Build passa com warning
- Client retorna null
- Páginas admin são dynamic
- Mensagem deduplicada

---

## 10. Arquitetura Proposta

### 10.1 Solução em `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Flag para deduplicar warning
let warningShown = false;

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Graceful fallback para build sem env vars
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!warningShown) {
      console.warn(
        '[MenuLink] Variáveis de ambiente do Supabase não configuradas. ' +
        'NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias. ' +
        'Em build CI/CD, isso é esperado - usando fallback null client.'
      );
      warningShown = true;
    }

    // Retornar null ou mock client para build não quebrar
    return createFallbackClient();
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component - ignora
        }
      },
    },
  });
}

function createFallbackClient() {
  // Mock client que não faz nada - apenas para build não quebrar
  return {
    from: () => ({
      select: () => ({ data: null, error: new Error('Supabase not configured') }),
      insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
    auth: {
      getSession: () => ({ data: { session: null }, error: null }),
    },
  } as ReturnType<typeof createServerClient>;
}
```

### 10.2 Solução em `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr';

let warningShown = false;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (!warningShown) {
      console.warn(
        '[MenuLink] Variáveis de ambiente não configuradas.'
      );
      warningShown = true;
    }
    // Client não pode ser criado sem env vars em browser
    // Retornar null e deixar componentes tratarem
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
```

### 10.3 Marcar páginas admin como dynamic

```typescript
// Em app/admin/dashboard/page.tsx
export const dynamic = 'force-dynamic';
// ou
export const dynamic = 'force-static'; // se preferir static com fallback
```

---

## 11. Prompt Original

> crie um prd para corrigir esse erro da esteira do github actions. ref: Run npm run build

---

## 12. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | supabase-env-build-fix |
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