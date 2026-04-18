import { test, expect } from "@playwright/test";

test.describe("Landing Page - Multi-Viewport", () => {
  test.describe.configure({ mode: "parallel" });

  test("Hero section renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Headline visible above the fold
    const headline = page.getByRole("heading", {
      name: /Aumente suas vendas diretas sem pagar comissão/i,
    });
    await expect(headline).toBeVisible();

    // Badge visible
    const badge = page.getByText(/Zero comissão/i);
    await expect(badge).toBeVisible();

    // CTA button visible
    const ctaButton = page.getByRole("link", { name: /Começar gratuitamente/i });
    await expect(ctaButton).toBeVisible();

    // Ver demo button visible
    const demoButton = page.getByRole("link", { name: /Ver demo/i });
    await expect(demoButton).toBeVisible();
  });

  test("Three pillars section on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Scroll to pillars section
    await page.getByText(/Por que escolher o MenuLink/i).scrollIntoViewIfNeeded();

    // Exactly 3 pillars visible
    await expect(page.getByText(/Setup em 2 minutos/i)).toBeVisible();
    await expect(page.getByText(/Zero comissão/i)).toBeVisible();
    await expect(page.getByText(/WhatsApp/i)).toBeVisible();
  });

  test("Social proof counter shows greater than 2000 restaurants", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Counter section
    const counterSection = page.locator("section").filter({ hasText: /2500/i });
    await expect(counterSection).toBeVisible();
  });

  test("Pricing section shows three plans with correct prices", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Scroll to pricing
    await page.getByText(/Preços simples e transparentes/i).scrollIntoViewIfNeeded();

    // Three plans visible
    await expect(page.getByText(/^Start$/i)).toBeVisible();
    await expect(page.getByText(/^Crescer$/i)).toBeVisible();
    await expect(page.getByText(/^Escalar$/i)).toBeVisible();

    // Prices visible
    await expect(page.getByText(/R\$ 0/i)).toBeVisible();
    await expect(page.getByText(/R\$ 49/i)).toBeVisible();
    await expect(page.getByText(/R\$ 149/i)).toBeVisible();
  });

  test("CTA section contains Teste grátis 14 dias", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Scroll to CTA section
    const ctaSection = page.locator("section").filter({ hasText: /Comece a receber pedidos hoje mesmo/i });
    await ctaSection.scrollIntoViewIfNeeded();

    // CTA button with correct text
    const ctaButton = page.getByRole("button", { name: /Teste grátis 14 dias/i });
    await expect(ctaButton).toBeVisible();

    // Urgency element
    await expect(page.getByText(/Teste gratuito por 14 dias/i)).toBeVisible();
  });

  test("No header navigation menu on landing page", async ({ page }) => {
    await page.goto("/");

    // Check that there is no main nav element with menu links
    // Header nav should not have links like Home, Cardápio, Preços, etc.
    const headerNav = page.locator("header nav").first();
    if (await headerNav.isVisible()) {
      const navText = await headerNav.textContent();
      // Header nav should not contain main navigation items
      expect(navText).not.toMatch(/Cardápio|Preços|Sobre|Contato/);
    }
  });

  test("Lead capture form has required fields", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Scroll to CTA section
    const ctaSection = page.locator("section").filter({ hasText: /Comece a receber pedidos hoje mesmo/i });
    await ctaSection.scrollIntoViewIfNeeded();

    // Form fields visible
    await expect(page.getByPlaceholderText(/Seu nome completo/i)).toBeVisible();
    await expect(page.getByPlaceholderText(/seu@email\.com/i)).toBeVisible();
    await expect(page.getByPlaceholderText(/\(11\) 99999-9999/i)).toBeVisible();
  });

  test("Video testimonial modal opens on click", async ({ page }) => {
    await page.goto("/");

    // Scroll to video section if needed
    const videoSection = page.locator("section").filter({ hasText: /Depoimento em vídeo/i });
    if (await videoSection.isVisible()) {
      // Click on video card/trigger
      const videoTrigger = page.locator("[data-testid=\"dialog-trigger\"]").or(
        page.getByText(/Depoimento em vídeo/i).locator("..")
      );

      if (await videoTrigger.isVisible()) {
        await videoTrigger.click();

        // Dialog should open
        const dialog = page.locator("[data-testid=\"dialog\"]");
        await expect(dialog).toBeVisible();
      }
    }
  });

  test("Demo section shows QR to order flow", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Scroll to demo section
    await page.getByText(/Como funciona/i).scrollIntoViewIfNeeded();

    // Steps visible
    await expect(page.getByText(/Crie seu cardápio/i)).toBeVisible();
    await expect(page.getByText(/Gere o QR Code/i)).toBeVisible();
    await expect(page.getByText(/Receba pedidos/i)).toBeVisible();

    // QR Code icon visible
    await expect(page.getByText(/Cliente escaneia QR Code/i)).toBeVisible();
    await expect(page.getByText(/Pedido chega no WhatsApp/i)).toBeVisible();
  });
});
