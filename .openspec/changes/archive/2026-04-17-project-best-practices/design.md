# Design: Project Best Practices Adoption

## Technical Approach

**Estratégia**: Criação incremental de utilitários sem modificação de código existente. Cada artefato é autocontido e pode ser adotado progressivamente.

---

## Architecture Decisions

### Decision 1: Result Type como Union Type Discriminated

**Choice**: `{ ok: true, value: R } | { ok: false, error: L }`

**Alternatives Considered**:
- `neverthrow` library: Overkill para kebutuhan proyecto, adiciona dependência pesada
- `ts-results`: Similar, mas não tem suporte a TypeScript 5.x strict mode nativo
- Class-based Result: Mais verboso, não pode ser extendido

**Rationale**: Union type discriminated é a solução mais leve e tipicamente correta para TypeScript strict mode. Inferência de tipos funciona naturalmente com `if (result.ok)`.

### Decision 2: Zod Schemas em `lib/schemas/` como Arquivos Individuais

**Choice**: Um arquivo por schema (`lib/schemas/restaurant.ts`, `lib/schemas/category.ts`, etc.)

**Alternatives Considered**:
- Arquivo único `lib/schemas.ts`: Fica muito grande, difícil de manter
- `lib/domain/schemas/`: Mistura com código de domínio

**Rationale**: `lib/schemas/` mantém separação clara entre validação (Zod) e lógica de negócio. Arquivos individuais permitem importações granulares e tree-shaking.

### Decision 3: ADR em `docs/adr/` (não em `.openspec/`)

**Choice**: `docs/adr/` para ADRs de decisão de arquitetura

**Alternatives Considered**:
- `.openspec/adr/`: Mistura com спецификации SDD, ADR é documentação de código
- `docs/adr/` no root: Arquivos de documentação geralmente vão em `docs/`

**Rationale**: ADRs são documentação técnica que pertence ao projeto (`docs/`), não ao processo SDD (`.openspec/`). Facilita leitura por desenvolvedores.

### Decision 4: Error Boundary como Componente Stateless

**Choice**: Error Boundary com `getDerivedStateFromError` + `componentDidCatch` em `components/error-boundary.tsx`

**Alternatives Considered**:
- Higher-order component: Overkill
- Hook `useErrorHandler`: Não funciona com Error Boundary clássica

**Rationale**: Error Boundary precisa ser classe (React requirement). Componente simples com props para `fallback` e `onError` callback.

---

## Data Flow

### Result Type Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Função    │ ──▶ │  Promise<T>  │ ──▶ │ fromPromise()   │
│ retorna T   │     └──────────────┘     │ Result<T, Error>│
└─────────────┘                          └────────┬────────┘
                                                   │
                                          ┌────────┴────────┐
                                          │                 │
                                     ok: true         ok: false
                                          │                 │
                                          ▼                 ▼
                                    result.value      result.error
```

### Zod Validation Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Dados     │ ──▶ │ Schema.parse │ ──▶ │ Valid (type)    │
│   Brutos    │     └──────────────┘     └─────────────────┘
│  (API, etc) │                                │
└─────────────┘                                │ throws ZodError
                                              ▼
                                    ┌─────────────────┐
                                    │ Catch ZodError  │
                                    │ Return Error    │
                                    └─────────────────┘

         ┌──────────────┐     ┌─────────────────┐
         │Schema.safeParse│ ─▶ │ Result< T,      │
         └──────────────┘     │ ZodError>        │
                              └─────────────────┘
```

---

## File Changes

### Novos Arquivos (Criar)

| Arquivo | Descrição |
|---------|-----------|
| `lib/result.ts` | Tipo Result/Either com utilitários |
| `lib/schemas/restaurant.ts` | Schema Zod para Restaurant |
| `lib/schemas/category.ts` | Schema Zod para Category |
| `lib/schemas/product.ts` | Schema Zod para Product |
| `lib/schemas/order.ts` | Schema Zod para Order |
| `lib/schemas/order-item.ts` | Schema Zod para OrderItem |
| `lib/schemas/index.ts` | Barrel export para schemas |
| `components/error-boundary.tsx` | React Error Boundary |
| `docs/adr/template.md` | Template para novos ADRs |
| `docs/adr/0001-why-result-type.md` | Primeiro ADR |
| `tests/unit/result.test.ts` | Testes unitários para Result type |

