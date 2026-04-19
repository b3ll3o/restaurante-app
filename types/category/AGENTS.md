# Category - PediAi

## Visão Geral

Entidade de domínio que representa uma **categoria de produtos** dentro de um restaurante. Categorias organizam os produtos do cardápio e são ordenadas para exibição.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: TypeScript (strict mode)
**Domínio**: Cardápio (Menu)

---

## Estrutura de Diretórios

```
types/
├── index.ts          # Definição do tipo Category
└── category/
    └── AGENTS.md     # Documentação do tipo Category (este arquivo)
```

---

## Interface

```typescript
interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  created_at: string;
}
```

### Propriedades

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `id` | `string` | Sim | UUID único da categoria |
| `restaurant_id` | `string` | Sim | UUID do restaurante ao qual a categoria pertence |
| `name` | `string` | Sim | Nome da categoria (ex: "Bebidas", "Pratos Principais") |
| `display_order` | `number` | Sim | Ordem de exibição da categoria no cardápio |
| `created_at` | `string` | Sim | Timestamp de criação (ISO 8601) |

---

## Uso

### Importação

```typescript
import type { Category } from '@/types';
```

### Exemplo de Uso

```typescript
const categoria: Category = {
  id: 'uuid-categoria-123',
  restaurant_id: 'uuid-restaurante-456',
  name: 'Bebidas',
  display_order: 1,
  created_at: '2026-04-17T10:00:00Z'
};
```

### Uso com Produtos (MenuData)

```typescript
import type { Category, Product, MenuData } from '@/types';

const menuData: MenuData = {
  restaurant: restaurante,
  categories: [
    {
      ...categoria,
      products: [produto1, produto2]
    } as Category & { products: Product[] }
  ]
};
```

---

## Regras de Implementação

1. **restaurant_id é obrigatório**: Toda categoria deve pertencer a um restaurante
2. **display_order para ordenação**: Categorias são ordenadas pelo campo `display_order` (crescente)
3. **Nome único por restaurante**: O nome da categoria deve ser único dentro de um mesmo restaurante (regra de negócio)
4. **Soft delete**: Categorias não são deletadas fisicamente; utilizam `display_order = -1` ou flag `is_deleted`

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de tipos | 100% | Crítica |
| Uso de `any` | 0 ocorrências | Crítica |
| Props opcionais documentadas | 100% | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| typescript | ^5 | Linguagem |

---

## Referências

- Definição em `types/index.ts:9`
- Uso em `supabase/schema.sql` (tabela `categories`)
- Contexto: `types/AGENTS.md`

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent