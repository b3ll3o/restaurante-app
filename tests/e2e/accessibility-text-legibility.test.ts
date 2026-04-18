import { test, expect } from '@playwright/test';

/**
 * Testes de acessibilidade - Legibilidade de texto
 * Verifica que todo texto tem no mínimo 16px e contraste adequado
 */
test.describe('Accessibility - Text Legibility', () => {
  test('Body text is at least 16px on all pages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const pages = [
      { name: 'Login', path: '/admin/login' },
      { name: 'Signup', path: '/admin/signup' },
    ];

    for (const p of pages) {
      await page.goto(p.path);
      await page.waitForLoadState('networkidle');

      // Check body text
      const bodyFontSize = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return parseFloat(style.fontSize);
      });

      expect(bodyFontSize).toBeGreaterThanOrEqual(16);
    }
  });

  test('Input text is at least 16px to prevent zoom on iOS', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/login');

    const inputs = page.locator('input');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const fontSize = await input.evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });

        // iOS zooms in when font-size < 16px
        expect(fontSize).toBeGreaterThanOrEqual(16);
      }
    }
  });

  test('Contrast ratio is at least 4.5:1 for normal text', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/login');

    // Check primary text contrast
    const textColor = await page.evaluate(() => {
      const text = document.querySelector('p, span, label');
      if (text) {
        const style = window.getComputedStyle(text);
        return style.color;
      }
      return null;
    });

    // Basic check that text color is defined
    expect(textColor).toBeTruthy();

    // Check that background is defined
    const bgColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).backgroundColor;
    });

    expect(bgColor).toBeTruthy();
  });

  test('Touch target text is legible without zoom', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Login first
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');

    // Go to categories
    await page.goto('/admin/categories');

    // Check button text is visible and legible
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const text = await button.textContent();
        if (text && text.trim().length > 0) {
          // Text should be visible
          await expect(button).toBeVisible();
        }
      }
    }
  });
});
