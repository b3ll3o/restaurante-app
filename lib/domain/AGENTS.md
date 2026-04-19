# lib/domain/ - Domain Entities e Business Rules

## Status: NÃO IMPLEMENTADO

**Idioma**: Portugues Brasileiro (pt-BR)
**Stack**: N/A (modulo ainda nao criado)

---

## Visao Geral

O diretorio `lib/domain/` tem como responsabilidade centralizar:
- **Entidades de Domínio** (Restaurant, Category, Product, Order, OrderItem)
- **Regras de Negocio** (validacoes, calculos, transitons de estado)
- **Value Objects** (Money, Address, etc.)
- **Agregados e Raizes de Agregado**

**Estado Atual**: O modulo `lib/domain/` ainda nao foi criado. As entidades estao definidas apenas em `types/index.ts` como interfaces TypeScript, sem logica de negocio encapsulada.

---

## Estrutura de Diretórios (Planejada)

```
lib/domain/
AGENTS.md                    # Este arquivo
entities/                    # Entidades de dominio
  ├── Restaurant.ts          # Entidade Restaurant
  ├── Category.ts            # Entidade Category
  ├── Product.ts             # Entidade Product
  ├── Order.ts               # Entidade Order (Agregado)
  └── OrderItem.ts           # Value Object / Entidade
rules/                       # Regras de negocio
  ├── order-rules.ts         # Regras de pedido
  ├── product-rules.ts       # Regras de produto
  └── pricing-rules.ts       # Regras de precificacao
value-objects/               # Value Objects
  ├── Money.ts               # Representacao de monetario
  ├── OrderStatus.ts         # Status de pedido (value object)
  └── DisplayOrder.ts        # Ordem de exibicao
```

---

## Entidades de Domínio (Planejadas)

### Restaurant
- **Responsabilidade**: Representa um restaurante tenant
- **Regras**:
  - `slug` deve ser unico
  - `owner_whatsapp` deve ser valido

### Category
- **Responsabilidade**: Categorizacao de produtos
- **Regras**:
  - Pertence a um Restaurant
  - Possui `display_order` para ordenacao

### Product
- **Responsabilidade**: Item do cardapio
- **Regras**:
  - Pertence a uma Category
  - `price` deve ser >= 0
  - `is_available` controla disponibilidade

### Order (Agregado)
- **Responsabilidade**: Pedido realizado pelo cliente
- **Raiz de Agregado**: Order
- **Regras**:
  - Pertence a um Restaurant
  - Status: `pending` -> `confirmed` -> `cancelled`
  - `total` calculado a partir dos OrderItems

### OrderItem
- **Responsabilidade**: Item individual de um pedido
- **Regras**:
  - Pertence a um Order
  - `unit_price` * `quantity` = `total_price`

---

## Regras de Negocio (Planejadas)

### Order Rules
1. Um pedido so pode ter status alterado para `confirmed` se estiver `pending`
2. Um pedido so pode ter status alterado para `cancelled` se estiver `pending` ou `confirmed`
3. O total do pedido deve ser a soma dostotais dos OrderItems

### Product Rules
1. Um produto so pode ser removido se nao estiver em pedidos pendentes
2. A ordem de exibicao deve ser unica dentro de uma categoria

---

## Uso (Exemplo Planejado)

```typescript
// Exemplo futuro de uso
import { Order, OrderStatus } from 'lib/domain/entities/Order';
import { createOrderRules } from 'lib/domain/rules/order-rules';

const order = Order.create({
  restaurantId: 'uuid',
  customerName: 'Maria Silva',
  customerWhatsapp: '5511999999999',
  items: [...]
});

const rules = createOrderRules(order);
rules.confirm();
```

---

## Metricas de Qualidade

| Metrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura | >= 80% | Alta |
| Entidades com validacoes | 100% | Alta |
| Regras de negocio testadas | 100% | Alta |

---

## Dependencias

O modulo `lib/domain/` dependera de:
- `types/index.ts` (definicoes de tipos)
- Nenhuma dependencia externa (domínio puro)

---

## Proximos Passos

1. Criar estrutura de diretorios `lib/domain/`
2. Implementar entidades com validacoes
3. Implementar regras de negocio
4. Adicionar testes unitarios (>= 80% cobertura)
5. Criar arquivos `.feature` BDD com tags `@integration-test`

---

## Referencias

- `types/index.ts` - Tipos TypeScript atuais
- `types/AGENTS.md` - Documentacao de tipos
- `opencode/openspec/specs/pediai-specification.md` - Regras de negocio formalizadas

---

**Versao**: 1.0
**Ultima Atualizacao**: 2026-04-17
**Status**: Planejado (nao implementado)