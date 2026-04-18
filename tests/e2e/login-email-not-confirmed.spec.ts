import { test, expect } from "@playwright/test";

/**
 * Teste E2E para o fluxo de Email Não Confirmado
 * @see tests/e2e/AGENTS.md
 *
 * Tags:
 * @e2e - Teste end-to-end
 * @critical - Fluxo crítico obrigatório
 */

test.describe("Login - Email Não Confirmado", () => {
  /**
   * Cenário: Usuário tenta login sem confirmar email
   * Dado que o usuário criou uma conta com "ana@restaurante.com"
   * Mas não confirmou o email de confirmação
   * Quando tenta fazer login com "ana@restaurante.com" e senha correta
   * Então o sistema deve exibir mensagem "Você ainda não confirmou seu email..."
   * E deve oferecer botão "Reenviar email de confirmação"
   */
  test("deve exibir mensagem de email não confirmado e botão de reenvio", async ({
    page,
  }) => {
    // Skip se não houver ambiente de teste
    test.skip(
      process.env.SKIP_E2E_AUTH === "true",
      "Requer ambiente com Supabase de teste"
    );

    await page.goto("/admin/login");

    // Preenche credenciais de usuário não confirmado
    await page.fill('input[id="email"]', "nao_confirmado@test.com");
    await page.fill('input[id="password"]', "senha_valida");

    // Clica em entrar
    await page.click('button[type="submit"]');

    // Verifica mensagem de erro específica para email não confirmado
    const alertBox = page.locator(".rounded-md.bg-destructive\\/10");
    await expect(alertBox).toBeVisible();
    await expect(alertBox).toContainText("Você ainda não confirmou seu email");
    await expect(alertBox).toContainText("Reenviar email de confirmação");

    // Verifica que o botão existe
    const resendButton = page.getByRole("button", {
      name: /reenviar email de confirmação/i,
    });
    await expect(resendButton).toBeVisible();
  });

  /**
   * Cenário: Usuário solicita reenvio de email de confirmação
   * Dado que o usuário está na tela de erro "email não confirmado"
   * Quando clica em "Reenviar email de confirmação"
   * Então o sistema deve exibir toast de sucesso
   */
  test("deve exibir toast de sucesso após reenviar email", async ({ page }) => {
    test.skip(
      process.env.SKIP_E2E_AUTH === "true",
      "Requer ambiente com Supabase de teste"
    );

    await page.goto("/admin/login");

    // Preenche credenciais e submete para chegar ao estado de email não confirmado
    await page.fill('input[id="email"]', "teste@test.com");
    await page.fill('input[id="password"]', "senha_valida");
    await page.click('button[type="submit"]');

    // Espera aparecer o botão de reenvio
    const resendButton = page.getByRole("button", {
      name: /reenviar email de confirmação/i,
    });

    // Clica no botão de reenvio
    await resendButton.click();

    // Verifica toast de sucesso (sonner exibe "Email de confirmação reenviado!")
    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toContainText("Email de confirmação reenviado!");
  });

  /**
   * Cenário: Erro de credenciais inválidas
   * Dado que o usuário tentou fazer login com credenciais erradas
   * Quando o Supabase retorna erro "invalid_credentials"
   * Então o sistema deve exibir mensagem "Email ou senha incorretos"
   * E não deve oferecer botão de reenvio de email
   */
  test("deve exibir mensagem genérica para credenciais inválidas", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    // Preenche credenciais inválidas
    await page.fill('input[id="email"]', "invalido@test.com");
    await page.fill('input[id="password"]', "senha_errada");

    // Clica em entrar
    await page.click('button[type="submit"]');

    // Verifica mensagem genérica
    const errorMessage = page.locator(".rounded-md.bg-destructive\\/10");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Email ou senha incorretos");

    // NÃO deve aparecer botão de reenvio
    const resendButton = page.getByRole("button", {
      name: /reenviar email de confirmação/i,
    });
    await expect(resendButton).not.toBeVisible();
  });
});
