import { test, expect } from '@playwright/test';

/**
 * Testes E2E para autenticação admin
 * @see tests/e2e/AGENTS.md
 *
 * Tags:
 * @e2e - Teste end-to-end
 * @slow - Teste que envolve envio de email (mais lento)
 * @manual - Teste que requer ação manual (confirmação de email)
 */

test.describe('Admin Authentication', () => {

  /**
   * Gerador de email único para evitar colisões entre execuções
   */
  const generateUniqueEmail = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `test_${timestamp}_${random}@test.com`;
  };

  test('signup page renders correctly in Portuguese', async ({ page }) => {
    await page.goto('/admin/signup');

    // Verify page loads
    await expect(page).toHaveURL('/admin/signup');

    // Check title is in Portuguese
    await expect(page.getByRole('heading', { name: /criar conta de administrador/i })).toBeVisible();

    // Check description is in Portuguese
    await expect(page.getByText(/preencha seus dados para criar uma conta/i)).toBeVisible();

    // Verify form fields exist
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByLabel('Nome do Restaurante')).toBeVisible();
    await expect(page.getByLabel('Número do WhatsApp')).toBeVisible();

    // Verify button text "Criar Conta"
    await expect(page.getByRole('button', { name: 'Criar Conta' })).toBeVisible();

    // Verify link to login page
    await expect(page.getByRole('link', { name: /faça login/i })).toBeVisible();
  });

  test('signup creates user and shows pending confirmation', async ({ page }) => {
    test.skip(
      process.env.SKIP_E2E_AUTH === 'true',
      'Requer ambiente com Supabase de teste'
    );

    const uniqueEmail = generateUniqueEmail();

    await page.goto('/admin/signup');

    // Fill form with valid data
    await page.getByLabel('Nome do Restaurante').fill('Restaurante Teste E2E');
    await page.getByLabel('E-mail').fill(uniqueEmail);
    await page.getByLabel('Senha').fill('senha_valida_123');
    await page.getByLabel('Número do WhatsApp').fill('+5511999999999');

    // Click "Criar Conta"
    await page.getByRole('button', { name: 'Criar Conta' }).click();

    // Verify loading state shows "Criando conta..."
    await expect(page.getByRole('button', { name: 'Criando conta...' })).toBeVisible({ timeout: 5000 });

    // Verify after success shows "Conta criada!" message
    await expect(page.getByText('Conta criada!')).toBeVisible({ timeout: 10000 });

    // Verify email confirmation message appears
    await expect(page.getByText(/verifique seu email para confirmar/i)).toBeVisible();

    // Verify resend button is visible
    await expect(page.getByRole('button', { name: /reenviar email de confirmação/i })).toBeVisible();

    // Verify link to login page
    await expect(page.getByRole('link', { name: /fazer login/i })).toBeVisible();
  });

  test('login page renders correctly in Portuguese', async ({ page }) => {
    await page.goto('/admin/login');

    // Check title is in Portuguese
    await expect(page.getByRole('heading', { name: /login do administrador/i })).toBeVisible();

    // Check description is in Portuguese
    await expect(page.getByText(/insira suas credenciais/i)).toBeVisible();

    // Verify form fields
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();

    // Verify button text "Entrar"
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();

    // Verify link to signup page
    await expect(page.getByRole('link', { name: /cadastre-se/i })).toBeVisible();
  });

  test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill with wrong email/password
    await page.getByLabel('E-mail').fill('wrong@example.com');
    await page.getByLabel('Senha').fill('wrongpassword');

    // Click "Entrar"
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Verify loading state
    await expect(page.getByRole('button', { name: 'Entrando...' })).toBeVisible({ timeout: 5000 });

    // Verify error message "Email ou senha incorretos"
    await expect(page.getByText(/email ou senha incorretos/i)).toBeVisible({ timeout: 10000 });
  });

  test(
    'login shows email_not_confirmed when email not verified',
    { tag: ['@e2e', '@slow'] },
    async ({ page }) => {
      test.skip(
        process.env.SKIP_E2E_AUTH === 'true',
        'Requer ambiente com Supabase de teste'
      );

      const uniqueEmail = generateUniqueEmail();

      // First, create a signup to get an unconfirmed user
      await page.goto('/admin/signup');
      await page.getByLabel('Nome do Restaurante').fill('Restaurante Teste E2E');
      await page.getByLabel('E-mail').fill(uniqueEmail);
      await page.getByLabel('Senha').fill('senha_valida_123');
      await page.getByLabel('Número do WhatsApp').fill('+5511999999999');
      await page.getByRole('button', { name: 'Criar Conta' }).click();

      // Wait for signup success
      await expect(page.getByText('Conta criada!')).toBeVisible({ timeout: 10000 });

      // Go to login page
      await page.goto('/admin/login');

      // Fill login form with the unconfirmed email
      await page.getByLabel('E-mail').fill(uniqueEmail);
      await page.getByLabel('Senha').fill('senha_valida_123');
      await page.getByRole('button', { name: 'Entrar' }).click();

      // Verify shows "Você ainda não confirmou seu email"
      await expect(page.getByText(/você ainda não confirmou seu email/i)).toBeVisible({ timeout: 10000 });

      // Verify "Reenviar email de confirmação" button appears
      await expect(page.getByRole('button', { name: /reenviar email de confirmação/i })).toBeVisible();
    }
  );

  test(
    'signup and login flow after email confirmation',
    { tag: ['@e2e', '@manual'] },
    async () => {
      /**
       * Este teste requer confirmação manual de email ou SMTP de teste.
       * Em CI, deve ser pulado.
       */
      test.skip(
        process.env.SKIP_E2E_AUTH === 'true' || process.env.CI === 'true',
        'Requer confirmação manual de email ou ambiente de teste com SMTP'
      );

      // TODO: Implementar quando houver helper de confirmação via API
      throw new Error('Este teste requer implementação de confirmação via API de teste');
    }
  );

});
