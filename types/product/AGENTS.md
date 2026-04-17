# Product - MenuLink

## Visão Geral

Entidade que representa um **produto/item** do cardápio de um restaurante. Cada produto pertence a uma categoria e possui informações de precificação, disponibilidade e ordenação.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: TypeScript (strict mode)  
**Arquivo fonte**: `types/index.ts:17-27`

---

## Estrutura de Diretórios

```
types/
├── index.ts              # Definição da interface Product
└── product/
    └── AGENTS.md         # Documentação do tipo Product (este arquivo)
```

---

## Interface

```typescript
export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
}
```

### Atributos

| Atributo | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| `id` | `string` | Sim | Identificador único (UUID) |
| `category_id` | `string` | Sim | FK para Category |
| `name` | `string` | Sim | Nome do produto |
| `description` | `string \| null` | Não | Descrição textual |
| `price` | `number` | Sim | Preço em centavos |
| `image_url` | `string \| null` | Não | URL da imagem |
| `is_available` | `boolean` | Sim | Disponibilidade no cardápio |
| `display_order` | `number` | Sim | Ordem de exibição |
| `created_at` | `string` | Sim | Timestamp de criação |

---

## Uso

### Exemplo: Criar objeto Product

```typescript
const produto: Product = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  category_id: 'cat-001',
  name: 'Picanha na Brasa',
  description: 'Picanha 500g com arroz e farofa',
  price: 8900,
  image_url: 'https://exemplo.com/picanha.jpg',
  is_available: true,
  display_order: 1,
  created_at: '2026-04-17T10:00:00Z'
};
```

### Exemplo: Validação com Zod

```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  price: z.number().int().positive(),
  image_url: z.string().url().nullable(),
  is_available: z.boolean(),
  display_order: z.number().int().min(0),
  created_at: z.string().datetime()
});

type ProductInput = z.infer<typeof ProductSchema>;
```

### Exemplo: Uso em MenuData

```typescript
const menuData: MenuData = {
  restaurant: { id, name, slug, ... },
  categories: [
    {
      id: 'cat-001',
      restaurant_id: 'rest-001',
      name: 'Carnes',
      display_order: 1,
      created_at: '...',
      products: [
        {
          id: 'prod-001',
          category_id: 'cat-001',
          name: 'Picanha',
          price: 8900,
          is_available: true,
          // ...
        }
      ]
    }
  ]
};
```

---

## Regras de Implementação

1. **`price`** deve ser armazenado em centavos (formato integer) para evitar problemas de ponto flutuante
2. **`is_available`** controla visibilidade no cardápio público
3. **`display_order`** determina ordenação dentro da categoria
4. **`image_url`** pode ser `null`; implementar fallback visual
5. **`description`** pode ser `null`; UI deve tratar caso nulo
6. Produto sem estoque deve ter `is_available: false` (não deletar o registro)

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de tipos | 100% | Crítica |
| Uso de `any` | 0 ocorrências | Crítica |
| Validação Zod | Implementada | Alta |
| AGENTS.md existente | Sim | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| typescript | ^5 | Linguagem |
| zod | ^3 | Validação (futuro) |

---

## Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [RFC 2119 (requerimentos)](https://www.ietf.org/rfc/rfc2119.txt)
- Schema banco: `supabase/schema.sql` (tabela `products`)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent