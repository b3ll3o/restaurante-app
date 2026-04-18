# Library (lib/) - MenuLink

## Visão Geral

O módulo **Library** (`lib/`) contém utilitários, serviços e clientes de infraestrutura reutilizáveis em toda a aplicação.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: TypeScript (strict) + Supabase + WhatsApp API

---

## Estrutura de Diretórios

```
lib/
├── utils.ts          # Funções utilitárias (formatação, validação, slugs)
├── result.ts         # Tipo Result/Either para error handling funcional
├── whatsapp.ts       # Serviço de integração WhatsApp API
├── sanitize.ts       # Sanitização de inputs
├── constants.ts      # Constantes globais
├── analytics.ts      # Analytics tracking
└── supabase/         # Clientes Supabase (browser + server)
│   ├── client/       # Cliente browser (Client Components)
│   └── server/       # Cliente server (Server Components + API Routes)
└── schemas/          # Zod schemas para validação runtime
    ├── index.ts      # Barrel exports
    ├── restaurant.ts # Schema Restaurant
    ├── category.ts   # Schema Category
    ├── product.ts    # Schema Product
    ├── order.ts      # Schema Order
    └── order-item.ts # Schema OrderItem
```

---

## Sub-módulos

| Sub-módulo | Arquivo | Responsabilidade |
|------------|---------|------------------|
| **Utils** | `lib/utils.ts` | Funções utilitárias puras |
| **Result** | `lib/result.ts` | Tipo Result/Either para error handling funcional |
| **Schemas** | `lib/schemas/` | Zod schemas para validação runtime |
| **WhatsApp** | `lib/whatsapp.ts` | Integração WhatsApp API |
| **Supabase** | `lib/supabase/` | Clientes database/auth (client + server) |

### Sub-módulo: Result Type (`lib/result.ts`)

#### Responsabilidade

Implementar o tipo `Result<L, R>` (Either) para error handling funcional em TypeScript, permitindo que operações que podem falhar retornem um tipo que explicita sucesso ou erro.

#### Arquitetura

```typescript
type Result<L, R> = { ok: true; value: R } | { ok: false; error: L };

// Construtores
function ok<L, R>(value: R): Result<L, R>;
function err<L, R>(error: L): Result<L, R>;

// Type guards
function isOk<L, R>(result: Result<L, R>): result is { ok: true; value: R };
function isErr<L, R>(result: Result<L, R>): result is { ok: false; error: L };

// Mappers
function map<L, R, T>(result: Result<L, R>, fn: (value: R) => T): Result<L, T>;
function mapErr<L, R, T>(result: Result<L, R>, fn: (error: L) => T): Result<T, R>;

// Unwrap
function unwrap<L, R>(result: Result<L, R>): R;
function unwrapOr<L, R>(result: Result<L, R>, defaultValue: R): R;

// Async
function fromPromise<L, R>(promise: Promise<R>): Promise<Result<L, Error>>;
```

#### Uso

```typescript
import { ok, err, isOk, isErr, map, fromPromise } from '@/lib/result';

// Exemplo: Função que pode falhar
function divide(a: number, b: number): Result<string, number> {
  if (b === 0) return err('Divisão por zero');
  return ok(a / b);
}

// Uso com type guards
const result = divide(10, 2);
if (isOk(result)) {
  console.log(result.value); // 5
} else {
  console.error(result.error);
}

// Uso com mappers
const doubled = map(ok(5), (v) => v * 2); // { ok: true, value: 10 }

// Uso com Promises
async function fetchData() {
  const result = await fromPromise(fetch('/api/data').then(r => r.json()));
  if (isOk(result)) {
    return result.value;
  }
  throw result.error;
}
```

#### Regras de Implementação

1. **Novas funções que podem falhar DEVEM usar Result type**
2. **Funções existentes podem gradualmente migrar para Result type**
3. **Não usar throw para erros esperados (validação, etc.)**
4. **Usar throw apenas para erros de programming (bugs)**

### Sub-módulo: Schemas (`lib/schemas/`)

#### Responsabilidade

Fornecer schemas Zod para validação runtime de dados de domínio, garantindo que dados externos (API, forms) sejam validados antes de uso.

#### Arquitetura

Cada entidade de domínio possui seu próprio schema:

```
lib/schemas/
├── index.ts           # Barrel exports
├── restaurant.ts      # RestaurantSchema + create + update
├── category.ts        # CategorySchema + create + update
├── product.ts         # ProductSchema + create + update
├── order.ts           # OrderSchema + create + update + enums
└── order-item.ts      # OrderItemSchema + create
```

#### Uso

```typescript
import {
  restaurantSchema,
  validateRestaurant,
  validateCreateRestaurant,
  productSchema,
  validateProduct,
} from '@/lib/schemas';

// Validação simples
const result = validateProduct(data);
if (result.ok) {
  const product = result.value; // ProductInput validado
} else {
  const errors = result.error.issues; // ZodError issues
}

// Com fromZod (Result type)
import { fromZod } from '@/lib/result';
const result = fromZod(productSchema, data);
if (isOk(result)) {
  console.log(result.value);
}
```

#### Regras de Implementação

1. **Dados de API DEVEM ser validados com schemas Zod**
2. **Dados de form DEVEM ser validados antes de submissão**
3. **Schemas DEVEM ser exportados de `lib/schemas/index.ts`**
4. **Cada schema deve ter `validate*` e `create*` functions**

### Documentação Detalhada

Cada sub-módulo possui seu próprio `AGENTS.md`:

- `lib/utils/AGENTS.md`
- `lib/whatsapp/AGENTS.md`
- `lib/supabase/AGENTS.md` - Visão geral
  - `lib/supabase/client/AGENTS.md` - Cliente browser
  - `lib/supabase/server/AGENTS.md` - Cliente server

---

## Dependências Globais

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | SSR auth |
| @supabase/supabase-js | ^2.103.0 | Cliente DB |
| clsx | ^2.1.1 | Concatenação classes |
| tailwind-merge | ^3.5.0 | Merge classes |
| zod | ^4.3.6 | Runtime validation |
| react | 19.2.4 | UI framework |
| next | 16.2.3 | Full-stack framework |

---

## Melhores Práticas

### Error Handling com Result Type

1. **Prefira Result type para operações que podem falhar**
2. **Use type guards para verificar resultado antes de usar valor**
3. **Evite `unwrap()` em código de produção — use `unwrapOr()` ou type guards**
4. **Para Promises, use `fromPromise()` para converter a Promise

### Validação com Zod

1. **Valide dados externos (API, forms) antes de usar**
2. **Use schemas específicos para cada caso de uso (create, update)**
3. **Trate ZodError para fornecer feedback ao usuário**
4. **Combine Zod com Result type usando `fromZod()`**

---

**Versão**: 1.3
**Última Atualização**: 2026-04-17
**Autor**: AI Agent