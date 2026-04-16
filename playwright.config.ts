import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E do MenuLink
 * 
 * Documentação: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Diretório dos testes
  testDir: './tests/e2e',

  // Executar testes em paralelo
  fullyParallel: true,

  // Bloquear testes com.only em CI
  forbidOnly: !!process.env.CI,

  // Número de retries em CI
  retries: process.env.CI ? 2 : 0,

  // Número de workers em CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter de resultados
  reporter: 'html',

  // Configurações globais dos testes
  use: {
    // URL base para os testes
    baseURL: 'http://localhost:3000',

    // Rastrear screenshots e vídeos de falha
    trace: 'on-first-retry',

    // Screenshot apenas quando necessário
    screenshot: 'only-on-failure',
  },

  // Projetos de browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomente para testar em outros browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Servidor web para testes E2E
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 120 segundos
  },

  // Timeout global
  timeout: 30 * 1000, // 30 segundos

  // Timeout para ações
  expect: {
    timeout: 10 * 1000, // 10 segundos
  },
});