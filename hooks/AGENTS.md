# Hooks - PediAi

## Visão Geral

O módulo **Hooks** contém custom hooks React reutilizáveis que encapsulam lógica de negócio e estado.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict)

---

## Estrutura de Diretórios

```
hooks/
├── AGENTS.md          # Este arquivo (visão geral)
├── useAuth/           # Hook de autenticação
│   ├── AGENTS.md      # Documentação individual
│   └── useAuth.ts     # Implementação
└── useRestaurant/     # Hook de restaurante
    ├── AGENTS.md      # Documentação individual
    └── useRestaurant.ts # Implementação
```

---

## Hooks Disponíveis

### useAuth

**Responsabilidade**: Gerenciar estado de autenticação em toda a aplicação.

**Status**: Em implementação
**Dependências**: Supabase Auth

**Documentação**: `hooks/useAuth/AGENTS.md`

### useRestaurant

**Responsabilidade**: Gerenciar dados do restaurante autenticado.

**Status**: Em implementação
**Dependências**: Supabase, useAuth

**Documentação**: `hooks/useRestaurant/AGENTS.md`

---

## Boas Práticas

1. **Client Components**: Hooks que usam browser APIs devem ter `'use client'`
2. **Tipagem**: Sempre usar interfaces explícitas para retorno
3. **Tratamento de Erros**: Estado de erro estruturado com `Error | null`
4. **Cleanup**: useEffect deve retornar função de cleanup quando necessário

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥85% | Alta |
| Tipagem completa | 100% | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | Framework |
| @supabase/supabase-js | ^2.103.0 | Banco de dados |

---

## Referências

- [React Hooks](https://react.dev/reference/react)
- [Writing Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent