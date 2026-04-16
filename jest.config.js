/** @type {import('jest').Config} */
const config = {
  // Ambiente de teste
  testEnvironment: 'jsdom',
  
  // Transformar TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  
  // Mapeamento de módulos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  
  // Diretórios com testes
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx',
    '<rootDir>/tests/**/*.spec.ts',
    '<rootDir>/tests/**/*.spec.tsx',
  ],
  
// Cobertura mínima obrigatória (apenas para arquivos com testes)
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Diretórios a incluir na cobertura (apenas arquivos com testes)
  collectCoverageFrom: [
    'lib/utils.ts',
    'lib/whatsapp.ts',
    'context/cart-context.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
// Setup antes dos testes
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Limpar mocks entre testes
  clearMocks: true,
  
  // Resetar módulos entre testes
  resetMocks: true,
  
  // Restaurar mocks entre testes
  restoreMocks: true,
};

module.exports = config;