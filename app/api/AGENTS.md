# API Routes - MenuLink

## Visão Geral

O módulo **API Routes** (`app/api/`) contém os endpoints da API REST do MenuLink. Este módulo é responsável por receber requisições de clientes externos (cardápio público) e processar operações como criação de pedidos.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + TypeScript (strict) + Supabase

---

## Estrutura de Diretórios

```
app/api/
└── orders/
    ├── route.ts # Endpoint POST /api/orders
    ├── orders.feature # Cenários BDD
    └── AGENTS.md # Documentação detalhada do endpoint
```

---

## Endpoints

### POST /api/orders

Cria um novo pedido para um restaurante.

**Documentação detalhada**: Ver `app/api/orders/AGENTS.md`

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Tempo de resposta | <500ms | Média |
| Taxa de erro | <1% | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente Supabase server |
| @supabase/supabase-js | ^2.103.0 | Tipos do banco |

---

## Referências

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
- [Supabase Database](https://supabase.com/docs/guides/database)
- `app/api/orders/AGENTS.md` - Documentação detalhada do endpoint

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent