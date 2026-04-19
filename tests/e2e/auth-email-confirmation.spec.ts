import { test, expect } from '@playwright/test';

/**
 * Teste E2E para o fluxo de Confirmação de Email
 * @see tests/e2e/AGENTS.md
 *
 * Tags:
 * @e2e - Teste end-to-end
 * @slow - Teste que envolve envio de email (mais lento)
 */

test.describe('Email Confirmation Flow', () => {
  /**
   * Gerador de email único para evitar colisões entre execuções
   */
  const generateUniqueEmail = () => {
    const timestamp = Date.now();
    return `teste_${timestamp}@test.com`;
  };

  test.beforeEach(async ({ page }) => {
    // Navega para a página inicial antes de cada teste
    await page.goto('/');
  });

  test(
    'signup shows pending confirmation when email confirmation is required',
    { tag: ['@e2e', '@slow'] },
    async ({ page }) => {
      // Skip se não houver ambiente de teste
      test.skip(
        process.env.SKIP_E2E_AUTH === 'true',
        'Requer ambiente com Supabase de teste'
      );

      const uniqueEmail = generateUniqueEmail();

      // 1. Vai para página de cadastro
      await page.goto('/admin/signup');

      // 2. Preenche formulário com email único
      await page.getByLabel('Nome do Restaurante').fill('Restaurante Teste E2E');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Senha').fill('senha_valida_123');
      await page.getByLabel('Confirmar Senha').fill('senha_valida_123');

      // 3. Submete formulário
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // 4. Deve ver mensagem de conta criada com estado pendente
      // O sistema pode mostrar toast de sucesso ou mensagem de confirmação pendente
      const successMessage = page.locator('[data-sonner-toast], .rounded-md.bg-green-500\\/10');
      await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
      await expect(successMessage).toContainText(/conta criada|cadastro realizado|verifique seu email/i);

      // 5. NÃO deve redirecionar para dashboard imediatamente
      // (usuário precisa confirmar email primeiro)
      await expect(page).not.toHaveURL('/admin/dashboard', { timeout: 3000 });
    }
  );

  test(
    'login fails with email_not_confirmed before confirmation',
    { tag: ['@e2e'] },
    async ({ page }) => {
      test.skip(
        process.env.SKIP_E2E_AUTH === 'true',
        'Requer ambiente com Supabase de teste'
      );

      const uniqueEmail = generateUniqueEmail();

      // 1. Cria conta com email não confirmado
      await page.goto('/admin/signup');
      await page.getByLabel('Nome do Restaurante').fill('Restaurante Teste E2E');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Senha').fill('senha_valida_123');
      await page.getByLabel('Confirmar Senha').fill('senha_valida_123');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Espera a mensagem de sucesso do cadastro
      await page.waitForTimeout(1000);

      // 2. Vai para página de login
      await page.goto('/admin/login');

      // 3. Entra com credenciais não confirmadas
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Senha').fill('senha_valida_123');
      await page.getByRole('button', { name: 'Entrar' }).click();

      // 4. Deve ver mensagem de email não confirmado
      const alertBox = page.locator('.rounded-md.bg-destructive\\/10');
      await expect(alertBox).toBeVisible({ timeout: 5000 });
      await expect(alertBox).toContainText('Você ainda não confirmou seu email');

      // 5. Deve ver botão "Reenviar email de confirmação"
      const resendButton = page.getByRole('button', {
        name: /reenviar email de confirmação/i,
      });
      await expect(resendButton).toBeVisible();
    }
  );

  test(
    'resend confirmation email button works',
    { tag: ['@e2e', '@slow'] },
    async ({ page }) => {
      test.skip(
        process.env.SKIP_E2E_AUTH === 'true',
        'Requer ambiente com Supabase de teste'
      );

      // 1. Login com email não confirmado (credenciais de teste pré-cadastrado)
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill('nao_confirmado@test.com');
      await page.getByLabel('Senha').fill('senha_valida');
      await page.getByRole('button', { name: 'Entrar' }).click();

      // Espera aparecer o botão de reenvio
      const resendButton = page.getByRole('button', {
        name: /reenviar email de confirmação/i,
      });
      await expect(resendButton).toBeVisible({ timeout: 5000 });

      // 2. Clica no botão de reenvio
      await resendButton.click();

      // 3. Deve ver toast de sucesso "Email de confirmação reenviado!"
      const toast = page.locator('[data-sonner-toast]');
      await expect(toast).toContainText('Email de confirmação reenviado!', { timeout: 5000 });
    }
  );

  test(
    'user can login after email confirmation',
    { tag: ['@e2e', '@manual'] },
    async ({ page }) => {
      /**
       * Este teste requer confirmação manual de email ou SMTP de teste.
       * Em CI, deve ser pulado.
       */
      test.skip(
        process.env.SKIP_E2E_AUTH === 'true' || process.env.CI === 'true',
        'Requer confirmação manual de email ou ambiente de teste com SMTP'
      );

      // Fluxo:
      // 1. Criar conta com email único
      // 2. Simular confirmação via link no email (requer Supabase test helper ou SMTP mock)
      // 3. Fazer login
      // 4. Verificar que acessa o dashboard

      const uniqueEmail = generateUniqueEmail();

      await page.goto('/admin/signup');
      await page.getByLabel('Nome do Restaurante').fill('Restaurante Teste E2E');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Senha').fill('senha_valida_123');
      await page.getByLabel('Confirmar Senha').fill('senha_valida_123');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // TODO: Usar Supabase Admin API ou helper de teste para confirmar o email
      // Por enquanto, marca como manual

      throw new Error('Este teste requer implementação de confirmação via API de teste');
    }
  );
});
