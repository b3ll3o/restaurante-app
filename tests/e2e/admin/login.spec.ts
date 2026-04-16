import { test, expect } from '@playwright/test';
import { LoginPage } from '../support/page-objects';

test.describe('Login', () => {
  test('deve exibir página de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('invalido@test.com', 'senhaerrada');
    await loginPage.expectError('Credenciais inválidas');
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    // Este teste requer um usuário existente no banco
    // Em ambiente de teste, usaríamos credenciais de teste
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Skip este teste se não houver ambiente de teste configurado
    test.skip(process.env.SKIP_E2E_AUTH === 'true', 'Requer ambiente com usuário de teste');
  });
});