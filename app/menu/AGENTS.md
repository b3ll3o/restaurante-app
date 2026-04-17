# Cardápio Público - MenuLink

## Visão Geral

O módulo **Cardápio Público** (`app/menu/`) é a interface que clientes finais veem para fazer pedidos em restaurantes. O cardápio é público e não requer autenticação, sendo acessado via URL única do restaurante (`/menu/{slug}`).

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase

---

## Estrutura de Diretórios

```
app/menu/
└── [slug]/
    ├── page.tsx          # Cardápio dinâmico por restaurante
    └── AGENTS.md         # Documentação detalhada da rota
```

---

## Sub-módulo: `/menu/[slug]`

**Responsabilidade**: Exibir cardápio público de um restaurante específico.

**Documentação detalhada**: Ver `app/menu/[slug]/AGENTS.md`

### Parâmetros

| Parâmetro | Tipo   | Descrição                          |
|-----------|--------|------------------------------------|
| `slug`    | string | Identificador único do restaurante |

### Exemplos de URL

```
/menu/bar-do-joao
/menu/pizzaria-sao-paulo
/menu/restaurante-abc
```

---

## Arquitetura

- **Client Component**: A página usa `"use client"` para estado local (carrinho, checkout) e integração com CartContext
- **Busca de dados**: Dados do restaurante, categorias e produtos são buscados via Supabase
- **Multi-tenant**: Cada restaurante possui `restaurant_id` para isolamento de dados

---

## Componentes Internos

O cardápio utiliza componentes auxiliares documentados em `app/menu/[slug]/AGENTS.md`:
- ProductCard: Exibe produto individual com controles de quantidade
- CartItemCard: Exibe item no carrinho com controles

---

## Métricas de Qualidade

| Métrica                | Target | Prioridade |
|------------------------|--------|------------|
| Tempo de carregamento  | <2s    | Alta       |
| Lighthouse Performance | ≥90    | Alta       |
| Acessibilidade         | ≥95    | Alta       |

---

## Dependências

| Dependência            | Versão    | Uso           |
|------------------------|-----------|---------------|
| @supabase/supabase-js  | ^2.103.0  | Cliente banco |
| lucide-react           | ^1.8.0    | Ícones        |
| tailwindcss            | ^4        | Estilização   |

---

## Referências

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Tailwind CSS](https://tailwindcss.com)
- [menulink-specification.md](../../.openspec/specs/menulink-specification.md)
- [menulink-technical-plan.md](../../.openspec/specs/menulink-technical-plan.md)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent