/**
 * Result Type (Either) para error handling funcional
 *
 * Implementação de padrão Result/Either para TypeScript com suporte a:
 * - Union types discriminated para inference automática
 * - Mappers (map, mapErr)
 * - Unwrappers (unwrap, unwrapOr)
 * - Conversão de Promises (fromPromise)
 *
 * @module lib/result
 * @filesource
 */

import { z } from 'zod';

/**
 * Tipo Result representa o resultado de uma operação que pode falhar.
 *
 * @template L - Tipo do erro (left)
 * @template R - Tipo do valor de sucesso (right)
 *
 * @example
 * ```typescript
 * const success: Result<string, number> = ok(42);
 * const failure: Result<string, number> = err("error message");
 * ```
 */
export type Result<L, R> = { ok: true; value: R } | { ok: false; error: L };

/**
 * Tipo para ZodError customizado do Result type
 */
export const resultErrorSchema = z.object({
  kind: z.literal('ResultError'),
  message: z.string(),
});

export type ResultError = z.infer<typeof resultErrorSchema>;

/**
 * Cria um Result de sucesso
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor
 * @param value - Valor de sucesso
 * @returns Result com ok: true e value preenchido
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * // { ok: true, value: 42 }
 * ```
 */
export function ok<L = never, R = unknown>(value: R): Result<L, R> {
  return { ok: true, value };
}

/**
 * Cria um Result de erro
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor
 * @param error - Valor de erro
 * @returns Result com ok: false e error preenchido
 *
 * @example
 * ```typescript
 * const result = err("falha ao processar");
 * // { ok: false, error: "falha ao processar" }
 * ```
 */
export function err<L, R = unknown>(error: L): Result<L, R> {
  return { ok: false, error };
}

/**
 * Type guard para verificar se Result é sucesso
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor
 * @param result - Result a ser verificado
 * @returns true se Result é sucesso
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * if (isOk(result)) {
 *   console.log(result.value); // TypeScript sabe que value existe
 * }
 * ```
 */
export function isOk<L, R>(result: Result<L, R>): result is { ok: true; value: R } {
  return result.ok === true;
}

/**
 * Type guard para verificar se Result é erro
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor
 * @param result - Result a ser verificado
 * @returns true se Result é erro
 *
 * @example
 * ```typescript
 * const result = err("falha");
 * if (isErr(result)) {
 *   console.log(result.error); // TypeScript sabe que error existe
 * }
 * ```
 */
export function isErr<L, R>(result: Result<L, R>): result is { ok: false; error: L } {
  return result.ok === false;
}

/**
 * Mapeia o valor de um Result de sucesso
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor original
 * @template T - Tipo do valor mapeado
 * @param result - Result a ser mapeado
 * @param fn - Função de mapeamento
 * @returns Novo Result com valor mapeado ou erro original
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * const mapped = map(result, (value) => value * 2);
 * // { ok: true, value: 84 }
 *
 * const errorResult = err("falha");
 * const mappedError = map(errorResult, (value) => value * 2);
 * // { ok: false, error: "falha" } - valor não é mapeado
 * ```
 */
export function map<L, R, T>(result: Result<L, R>, fn: (value: R) => T): Result<L, T> {
  if (isOk(result)) {
    return ok(fn(result.value));
  }
  return result as Result<L, T>;
}

/**
 * Mapeia o erro de um Result de erro
 *
 * @template L - Tipo do erro original
 * @template R - Tipo do valor
 * @template T - Tipo do erro mapeado
 * @param result - Result a ser mapeado
 * @param fn - Função de mapeamento
 * @returns Novo Result com erro mapeado ou valor original
 *
 * @example
 * ```typescript
 * const result = err("falha original");
 * const mapped = mapErr(result, (error) => new Error(error));
 * // { ok: false, error: Error("falha original") }
 *
 * const successResult = ok(42);
 * const mappedSuccess = mapErr(successResult, (error) => new Error(error));
 * // { ok: true, value: 42 } - erro não é mapeado
 * ```
 */
export function mapErr<L, R, T>(result: Result<L, R>, fn: (error: L) => T): Result<T, R> {
  if (isErr(result)) {
    return err(fn(result.error));
  }
  return result as Result<T, R>;
}

/**
 * Extrai o valor de um Result ou lança erro
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor
 * @param result - Result a ser extraído
 * @returns Valor do Result
 * @throws Error com mensagem do erro se Result é erro
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * const value = unwrap(result);
 * // 42
 *
 * const errorResult = err("falha");
 * const value = unwrap(errorResult);
 * // throws Error("falha")
 * ```
 */
export function unwrap<L, R>(result: Result<L, R>): R {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(String(result.error));
}

/**
 * Extrai o valor de um Result ou retorna valor default
 *
 * @template L - Tipo do erro
 * @template R - Tipo do valor
 * @param result - Result a ser extraído
 * @param defaultValue - Valor default caso Result seja erro
 * @returns Valor do Result ou defaultValue
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * const value = unwrapOr(result, 0);
 * // 42
 *
 * const errorResult = err("falha");
 * const value = unwrapOr(errorResult, 0);
 * // 0
 * ```
 */
export function unwrapOr<L, R>(result: Result<L, R>, defaultValue: R): R {
  if (isOk(result)) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Converte uma Promise para um Result
 *
 * @template L - Tipo do erro (padrão: Error)
 * @template R - Tipo do valor da Promise
 * @param promise - Promise a ser convertida
 * @returns Promise com Result
 *
 * @example
 * ```typescript
 * const promise = fetch('/api/data');
 * const result = await fromPromise(promise);
 * if (isOk(result)) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function fromPromise<L = Error, R = unknown>(
  promise: Promise<R>
): Promise<Result<L, Error>> {
  try {
    const value = await promise;
    return ok(value) as Result<L, Error>;
  } catch (error) {
    return err(error as Error) as Result<L, Error>;
  }
}

/**
 * Converte um ZodSchema para um Result
 *
 * @template T - Tipo inferido do schema
 * @param schema - Schema Zod
 * @param data - Dados a serem validados
 * @returns Result com dados validados ou ZodError
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * const schema = z.object({ name: z.string() });
 * const result = fromZod(schema, { name: "João" });
 * if (isOk(result)) {
 *   console.log(result.value);
 * }
 * ```
 */
export function fromZod<T>(schema: z.ZodSchema<T>, data: unknown): Result<T, z.ZodError<unknown>> {
  const result = schema.safeParse(data);
  if (result.success) {
    return ok(result.data) as Result<T, z.ZodError<unknown>>;
  }
  return err(result.error) as Result<T, z.ZodError<unknown>>;
}

// Re-export ZodError for convenience
export { z };

/**
 * Tipo utilitário para unwrap assíncrono
 */
export type AsyncResult<L, R> = Promise<Result<L, R>>;