### Arquivos Modificados

| Arquivo | Modificação |
|---------|-------------|
| `package.json` | Adicionar dependência `zod` |
| `lib/AGENTS.md` | Atualizar com documentação de Result type e Zod |

### Arquivos Não Modificados (Escopo excluded)

- Todo código de produção existente
- Estrutura de pastas (`app/`, `components/admin/`, etc.)
- Configurações de build

---

## Interfaces / Contracts

### Result Type Contract

```typescript
// lib/result.ts

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

### Zod Schema Contract

```typescript
// lib/schemas/restaurant.ts
import { z } from 'zod';

export const restaurantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  owner_whatsapp: z.string().regex(/^\d{10,15}$/),
});

export type RestaurantInput = z.infer<typeof restaurantSchema>;
```

### Error Boundary Contract

```typescript
// components/error-boundary.tsx

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorState> {
  static getDerivedStateFromError(error: Error): { hasError: boolean };
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
  reset(): void;
}
```

---

## Testing Strategy

### Unit Tests para Result Type

Testes devem cover:
- `ok()` cria resultado de sucesso
- `err()` cria resultado de erro
- `isOk()` retorna true para sucesso
- `isErr()` retorna true para erro
- `map()` aplica função no valor
- `mapErr()` aplica função no erro
- `unwrap()` retorna valor ou lança
- `unwrapOr()` retorna valor ou default
- `fromPromise()` converte Promise

**Ferramenta**: Vitest
**Localização**: `tests/unit/result.test.ts`
**Cobertura**: 100% branches

### Testes para Zod Schemas

Testes devem cover:
- Validação de dados válidos
- Rejeição de dados inválidos com ZodError
- Inferência de tipo correta

**Ferramenta**: Vitest
**Localização**: `tests/unit/schemas/` (criar)

---

## Migration / Rollout

### Fase 1: Result Type (sem dependentes)
1. Criar `lib/result.ts`
2. Criar `tests/unit/result.test.ts`
3. Verificar que build passa

### Fase 2: Zod Schemas (sem dependentes)
1. Adicionar `zod` ao `package.json`
2. Criar `lib/schemas/*.ts`
3. Verificar que build passa

### Fase 3: Error Boundary
1. Criar `components/error-boundary.tsx`
2. Verificar que build passa

### Fase 4: ADR Documentation
1. Criar `docs/adr/template.md`
2. Criar `docs/adr/0001-why-result-type.md`
3. Atualizar `lib/AGENTS.md`

### Rollback
Cada fase pode ser rollada back individualmente removendo os arquivos criados.

---

## Open Questions

| Pergunta | Status | Decisão |
|----------|--------|---------|
| Zod 3.x vs 4.x? | Aberto | Usar 3.x (stable, amplamente usado) |
| Error Boundary com fallback via props ou children? | Fechado | Props `fallback` e `onError` callback |
| Testes para schemas devem ser em `tests/unit/` ou junto ao schema? | Fechado | `tests/unit/` (manter co-location com outros testes) |

---

## Dependencies

| Dependência | Versão | Motivo |
|-------------|--------|--------|
| zod | ^3.23.0 | Runtime validation, inferência de tipos |

---

## Deprecation Strategy

### Código Antigo (Fora de Escopo)
Código existente que usa `throw` para error handling **NÃO** será modificado nesta change. Pode ser migrado incrementalmente em changes futuras.

### Adoção de Result Type
Novas funções devem usar Result type. Funções existentes podem ser envoltas (wrapped) gradualmente.

### Zod Validation
Validação de dados externos (API responses, form data) deve usar Zod. Validação de dados internos pode continuar com TypeScript types.

---

## Compliance Checklist

- [x] Result type implementado conforme REQ-BP-01 e REQ-BP-02
- [x] Zod schemas implementados conforme REQ-BP-03
- [x] Error boundary implementado conforme REQ-BP-04
- [x] ADR criado conforme REQ-BP-05
- [x] Build passa com zero erros
- [x] Lint passa com zero erros