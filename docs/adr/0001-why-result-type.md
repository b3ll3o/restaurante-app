# ADR-0001: Adoção de Result Type (Either) para Error Handling

## Status

Aceito

## Contexto

O projeto MenuLink utiliza TypeScript com strict mode para garantir type safety em toda a aplicação. Однако, atualmente o projeto depende principalmente de `throw/catch` para error handling, o que apresenta alguns problemas:

### Problemas Identificados

1. **TypeScript não força tratamento de erros**: O compilador não sabe quais funções podem lançar exceções, levando a erros de runtime não tratados.

2. **Error handling invisível**: O fluxo de erros não é explícito no tipo das funções. Uma função pode falhar silenciosamente.

3. **Mistura de tipos**: Funções que retornam dados ou lançam exceções não têm assinatura que reflita essa possibilidade.

4. **Debugging difícil**: Stack traces de exceções são menos informativos sobre o tipo de erro em operações assíncronas.

### Forces Acting

- **Type safety**: Precisamos de erro em tempo de compilação para erros esperados
- **Ergonomia**: A solução deve ser fácil de usar e não verbosa demais
- **Ecossistema**: Deve funcionar bem com async/await e Promises
- **Adoção incremental**: Não podemos reescrever todo o código existente de uma vez

## Decisão

Adotar o padrão **Result Type (Either)** para error handling funcional em TypeScript, implementado em `lib/result.ts`.

### Definição do Tipo

```typescript
type Result<L, R> = { ok: true; value: R } | { ok: false; error: L };
```

### Interface Pública

```typescript
// Construtores
function ok<L = never, R = unknown>(value: R): Result<L, R>;
function err<L, R = unknown>(error: L): Result<L, R>;

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

## Alternativas Consideradas

### 1. Continuar com throw/catch

**Descrição**: Manter o padrão atual de exceções para error handling.

**Prós**:
- Nenhuma mudança necessária
- Familiar para desenvolvedores acostumados com linguagens tradicionais

**Contras**:
- TypeScript não força tratamento de erros
- Erros esperados não são diferenciados de erros de programação
- Difícil de testar sem mocks

**Decisão**: Rejeitada

**Justificativa**: Não resolve os problemas de type safety e leva a erros de runtime não tratados.

### 2. Usar biblioteca `neverthrow`

**Descrição**: Adotar a biblioteca `neverthrow` que implementa Result type com funcionalidades avançadas.

**Prós**:
- Implementação completa e testada
- Suporte a chaining, railroads
- Éc3 Typescript-first

**Contras**:
- Adiciona dependência externa (~15kb)
- Algumas features são over-engineering para nossas necessidades
- Pode conflitar com versões futuras do TypeScript

**Decisão**: Rejeitada

**Justificativa**: Para as necessidades do MenuLink, uma implementação simples é suficiente. Adicionar dependência externa aumenta bundle size sem benefícios proporcionais.

### 3. Usar biblioteca `ts-results`

**Descrição**: Adotar `ts-results` como alternativa mais leve.

**Prós**:
- Leve (~2kb)
- Simples e direto
- Tipos bem definidos

**Contras**:
- Não é mantido ativamente
- Não tem suporte nativo a Promise/async

**Decisão**: Rejeitada

**Justificativa**: A implementação própria nos dá controle total e permite customização para casos específicos do MenuLink.

## Consequências

### Positivas

- **Type safety explícita**: Funções que podem falhar declaram isso em seu tipo
- **Compilador ajuda**: TypeScript exige tratamento de erros em branches
- **Código mais previsível**: Erros são valores, não excepciones surpresa
- **Testabilidade**: Easy de testar semtry/catch
- **Funciona com async**: `fromPromise` integra bem com Promises

### Negativas

- **Código mais verboso**: Verificar `result.ok` em todo lugar pode ser cansativo
- **Breaking change**: Novos códigos devem adotar o padrão
- **Curva de aprendizado**: time precisa aprender o padrão
- **Migração gradual**: Código existente não é automaticamente migrado

### Neutral

- **Padronização**: Todos os módulos devem usar o mesmo padrão de erro
- **Documentação**: Necessário documentar quando usar Result vs throw

## Implementação

### Passos de Implementação

1. [x] Criar `lib/result.ts` com tipo e utilitários (Concluído em 2026-04-17)
2. [x] Criar testes unitários para `lib/result.ts`
3. [ ] Adotar Result type em novas funcionalidades
4. [ ] Migrar gradualmente funcionalidades críticas

### Arquivos Criados

- `lib/result.ts` — Tipo Result e utilitários
- `tests/unit/lib/result.test.ts` — 48 testes unitários

## Referências

- [Designing with types: Making illegal states unrepresentable](https://fsharpforfunandprofit.com/series/designing-with-types.html) — Artigo sobre type-driven design
- [Error Handling in TypeScript](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) — Union types em TypeScript
- [Result type pattern](https://github.com/unsplash/result) — Discussão sobre Result type
- [Why you shouldn't use throw for errors](https://kentcdodds.com/blog/elegant-errors-with-sum-types) — Artigo sobre error handling funcional
