import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Capture console messages
const consoleLogs = [];
page.on('console', msg => {
  if (msg.text().includes('RestaurantContext') || msg.type() === 'error') {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  }
});

// Navigate to login
await page.goto('http://172.30.224.161:3000/admin/login');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: '/tmp/01-login.png' });

// Fill login form
await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="Email" i]', 'andreazzi-leonardo@hotmail.com');
await page.fill('input[type="password"], input[name="password"]', 'Teste@01');
await page.screenshot({ path: '/tmp/02-login-filled.png' });

// Click login button
await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Entrar"), button:has-text("Acessar")');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/03-after-login.png' });

// Navigate to settings
await page.goto('http://172.30.224.161:3000/admin/settings');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/04-settings.png' });

// Check page content
const pageText = await page.textContent('body');
const hasRestaurants = pageText.includes('restaurant') || pageText.includes('Restaurante') || pageText.includes('Nenhum') || pageText.includes('nenhum');

// Check localStorage
const localStorage = await page.evaluate(() => {
  return {
    activeRestaurantId: localStorage.getItem('PediAi_activeRestaurantId'),
    restaurantContext: localStorage.getItem('PediAi_restaurantContext'),
    cart: localStorage.getItem('PediAi_cart'),
  };
});

console.log('\n=== RESULTS ===');
console.log('Screenshot paths: /tmp/01-login.png, /tmp/02-login-filled.png, /tmp/03-after-login.png, /tmp/04-settings.png');
console.log('\nPage has restaurant-related text:', hasRestaurants);
console.log('\nLocalStorage:');
console.log(JSON.stringify(localStorage, null, 2));
console.log('\nConsole logs (RestaurantContext/errors):');
consoleLogs.forEach(log => console.log(log));

await browser.close();