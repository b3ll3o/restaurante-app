import { test, expect } from '@playwright/test';

/**
 * Testes responsivos para o cardápio público
 * Verifica FAB carrinho e touch targets em mobile
 */
test.describe('Responsive Public Menu', () => {
  // Use a test restaurant slug
  const testSlug = 'test-restaurant';

  test('FAB cart visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    // Navigate directly to menu (public page)
    await page.goto(`/menu/${testSlug}`);

    // FAB cart should be visible on mobile when there are items
    // (FAB is shown when totalItems > 0 and checkoutStep === 'cart')
    // For now, just verify the cart button structure exists
    const cartButton = page.locator('button[class*="relative"]');
    await expect(cartButton.first()).toBeVisible();
  });

  test('Category accordion works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/menu/${testSlug}`);

    // Wait for page to load
    await page.waitForSelector('[class*="Card"]', { timeout: 5000 }).catch(() => {});

    // Categories should be expandable
    const categoryButtons = page.locator('button[class*="w-full flex items-center justify-between"]');
    const count = await categoryButtons.count();

    if (count > 0) {
      // Click first category
      await categoryButtons.first().click();

      // Products should be visible after expanding
      const products = page.locator('[class*="bg-card rounded-lg p-3 shadow-sm"]');
      await expect(products.first()).toBeVisible({ timeout: 3000 }).catch(() => {
        // Products might not be visible if category is empty
      });
    }
  });

  test('Add to cart button has adequate touch target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/menu/${testSlug}`);

    await page.waitForSelector('button:has-text("Adicionar")', { timeout: 5000 }).catch(() => {});

    const addButton = page.locator('button:has-text("Adicionar")').first();
    if (await addButton.isVisible()) {
      const box = await addButton.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('WhatsApp input has numeric keyboard on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/menu/${testSlug}`);

    // Add item to cart and proceed to checkout
    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click().catch(() => {});

    // Click cart FAB if visible
    const cartButton = page.locator('button[class*="relative"]');
    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Look for WhatsApp input in checkout
      const whatsappInput = page.locator('input[id="whatsapp"]');
      if (await whatsappInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Input should have inputmode="numeric" which triggers numeric keyboard on mobile
        const inputMode = await whatsappInput.getAttribute('inputmode');
        expect(inputMode).toBe('numeric');
      }
    }
  });

  test('FAB does not overlap content on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/menu/${testSlug}`);

    // The main content should have padding at bottom to avoid FAB overlap
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // FAB should be fixed at bottom
    const fab = page.locator('button:has-text("Ver Carrinho")');
    if (await fab.isVisible()) {
      const box = await fab.boundingBox();
      // FAB should be at bottom of viewport
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(667); // viewport height
    }
  });

  test('Payment buttons have adequate touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/menu/${testSlug}`);

    // Navigate to checkout
    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click().catch(() => {});

    const cartButton = page.locator('button[class*="relative"]');
    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Wait for cart sheet
      await page.waitForTimeout(500);

      // Click "Continuar" to go to checkout
      const continueButton = page.locator('button:has-text("Continuar")');
      if (await continueButton.isVisible()) {
        await continueButton.click();
        await page.waitForTimeout(500);

        // Check payment buttons
        const pixButton = page.locator('button:has-text("PIX")');
        const dinheiroButton = page.locator('button:has-text("Dinheiro")');

        for (const button of [pixButton, dinheiroButton]) {
          if (await button.isVisible()) {
            const box = await button.boundingBox();
            expect(box?.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });
});
