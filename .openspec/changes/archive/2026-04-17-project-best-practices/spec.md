# Spec: Project Best Practices Adoption

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e adiciona requisitos de melhores práticas à spec principal.

---

## Requisitos Adicionados

### REQ-BP-01: Result Type (Either) para Error Handling

O projeto **DEVE** implementar um tipo Result (Either) em `lib/result.ts` para representrar operações que podem falhar.

#### Cenário: Result representa sucesso
- **GIVEN** uma operação que retorna `Result<Success, Error>`
- **WHEN** a operação succeed
- **THEN** o resultado **DEVE** ter `ok: true` e `value: Success`

#### Cenário: Result representa falha
- **GIVEN** uma operação que retorna `Result<Success, Error>`
- **WHEN** a operação falha
- **THEN** o resultado **DEVE** ter `ok: false` e `error: Error`

#### Cenário: TypeScript infere tipos corretamente
- **GIVEN** uma função que retorna `Result<User, string>`
- **WHEN** o código verifica `result.ok`
- **THEN** TypeScript **DEVE** inferir `result.value` como `User` no branch true

---

### REQ-BP-02: Utilitários de Tipo Result

O arquivo `lib/result.ts` **DEVE** exportar os seguintes utilitários:

#### Função: `ok(result)`
- **GIVEN** um `Result<L, R>`
- **WHEN** `ok(result)` é chamado
- **THEN** **DEVE** retornar `true` se `result.ok === true`

#### Função: `err(result)`
- **GIVEN** um `Result<L, R>`
- **WHEN** `err(result)` é chamado
- **THEN** **DEVE** retornar `true` se `result.ok === false`

#### Função: `map(result, fn)`
- **GIVEN** um `Result<L, R>` com `ok: true` e um mapping function `fn: (value: R) => T`
- **WHEN** `map(result, fn)` é chamado
- **THEN** **DEVE** retornar `Result<L, T>` com o valor mapeado

#### Função: `mapErr(result, fn)`
- **GIVEN** um `Result<L, R>` com `ok: false` e um mapping function `fn: (error: L) => T`
- **WHEN** `mapErr(result, fn)` é chamado
- **THEN** **DEVE** retornar `Result<T, R>` com o erro mapeado

#### Função: `unwrap(result)`
- **GIVEN** um `Result<L, R>` com `ok: true`
- **WHEN** `unwrap(result)` é chamado
- **THEN** **DEVE** retornar o `value`
- **WHEN** `result.ok === false`
- **THEN** **DEVE** lançar erro com a mensagem do `error`

#### Função: `unwrapOr(result, defaultValue)`
- **GIVEN** um `Result<L, R>` e um valor default
- **WHEN** `unwrapOr(result, defaultValue)` é chamado
- **THEN** **DEVE** retornar `value` se `ok: true`
- **THEN** **DEVE** retornar `defaultValue` se `ok: false`

#### Função: `fromPromise(promise)`
- **GIVEN** uma `Promise<T>`
- **WHEN** `fromPromise(promise)` é chamado
- **THEN** **DEVE** retornar `Promise<Result<T, Error>>`

---

### REQ-BP-03: Zod Schemas para Validação Runtime

O projeto **DEVE** implementar schemas Zod em `lib/schemas/` para validação de entidades de domínio.

#### Schema: Restaurant
- **DEVE** validar campos: `id` (uuid), `name` (string, 1-100 chars), `slug` (string, lowercase, alphanumeric with hyphens), `owner_whatsapp` (string, valid WhatsApp format)

#### Schema: Category
- **DEVE** validar campos: `id` (uuid), `restaurant_id` (uuid), `name` (string, 1-50 chars), `display_order` (number, >= 0)

#### Schema: Product
- **DEVE** validar campos: `id` (uuid), `category_id` (uuid), `name` (string, 1-100 chars), `description` (string, optional, max 500 chars), `price` (number, >= 0), `image_url` (string, optional, valid url), `is_available` (boolean), `display_order` (number, >= 0)

