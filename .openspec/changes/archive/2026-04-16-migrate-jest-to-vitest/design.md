# Design: Migrar de Jest para Vitest

## Fonte da Verdade

Este documento detalha as decisões arquiteturais para migração de Jest para Vitest.

---

## 1. Dependências

### 1.1 Remover

```bash
npm uninstall jest ts-jest jest-environment-jsdom @types/jest
```

### 1.2 Adicionar

```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8
```

### 1.3 Manter

- `@testing-library/react` - funciona com Vitest
- `@testing-library/user-event` - funciona com Vitest
- `@playwright/test` - não relacionado ao Jest

---

## 2. Configuração Vitest

### 2.1 vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      reporter: ['text', 'html'],
    },
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

---

## 3. Setup Atualizado

### 3.1 tests/setup.ts

```typescript
import '@vitest/jest-dom'; // Substitui @testing-library/jest-dom
import { vi } from 'vitest';

// Mock do Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              then: vi.fn(),
            })),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
    })),
  })),
}));

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock do fetch
global.fetch = vi.fn();

// Limpar mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
});
```

---

## 4. Scripts npm Atualizados

### 4.1 package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --run --testPathPattern=unit",
    "test:integration": "vitest --run --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --run --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

---

## 5. Atualização de Testes

### 5.1 Padrões de Substituição

| Jest | Vitest |
|------|--------|
| `import { describe, it, expect } from '@jest/globals'` | `import { describe, it, expect } from 'vitest'` |
| `import { beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals'` | `import { beforeEach, afterEach, beforeAll, afterAll } from 'vitest'` |
| `jest.fn()` | `vi.fn()` |
| `jest.spyOn(obj, 'method')` | `vi.spyOn(obj, 'method')` |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| `jest.mock('module')` | `vi.mock('module')` |

### 5.2 Exemplo de Arquivo Atualizado

**Antes (Jest):**
```typescript
import { describe, it, expect } from '@jest/globals';
import { formatPrice } from '@/lib/utils';

describe('Utils', () => {
  it('should format price in BRL', () => {
    expect(formatPrice(10)).toBe('R$ 10,00');
  });
});
```

**Depois (Vitest):**
```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/utils';

describe('Utils', () => {
  it('should format price in BRL', () => {
    expect(formatPrice(10)).toBe('R$ 10,00');
  });
});
```

---

## 6. Documentação a Atualizar

| Arquivo | Mudança |
|---------|---------|
| `tests/AGENTS.md` | Jest → Vitest |
| `lib/AGENTS.md` | Jest → Vitest |
| `.openspec/specs/menulink-quality-rules.md` | Jest → Vitest |
| `.openspec/specs/menulink-unit-tests-checklist.md` | Jest → Vitest |
| `.openspec/specs/menulink-technical-plan.md` | Jest → Vitest |
| `README.md` | Jest → Vitest |

---

## 7. Tradeoffs

| Decisão | Tradeoff |
|---------|----------|
| Vitest vs Jest | Vitest mais rápido, Jest mais maduro |
| Manter @testing-library | Funciona com ambos, não precisa mudar |
| Playwright separado | E2E não afetado pela migração |

---

## 8. Riscos

| Risco | Mitigação |
|-------|-----------|
| Breaking changes em testes | Migração incremental, verificar cada arquivo |
| Coverage drop | Manter threshold 80%, verificar após migração |
| Incompatibilidade com mocks | Revisar setup.ts após migração |

---

## Status

Design