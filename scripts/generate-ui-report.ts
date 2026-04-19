#!/usr/bin/env npx tsx
/**
 * Script para gerar relatório de validação visual de UI
 * Versão com interceptação de fetch para mocks do Supabase
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(process.cwd(), 'tests/e2e', 'ui-validation-report');

interface PageCapture {
  name: string;
  url: string;
  description: string;
  requiresAuth?: boolean;
}

const PAGES_TO_CAPTURE: PageCapture[] = [
  { name: 'Landing Page', url: '/', description: 'Página inicial do PediAi' },
  { name: 'Login Admin', url: '/admin/login', description: 'Página de login do painel admin' },
  { name: 'Cadastro Admin', url: '/admin/signup', description: 'Página de cadastro' },
  { name: 'Landing Pizzaria', url: '/landing/pizzaria', description: 'Landing para pizzarias' },
  { name: 'Landing Hamburgueria', url: '/landing/hamburgueria', description: 'Landing para hamburguerias' },
  { name: 'Landing Bar', url: '/landing/bar', description: 'Landing para bares' },
  { name: 'Landing Restaurante', url: '/landing/restaurante', description: 'Landing para restaurantes' },
  { name: 'Dashboard Admin', url: '/admin/dashboard', description: 'Dashboard principal', requiresAuth: true },
  { name: 'Categorias Admin', url: '/admin/categories', description: 'Gestão de categorias', requiresAuth: true },
  { name: 'Produtos Admin', url: '/admin/products', description: 'Gestão de produtos', requiresAuth: true },
  { name: 'Pedidos Admin', url: '/admin/orders', description: 'Gestão de pedidos', requiresAuth: true },
  { name: 'Configurações Admin', url: '/admin/settings', description: 'Configurações', requiresAuth: true },
];

interface PageResult {
  name: string;
  url: string;
  description: string;
  screenshotPath: string | null;
  status: 'success' | 'error';
  error?: string;
  mobileScreenshotPath?: string | null;
  tabletScreenshotPath?: string | null;
}

async function ensureDir(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Dados mockados para simular sessão autenticada
const MOCK_SESSION = {
  user: {
    id: 'mock-user-123',
    email: 'admin@test.com',
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Admin Test' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  session: {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: 'mock-user-123',
      email: 'admin@test.com',
    },
  },
};

const MOCK_RESTAURANTS = [{
  id: 'mock-restaurant-1',
  name: 'Restaurante Demo',
  slug: 'restaurante-demo',
  owner_id: 'mock-user-123',
  owner_whatsapp: '5511999999999',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}];

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Bebidas', restaurant_id: 'mock-restaurant-1', display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Pratos', restaurant_id: 'mock-restaurant-1', display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Sobremesas', restaurant_id: 'mock-restaurant-1', display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const MOCK_PRODUCTS = [
  { id: 'prod-1', name: 'Pizza Margherita', description: 'Pizza tradicional italiana', price: 45.90, category_id: 'cat-2', restaurant_id: 'mock-restaurant-1', image_url: null, is_available: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'prod-2', name: 'Suco de Laranja', description: 'Suco natural', price: 12.00, category_id: 'cat-1', restaurant_id: 'mock-restaurant-1', image_url: null, is_available: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'prod-3', name: 'Pudim', description: 'Pudim de leite condensado', price: 15.00, category_id: 'cat-3', restaurant_id: 'mock-restaurant-1', image_url: null, is_available: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const MOCK_ORDERS = [
  { id: 'order-1', restaurant_id: 'mock-restaurant-1', customer_name: 'Maria Silva', customer_whatsapp: '5511888888888', total: 57.90, status: 'pending', payment_method: 'pix', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'order-2', restaurant_id: 'mock-restaurant-1', customer_name: 'João Santos', customer_whatsapp: '5511777777777', total: 45.90, status: 'confirmed', payment_method: 'dinheiro', created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString() },
];

async function capturePage(
  browser: any,
  baseUrl: string,
  page: PageCapture
): Promise<PageResult> {
  const result: PageResult = {
    name: page.name,
    url: page.url,
    description: page.description,
    screenshotPath: null,
    status: 'error',
  };

  const fullUrl = `${baseUrl}${page.url}`;
  console.log(`  📸 ${fullUrl}${page.requiresAuth ? ' (interceptando API)' : ''}`);

  const breakpoints = [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
  ];

  try {
    for (const bp of breakpoints) {
      const context = await browser.newContext({ 
        viewport: { width: bp.width, height: bp.height },
        ignoreHTTPSErrors: true,
      });
      
      const browserPage = await context.newPage();

      // Para páginas autenticadas, interceptar TODAS as requisições fetch/XHR
      if (page.requiresAuth) {
        // Interceptor para requisições ao Supabase Auth
        await browserPage.route('**/auth/**', route => {
          const url = route.request().url();
          
          if (url.includes('/auth/v1/token') || url.includes('/auth/v1/sign_in')) {
            // Login - retornar sessão mockada
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                access_token: MOCK_SESSION.session.access_token,
                refresh_token: MOCK_SESSION.session.refresh_token,
                user: MOCK_SESSION.user,
              }),
            });
          } else if (url.includes('/auth/v1/session') || url.includes('/auth/session')) {
            // GET session - retornar sessão mockada
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(MOCK_SESSION),
            });
          } else if (url.includes('/auth/v1/user')) {
            // GET user - retornar usuário mockado
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(MOCK_SESSION.user),
            });
          } else if (url.includes('/auth/v1/settings')) {
            // Settings - retornar empty
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({}),
            });
          } else {
            // Outras requisições auth - retornar sucesso
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({}),
            });
          }
        });

        // Interceptor para requisições REST do Supabase
        await browserPage.route('**/rest/v1/**', route => {
          const url = route.request().url();
          
          if (url.includes('restaurants') && url.includes('select')) {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(MOCK_RESTAURANTS),
            });
          } else if (url.includes('categories') && url.includes('select')) {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(MOCK_CATEGORIES),
            });
          } else if (url.includes('products') && url.includes('select')) {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(MOCK_PRODUCTS),
            });
          } else if (url.includes('orders') && url.includes('select')) {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(MOCK_ORDERS),
            });
          } else {
            // Qualquer outra requisição REST - retornar array vazio
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify([]),
            });
          }
        });
      }

      await browserPage.goto(fullUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
      
      // Aguardar para API mocked carregar
      await browserPage.waitForTimeout(3000);
      
      // Aguardar elementos específicos aparecerem
      try {
        if (page.url.includes('/admin/dashboard')) {
          await browserPage.waitForSelector('main, h1', { timeout: 5000 }).catch(() => {});
        } else if (page.url.includes('/admin/')) {
          await browserPage.waitForSelector('main, [class*="admin"], h1', { timeout: 5000 }).catch(() => {});
        } else {
          await browserPage.waitForSelector('main, body', { timeout: 3000 }).catch(() => {});
        }
      } catch {
        // Ignora timeout
      }

      const filename = `${bp.name}${page.url.replace(/\//g, '-').replace(/^-/, '')}.png`;
      const screenshotPath = path.join(OUTPUT_DIR, filename);
      
      await browserPage.screenshot({ path: screenshotPath, fullPage: true });

      if (bp.name === 'desktop') result.screenshotPath = screenshotPath;
      else if (bp.name === 'mobile') result.mobileScreenshotPath = screenshotPath;
      else if (bp.name === 'tablet') result.tabletScreenshotPath = screenshotPath;

      console.log(`    ✅ ${bp.name}: ${filename}`);
      await context.close();
    }

    result.status = 'success';

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Erro desconhecido';
    console.log(`    ❌ Erro: ${result.error}`);
  }

  return result;
}

function generateHTMLReport(results: PageResult[]): string {
  const timestamp = new Date().toISOString();
  const successfulPages = results.filter(r => r.status === 'success').length;

  // Função para sanitizar texto (evitar XSS)
  const escapeHtml = (text: string): string => {
    const div = { innerHTML: '' } as any;
    return String(text)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
  };

  // Função para criar card de página
  const createPageCard = (page: PageResult, isAuthPage: boolean = false): string => {
    const statusIcon = page.status === 'success' ? '✅' : '❌';
    const statusClass = page.status === 'success' ? 'status-success' : 'status-error';
    const statusText = page.status === 'success' ? 'Sucesso' : 'Erro';
    
    let screenshotsHtml = '';
    if (page.status === 'success') {
      screenshotsHtml = `
        <div class="screenshots">
          <h3>Screenshots</h3>
          <div class="screenshot-grid">
            ${page.screenshotPath ? `<div class="screenshot-item"><h4>Desktop (1280x720)</h4><a href="${escapeHtml(path.relative(OUTPUT_DIR, page.screenshotPath))}" target="_blank"><img src="${escapeHtml(path.relative(OUTPUT_DIR, page.screenshotPath))}" alt="Desktop"></a></div>` : ''}
            ${page.mobileScreenshotPath ? `<div class="screenshot-item"><h4>Mobile (375x667)</h4><a href="${escapeHtml(path.relative(OUTPUT_DIR, page.mobileScreenshotPath))}" target="_blank"><img src="${escapeHtml(path.relative(OUTPUT_DIR, page.mobileScreenshotPath))}" alt="Mobile"></a></div>` : ''}
            ${page.tabletScreenshotPath ? `<div class="screenshot-item"><h4>Tablet (768x1024)</h4><a href="${escapeHtml(path.relative(OUTPUT_DIR, page.tabletScreenshotPath))}" target="_blank"><img src="${escapeHtml(path.relative(OUTPUT_DIR, page.tabletScreenshotPath))}" alt="Tablet"></a></div>` : ''}
          </div>
        </div>`;
    }

    return `
      <div class="page-card${isAuthPage ? ' auth-page' : ''}">
        <div class="page-header">
          <h2>${statusIcon} ${escapeHtml(page.name)}</h2>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <p class="page-description">${escapeHtml(page.description)}</p>
        <p class="page-url"><code>${escapeHtml(page.url)}</code></p>
        ${isAuthPage ? '<span class="auth-badge">📊 Mock Data</span>' : ''}
        ${page.error ? `<p class="error-message">❌ ${escapeHtml(page.error)}</p>` : ''}
        ${screenshotsHtml}
      </div>`;
  };

  // Separar páginas públicas e admin
  const publicPages = results.filter(r => !r.url.startsWith('/admin') || r.url === '/admin/login' || r.url === '/admin/signup');
  const adminPages = results.filter(r => r.url.startsWith('/admin') && r.url !== '/admin/login' && r.url !== '/admin/signup');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Validação Visual - PediAi</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
    header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .note-box { background: rgba(255,255,255,0.2); padding: 0.75rem 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.875rem; }
    .summary { display: flex; gap: 2rem; margin-top: 1rem; flex-wrap: wrap; }
    .summary-item { background: rgba(255,255,255,0.2); padding: 0.75rem 1.5rem; border-radius: 8px; }
    .summary-item .number { font-size: 1.5rem; font-weight: bold; }
    .summary-item .label { font-size: 0.875rem; opacity: 0.9; }
    .section-title { font-size: 1.5rem; margin: 2rem 0 1rem; color: #1a1a1a; }
    .pages-container { display: grid; gap: 1.5rem; }
    .page-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .page-card.auth-page { border-left: 4px solid #667eea; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .page-header h2 { font-size: 1.25rem; color: #1a1a1a; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .status-success { background: #dcfce7; color: #166534; }
    .status-error { background: #fee2e2; color: #991b1b; }
    .auth-badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; background: #e0e7ff; color: #4338ca; }
    .page-description { color: #666; margin-bottom: 0.5rem; }
    .page-url { margin-bottom: 1rem; }
    .page-url code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; color: #7c3aed; }
    .error-message { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 8px; margin: 1rem 0; }
    .screenshots h3 { font-size: 1rem; color: #333; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .screenshot-item { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .screenshot-item h4 { background: #f9fafb; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #666; border-bottom: 1px solid #e5e7eb; }
    .screenshot-item img { width: 100%; height: auto; display: block; cursor: pointer; }
    .screenshot-item img:hover { opacity: 0.9; }
    footer { text-align: center; padding: 2rem; color: #666; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📸 Relatório de Validação Visual</h1>
      <p>Relatório automático de screenshots das páginas do PediAi</p>
      <div class="note-box">📸 Páginas admin usam dados mockados para demonstração visual.</div>
      <div class="summary">
        <div class="summary-item"><div class="number">${results.length}</div><div class="label">Total</div></div>
        <div class="summary-item"><div class="number">${successfulPages}</div><div class="label">✅ Sucesso</div></div>
        <div class="summary-item"><div class="number">${results.length - successfulPages}</div><div class="label">❌ Erros</div></div>
        <div class="summary-item"><div class="number">${timestamp.split('T')[0]}</div><div class="label">Data</div></div>
      </div>
    </header>
    
    <h2 class="section-title">🌐 Páginas Públicas</h2>
    <div class="pages-container">
      ${publicPages.map(page => createPageCard(page, false)).join('')}
    </div>
    
    <h2 class="section-title">🔐 Páginas do Painel Administrativo (Mock Data)</h2>
    <div class="pages-container">
      ${adminPages.map(page => createPageCard(page, true)).join('')}
    </div>
    
    <footer>
      <p>Gerado automaticamente | Base URL: ${BASE_URL}</p>
      <p style="margin-top: 0.5rem;">📸 Screenshots das páginas admin usam dados mockados para demonstração visual.</p>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Gerando relatório de validação visual...\n');
  console.log('📝 Interceptando requisições API com dados mockados\n');

  // Verificar servidor
  try {
    const response = await fetch(BASE_URL);
    console.log(`✅ Servidor encontrado: ${BASE_URL} (${response.status})`);
  } catch {
    console.log(`❌ Servidor não está rodando em ${BASE_URL}`);
    console.log('   Execute: npm run dev');
    process.exit(1);
  }

  await ensureDir(OUTPUT_DIR);
  console.log(`📁 Saída: ${OUTPUT_DIR}\n`);

  // Iniciar browser
  console.log('🔧 Iniciando browser...\n');
  const browser = await chromium.launch({ headless: true });
  
  const results: PageResult[] = [];

  // Capturar páginas
  for (const page of PAGES_TO_CAPTURE) {
    console.log(`📄 ${page.name}${page.requiresAuth ? ' 🔐' : ''}`);
    const result = await capturePage(browser, BASE_URL, page);
    results.push(result);
  }

  // Finalizar
  await browser.close();
  console.log('\n✅ Concluído\n');

  // Gerar relatórios
  console.log('📝 Gerando relatórios...');
  const htmlReport = generateHTMLReport(results);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), htmlReport);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'results.json'), JSON.stringify(results, null, 2));
  console.log(`✅ Relatório: file://${OUTPUT_DIR}/index.html`);

  // Resumo
  const success = results.filter(r => r.status === 'success').length;
  console.log(`\n📊 ${results.length} páginas | ${success} ✅ | ${results.length - success} ❌\n`);
}

main().catch(console.error);