#### Schema: Order
- **DEVE** validar campos: `id` (uuid), `restaurant_id` (uuid), `customer_name` (string, 1-100 chars), `customer_whatsapp` (string, valid WhatsApp), `total` (number, >= 0), `status` (enum: pending, confirmed, cancelled), `payment_method` (enum: pix, cash, card)

#### Schema: OrderItem
- **DEVE** validar campos: `id` (uuid), `order_id` (uuid), `product_id` (uuid), `product_name` (string), `unit_price` (number, >= 0), `quantity` (number, integer, >= 1), `total_price` (number, >= 0)

---

### REQ-BP-04: Error Boundary Component

O projeto **DEVE** implementar um React Error Boundary em `components/error-boundary.tsx`.

#### Cenário: Error Boundary captura erro de renderização
- **GIVEN** um componente-filho que lança erro durante renderização
- **WHEN** o erro ocorre
- **THEN** o Error Boundary **DEVE** capturar o erro
- **AND** **DEVE** renderizar UI de fallback em vez do componente quebrado

#### Cenário: Error Boundary expõe método reset
- **GIVEN** um Error Boundary com estado de erro
- **WHEN** `reset()` é chamado
- **THEN** **DEVE** limpar o erro e permitir re-renderização

#### Cenário: Error Boundary loga erros
- **GIVEN** um Error Boundary que captura erro
- **WHEN** `componentDidCatch(error, errorInfo)` é chamado
- **THEN** **DEVE** logar o erro com `console.error`

---

### REQ-BP-05: ADR (Architecture Decision Records)

O projeto **DEVE** criar diretório `docs/adr/` com template e primeiro ADR.

#### Template ADR
Cada ADR **DEVE** conter:
- **Número**: 0001, 0002, etc.
- **Título**: Descrição curta da decisão
- **Status**: Proposed, Accepted, Deprecated
- **Contexto**: Situação que motivou a decisão
- **Decisão**: O que foi decidido
- **Consequências**: Próprias (positivas e negativas)
- **Referências**: Links ou documentos de referência

#### ADR-0001: Why Result Type
O primeiro ADR **DEVE** documentar:
- **Contexto**: Necesidade de error handling tipado em TypeScript
- **Decisão**: Adotar padrão Result/Either similar a `neverthrow`
- **Alternativas Consideradas**: throw exceptions, null/undefined, Option type
- **Consequências**: Error handling explícito, código mais verboso, melhor debug

---

## Critérios de Aceitação

### CA-BP-01: Result Type Completo
O tipo `Result<L, R>` **DEVE** ser implementado como union type:
```typescript
type Result<L, R> = { ok: true; value: R } | { ok: false; error: L };
```

### CA-BP-02: Result Type Inferência
TypeScript **DEVE** inferir tipos corretamente em branches `if (result.ok)` / `else`.

### CA-BP-03: Zod Schema Exports
Cada schema **DEVE** ser exportado como `z.ZodSchema` de arquivo individual em `lib/schemas/`.

### CA-BP-04: Zod Schema Validação
Cada schema **DEVE** ter método `.parse()` e `.safeParse()` funcionais.

### CA-BP-05: Error BoundarygetDerivedStateFromError
O componente Error Boundary **DEVE** implementar `static getDerivedStateFromError(error)`.

### CA-BP-06: Error Boundary componentDidCatch
O componente Error Boundary **DEVE** implementar `componentDidCatch(error, errorInfo)`.

### CA-BP-07: ADR Template Presente
O arquivo `docs/adr/template.md` **DEVE** existir com estrutura completa.

### CA-BP-08: ADR-0001 Criado
O arquivo `docs/adr/0001-why-result-type.md` **DEVE** existir com conteúdo completo.

### CA-BP-09: Build Passa
`npm run build` **DEVE** executar sem erros.

### CA-BP-10: Lint Passa
`npm run lint` **DEVE** executar com 0 erros.

---

## Dependências

| Dependência | Versão Mínima | Uso |
|-------------|---------------|-----|
| zod | 3.x | Runtime validation |
| typescript | 5.x | Strict mode (já configurado) |

---

## Status

Especificação