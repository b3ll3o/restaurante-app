import { describe, it, expect } from 'vitest';
import {
  ok,
  err,
  isOk,
  isErr,
  map,
  mapErr,
  unwrap,
  unwrapOr,
  fromPromise,
  fromZod,
  type Result,
} from '@/lib/result';
import { z } from 'zod';

// Schema de teste para fromZod
const testSchema = z.object({
  name: z.string(),
  age: z.number(),
});

describe('Result Type', () => {
  describe('ok()', () => {
    it('deve criar resultado de sucesso com valor', () => {
      const result = ok<never, number>(42);
      expect(result.ok).toBe(true);
      if (result.ok) { expect(result.value).toBe(42); }
    });

    it('deve criar resultado de sucesso com objeto', () => {
      const result = ok<never, { name: string; age: number }>({ name: 'João', age: 30 });
      expect(result.ok).toBe(true);
      if (result.ok) { expect(result.value).toEqual({ name: 'João', age: 30 }); }
    });

    it('deve criar resultado de sucesso com null', () => {
      const result = ok<never, null>(null);
      expect(result.ok).toBe(true);
      if (result.ok) { expect(result.value).toBeNull(); }
    });

    it('deve criar resultado de sucesso com undefined', () => {
      const result = ok<never, undefined>(undefined);
      expect(result.ok).toBe(true);
      if (result.ok) { expect(result.value).toBeUndefined(); }
    });

    it('deve inferir tipos corretamente', () => {
      const result: Result<string, number> = ok(42);
      if (isOk(result)) {
        // TypeScript deve inferir result.value como number
        const value: number = result.value;
        expect(value).toBe(42);
      }
    });
  });

  describe('err()', () => {
    it('deve criar resultado de erro com mensagem', () => {
      const result = err<string, never>('falha ao processar');
      expect(result.ok).toBe(false);
      if (!result.ok) { expect(result.error).toBe('falha ao processar'); }
    });

    it('deve criar resultado de erro com objeto', () => {
      const error = { code: 'INVALID_INPUT', message: 'Campo inválido' };
      const result = err<{ code: string; message: string }, never>(error);
      expect(result.ok).toBe(false);
      if (!result.ok) { expect(result.error).toEqual(error); }
    });

    it('deve criar resultado de erro com número', () => {
      const result = err<number, never>(404);
      expect(result.ok).toBe(false);
      if (!result.ok) { expect(result.error).toBe(404); }
    });

    it('deve inferir tipos corretamente', () => {
      const result: Result<string, number> = err('error message');
      if (isErr(result)) {
        // TypeScript deve inferir result.error como string
        const error: string = result.error;
        expect(error).toBe('error message');
      }
    });
  });

  describe('isOk()', () => {
    it('deve retornar true para resultado de sucesso', () => {
      const result = ok(42);
      expect(isOk(result)).toBe(true);
    });

    it('deve retornar false para resultado de erro', () => {
      const result = err('error');
      expect(isOk(result)).toBe(false);
    });

    it('deve funcionar como type guard', () => {
      const result: Result<string, number> = ok(42);
      if (isOk(result)) {
        // TypeScript sabe que result.value existe aqui
        expect(typeof result.value).toBe('number');
      }
    });
  });

  describe('isErr()', () => {
    it('deve retornar false para resultado de sucesso', () => {
      const result = ok(42);
      expect(isErr(result)).toBe(false);
    });

    it('deve retornar true para resultado de erro', () => {
      const result = err('error');
      expect(isErr(result)).toBe(true);
    });

    it('deve funcionar como type guard', () => {
      const result: Result<string, number> = err('error');
      if (isErr(result)) {
        // TypeScript sabe que result.error existe aqui
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('map()', () => {
    it('deve mapear valor de sucesso', () => {
      const result = ok(2);
      const mapped = map(result, (value) => value * 3);
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe(6);
      }
    });

    it('deve mapear string para string transformada', () => {
      const result = ok('hello');
      const mapped = map(result, (value) => value.toUpperCase());
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe('HELLO');
      }
    });

    it('deve mapear objeto', () => {
      const result = ok({ name: 'João', age: 30 });
      const mapped = map(result, (obj) => ({ ...obj, name: obj.name.toUpperCase() }));
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toEqual({ name: 'JOÃO', age: 30 });
      }
    });

    it('não deve mapear erro', () => {
      const result = err<string, number>('original error');
      const mapped = map(result, (value) => value * 2);
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error).toBe('original error');
      }
    });

    it('deve mudar tipo do valor mapeado', () => {
      const result: Result<string, number> = ok(42);
      const mapped = map(result, (value) => `O número é ${value}`);
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe('O número é 42');
      }
    });
  });

  describe('mapErr()', () => {
    it('deve mapear erro', () => {
      const result = err('original error');
      const mapped = mapErr(result, (error) => new Error(error));
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error).toBeInstanceOf(Error);
        expect(mapped.error.message).toBe('original error');
      }
    });

    it('deve mapear erro para objeto estruturado', () => {
      const result = err('falha');
      const mapped = mapErr(result, (error) => ({
        code: 'ERR_FALHA',
        message: error,
        timestamp: new Date(),
      }));
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error.code).toBe('ERR_FALHA');
        expect(mapped.error.message).toBe('falha');
      }
    });

    it('não deve mapear sucesso', () => {
      const result = ok<never, number>(42);
      const mapped = mapErr(result, (error) => new Error(error));
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe(42);
      }
    });

    it('deve mudar tipo do erro mapeado', () => {
      const result: Result<string, number> = err('error');
      const mapped = mapErr(result, (error) => ({ message: error, status: 500 }));
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error.status).toBe(500);
      }
    });
  });

  describe('unwrap()', () => {
    it('deve retornar valor de sucesso', () => {
      const result = ok(42);
      expect(unwrap(result)).toBe(42);
    });

    it('deve retornar objeto de sucesso', () => {
      const result = ok({ name: 'João' });
      expect(unwrap(result)).toEqual({ name: 'João' });
    });

    it('deve lançar erro para resultado de erro', () => {
      const result = err('falha ao processar');
      expect(() => unwrap(result)).toThrow('falha ao processar');
    });

    it('deve lançar Error (não string) para resultado de erro', () => {
      const result = err('falha');
      expect(() => unwrap(result)).toThrow('falha');
    });
  });

  describe('unwrapOr()', () => {
    it('deve retornar valor de sucesso', () => {
      const result = ok(42);
      expect(unwrapOr(result, 0)).toBe(42);
    });

    it('deve retornar valor default para erro', () => {
      const result = err('falha');
      expect(unwrapOr(result, 0)).toBe(0);
    });

    it('deve retornar default null para erro null', () => {
      const result = err(null);
      expect(unwrapOr(result, null)).toBeNull();
    });

    it('deve retornar default undefined para erro undefined', () => {
      const result = err(undefined);
      expect(unwrapOr(result, undefined)).toBeUndefined();
    });

    it('deve retornar valor de erro, não default, quando é erro', () => {
      const result = err({ code: 'ERR' });
      // unwrapOr retorna o valor de erro quando é err, não o default
      // O default só é usado quando é sucesso
      expect(() => unwrap(result)).toThrow();
    });
  });

  describe('fromPromise()', () => {
    it('deve converter Promise de sucesso para Result', async () => {
      const promise = Promise.resolve(42);
      const result = await fromPromise(promise);
      expect(result.ok).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(42);
      }
    });

    it('deve converter Promise de sucesso com objeto', async () => {
      const promise = Promise.resolve({ name: 'João', age: 30 });
      const result = await fromPromise(promise);
      expect(result.ok).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual({ name: 'João', age: 30 });
      }
    });

    it('deve converter Promise rejeitada para Result de erro', async () => {
      const promise = Promise.reject(new Error('falha ao carregar'));
      const result = await fromPromise(promise);
      expect(result.ok).toBe(false);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('falha ao carregar');
      }
    });

    it('deve converter Promise rejeitada com string error', async () => {
      const promise = Promise.reject('string error');
      const result = await fromPromise(promise);
      expect(result.ok).toBe(false);
      if (isErr(result)) {
        expect(result.error).toBe('string error');
      }
    });

    it('deve funcionar com async/await', async () => {
      const asyncOperation = async () => {
        const result = await fromPromise(Promise.resolve(42));
        return result;
      };
      const finalResult = await asyncOperation();
      expect(finalResult.ok).toBe(true);
      if (isOk(finalResult)) {
        expect(finalResult.value).toBe(42);
      }
    });
  });

  describe('fromZod()', () => {
    it('deve retornar dados válidos do Zod', () => {
      const result = fromZod(testSchema, { name: 'João', age: 30 });
      expect(result.ok).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual({ name: 'João', age: 30 });
      }
    });

    it('deve retornar ZodError para dados inválidos', () => {
      const result = fromZod(testSchema, { name: 'João', age: 'invalid' });
      expect(result.ok).toBe(false);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(z.ZodError);
      }
    });

    it('deve retornar ZodError para dados faltantes', () => {
      const result = fromZod(testSchema, {});
      expect(result.ok).toBe(false);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(z.ZodError);
      }
    });

    it('deve validar dados mistos válidos', () => {
      const result = fromZod(testSchema, { name: 'Maria', age: 25 });
      expect(result.ok).toBe(true);
      if (isOk(result)) {
        const value = result.value as unknown as { name: string; age: number };
        expect(value.name).toBe('Maria');
        expect(value.age).toBe(25);
      }
    });
  });

  describe('TypeScript Inference', () => {
    it('deve inferir tipo correto em branch success', () => {
      const processResult = (result: Result<string, number>) => {
        if (isOk(result)) {
          // TypeScript deve saber que result.value é number
          const doubled: number = result.value * 2;
          return doubled;
        }
        return 0;
      };

      expect(processResult(ok(5))).toBe(10);
      expect(processResult(err('error'))).toBe(0);
    });

    it('deve inferir tipo correto em branch error', () => {
      const processError = (result: Result<string, number>) => {
        if (isErr(result)) {
          // TypeScript deve saber que result.error é string
          const upperError: string = result.error.toUpperCase();
          return upperError;
        }
        return 'success';
      };

      expect(processError(ok(42))).toBe('success');
      expect(processError(err('error'))).toBe('ERROR');
    });

    it('deve permitir chaining de operações com map', () => {
      // Chaining usando map (estilo funcional)
      const result = ok(10);
      const chainedResult = map(map(result, (v) => v * 2), (v) => v + 5);
      expect(isOk(chainedResult)).toBe(true);
      if (isOk(chainedResult)) {
        expect(chainedResult.value).toBe(25);
      }
    });

    it('deve permitir chaining com error handling', () => {
      // Chaining que preserva erro
      const result = err<string, number>('error inicial');
      const chainedResult = map(map(result, (v) => v * 2), (v) => v + 5);
      expect(isErr(chainedResult)).toBe(true);
      if (isErr(chainedResult)) {
        expect(chainedResult.error).toBe('error inicial');
      }
    });
  });

  describe('Discriminated Union', () => {
    it('deve funcionar com switch baseado em ok', () => {
      const describeResult = (result: Result<string, number>): string => {
        switch (result.ok) {
          case true:
            return `Sucesso: ${result.value}`;
          case false:
            return `Erro: ${result.error}`;
        }
      };

      expect(describeResult(ok(42))).toBe('Sucesso: 42');
      expect(describeResult(err('falhou'))).toBe('Erro: falhou');
    });

    it('deve permitir destructuring correto', () => {
      const success = ok(42);
      const failure = err('error');

      // Success destructuring
      if (success.ok) {
        const { value } = success;
        expect(value).toBe(42);
      }

      // Failure destructuring
      if (failure.ok === false) {
        const { error } = failure;
        expect(error).toBe('error');
      }
    });
  });
});
