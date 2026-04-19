import { test, expect } from '@playwright/test';
import { LoginPage } from '../support/page-objects';

test.describe('Login Admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('deve exibir página de login com título e campos', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await expect(page.getByText(/email ou senha incorretos/i)).toBeVisible();
  });

  test('deve redirecionar para dashboard com credenciais válidas', async ({ page }) => {
    // Este teste requer ambiente com usuário de teste configurado
    test.skip(process.env.SKIP_E2E_AUTH === 'true', 'Requer ambiente com usuário de teste');

    const loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.TEST_ADMIN_EMAIL || 'admin@test.com',
      process.env.TEST_ADMIN_PASSWORD || 'password123'
    );
    await expect(page).toHaveURL('/admin/dashboard');
  });
});