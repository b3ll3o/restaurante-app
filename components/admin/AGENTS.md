# Admin Components - PediAi

## Visão Geral

O módulo **Admin Components** (`components/admin/`) contém componentes React específicos para o painel administrativo do PediAi. Diferente dos componentes UI base, estes componentes encapsulam lógica de negócio do admin.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4

---

## Estrutura de Diretórios

```
components/admin/
├── AGENTS.md      # Este arquivo (visão geral)
├── header.tsx     # Cabeçalho do admin
└── sidebar.tsx    # Menu lateral de navegação
```

---

## Componentes Disponíveis

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Header | `header.tsx` | Cabeçalho com informações do usuário logado e botão de logout |
| Sidebar | `sidebar.tsx` | Menu lateral de navegação com links para todas as seções do admin |

---

## Propriedades Compartilhadas

### Client Components
Todos os componentes admin usam `"use client"` porque:
- Interagem com Supabase Auth
- Usam hooks do React (`useState`)
- Usam `usePathname` do Next.js para navegação

### Composição
Os componentes são projetados para serem usados juntos no layout do admin:
- `Header` e `Sidebar` são independentes e composáveis
- `Sidebar` é usado em `app/admin/layout.tsx` junto com `Header`

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Acessibilidade | 0 violações | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente Supabase |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Referências

- [Next.js Navigation](https://nextjs.org/docs/app/building-your-application/routing/navigation)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent