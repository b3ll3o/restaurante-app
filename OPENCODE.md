# OPENCODE.md - MenuLink

## Visão Geral

Este arquivo configura o ambiente OpenCode para o projeto MenuLink.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4 + Supabase

---

## Configuração de Plugins

### Plugins Configurados

| Plugin | Status | Descrição |
|--------|--------|-----------|
| `create-opencode-workflow` | Documentado | Plugin para criação automatizada de workflows SDD |
| `opencode-plus` | Documentado | Funcionalidades avançadas para OpenCode |

### Instalação (Futuro)

```bash
# create-opencode-workflow
npx @comfanion/workflow init

# opencode-plus
npm install @jo.cs98/opencode-plus
```

### Configuração opencode.json

```json
{
  "plugins": [
    "@comfanion/workflow",
    "@jo.cs98/opencode-plus"
  ],
  "workflow": {
    "sdd": {
      "enabled": true,
      "autoReview": true
    }
  }
}
```

---

## Contexto do Projeto

### Regras de Projeto (do AGENTS.md principal)

1. **Idioma**: pt-BR para documentação e UI, inglês para código
2. **Paradigmas**: TDD, BDD, ATDD, DDD, SDD
3. **Cobertura mínima**: 80% testes unitários
4. **Stack**: Next.js 16.2.3 + React 19 + TypeScript strict + Tailwind 4 + Supabase
5. **Multi-tenant**: Cada restaurante é um tenant isolado

### Variáveis de Ambiente Obrigatórias

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

### Path Aliases

- `@/*` → `./` (raiz do projeto)

---

## Workflows SDD

### Fluxo Padrão

```
PRD → proposal → spec → design → tasks → implementation → verification → archive
```

### Comandos Úteis

```bash
# Criar nova change
mkdir -p .openspec/changes/minha-mudanca

# Executar SDD
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run lint     # ESLint
npm run test     # Testes
```

---

## Padrões de Código

### Idioma

- **Documentação**: Português Brasileiro (pt-BR)
- **Código**: Inglês para identificadores
- **Comentarios**: Português brasileiro para lógica complexa

### Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes React | PascalCase | `CartButton.tsx` |
| Funções/Variáveis | camelCase | `useCart()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| Arquivos | kebab-case | `cart-context.tsx` |
| Types/Interfaces | PascalCase | `CartItem` |

### Convenções

1. Strict TypeScript (`strict: true`)
2. No `tailwind.config.js` (Tailwind 4 via CSS)
3. Server Components por padrão no admin
4. Client Components apenas quando necessário (`use client`)

---

## Validação Manual

Conforme tasks.md da change `ai-development-workflow`:
- **Fase 5**: Testes e validação são manuais
- Validação de código contra padrões: executada pelo agente
- Verificação de fluxo completo: manual com supervisão

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent