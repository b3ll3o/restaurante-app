#!/usr/bin/env npx tsx
/**
 * Script para gerar relatório de validação visual de UI
 * Versão com verificação de autenticação e screenshot inteligente
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(process.cwd(), 'tests/e2e', 'ui-validation-report');

const AUTH_CREDENTIALS = {
  email: 'andreazzi-leonardo@hotmail.com',
  password: 'Teste@01',
};

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
  status: 'success' | 'error' | 'auth_failed';
  error?: string;
  mobileScreenshotPath?: string | null;
  tabletScreenshotPath?: string | null;
  authStatus?: 'authenticated' | 'unauthenticated' | 'not_attempted';
}

async function ensureDir(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function loginAndGetCookies(
  baseUrl: string
): Promise<{ cookies: any[]; storageState: string } | null> {
  console.log('  🔐 Fazendo login para obter cookies...');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext({ 
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true 
    });
    const page = await context.newPage();

    await page.goto(`${baseUrl}/admin/login`, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    // Aguardar campos do formulário
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

    // Preencher credenciais
    await page.fill('input[type="email"], input[name="email"]', AUTH_CREDENTIALS.email);
    await page.fill('input[type="password"], input[name="password"]', AUTH_CREDENTIALS.password);

    // Clicar no botão de login
    await page.click('button[type="submit"]');

    // Aguardar redirect para dashboard
    try {
      await page.waitForURL('**/admin/dashboard**', { timeout: 15000 });
      console.log('  ✅ Login realizado com sucesso - redirect para dashboard');
    } catch {
      const currentUrl = page.url();
      console.log(`  ⚠️ URL atual após login: ${currentUrl}`);
      
      // Verificar se há mensagem de erro na página
      const errorText = await page.locator('[class*="error"], [class*="Error"], [role="alert"]').first().textContent().catch(() => null);
      if (errorText) {
        console.log(`  ⚠️ Erro no login: ${errorText}`);
      }
      
      if (currentUrl.includes('/admin/login')) {
        console.log('  ⚠️ Login falhou - permanecendo na página de login');
      }
    }

    // Aguardar conteúdo carregar
    await page.waitForTimeout(2000);

    // Obter cookies
    const cookies = await context.cookies();
    console.log(`  📦 Obtidos ${cookies.length} cookies`);

    // Salvar storage state
    const storageState = await context.storageState();
    
    await browser.close();
    
    // Verificar se login foi bem sucedido
    const dashboardUrl = storageState.cookies?.some((c: any) => 
      c.name.includes('supabase') || c.name.includes('sb-')
    );
    
    if (cookies.length > 0 && dashboardUrl) {
      return { cookies, storageState };
    } else {
      console.log('  ⚠️ Login não foi totalmente bem succeed - autenticação pode não funcionar');
      return null;
    }

  } catch (error) {
    console.log(`  ❌ Erro no login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    await browser.close();
    return null;
  }
}

async function capturePage(
  browser: any,
  baseUrl: string,
  page: PageCapture,
  authStorageState?: string,
  isAuthenticated?: boolean
): Promise<PageResult> {
  const result: PageResult = {
    name: page.name,
    url: page.url,
    description: page.description,
    screenshotPath: null,
    status: 'error',
    authStatus: page.requiresAuth ? 'not_attempted' : 'not_attempted',
  };

  const fullUrl = `${baseUrl}${page.url}`;
  console.log(`  📸 ${fullUrl}${page.requiresAuth ? ' (autenticado)' : ''}`);

  const breakpoints = [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
  ];

  try {
    for (const bp of breakpoints) {
      const contextOptions: any = { 
        viewport: { width: bp.width, height: bp.height },
        ignoreHTTPSErrors: true 
      };
      
      if (page.requiresAuth && authStorageState) {
        contextOptions.storageState = authStorageState;
      }
      
      const context = await browser.newContext(contextOptions);
      const browserPage = await context.newPage();

      await browserPage.goto(fullUrl, { timeout: 30000, waitUntil: 'networkidle' });
      await browserPage.waitForTimeout(1000);

      // Verificar se está na página correta (não redirecionou para login)
      const currentUrl = browserPage.url();
      
      // Se requer autenticação e está na página de login, marcar como falha de auth
      if (page.requiresAuth && currentUrl.includes('/admin/login')) {
        result.authStatus = 'unauthenticated';
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

    // Se autenticação foi bem sucedida, marcar
    if (page.requiresAuth && isAuthenticated) {
      result.authStatus = 'authenticated';
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
  const authFailedPages = results.filter(r => r.authStatus === 'unauthenticated').length;
  const authenticatedPages = results.filter(r => r.authStatus === 'authenticated').length;

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
    .auth-info { background: rgba(255,255,255,0.2); padding: 0.75rem 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.875rem; }
    .warning-box { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    .summary { display: flex; gap: 2rem; margin-top: 1rem; flex-wrap: wrap; }
    .summary-item { background: rgba(255,255,255,0.2); padding: 0.75rem 1.5rem; border-radius: 8px; }
    .summary-item .number { font-size: 1.5rem; font-weight: bold; }
    .summary-item .label { font-size: 0.875rem; opacity: 0.9; }
    .section-title { font-size: 1.5rem; margin: 2rem 0 1rem; color: #1a1a1a; }
    .pages-container { display: grid; gap: 1.5rem; }
    .page-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .page-card.auth-page { border-left: 4px solid #667eea; }
    .page-card.auth-failed { border-left: 4px solid #f59e0b; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .page-header h2 { font-size: 1.25rem; color: #1a1a1a; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .status-success { background: #dcfce7; color: #166534; }
    .status-error { background: #fee2e2; color: #991b1b; }
    .status-warning { background: #fef3c7; color: #92400e; }
    .auth-badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; }
    .auth-authenticated { background: #dcfce7; color: #166534; }
    .auth-unauthenticated { background: #fee2e2; color: #991b1b; }
    .auth-not-attempted { background: #e0e7ff; color: #4338ca; }
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
      <div class="auth-info">🔐 Testes realizados com: <strong>${AUTH_CREDENTIALS.email}</strong></div>
      ${authFailedPages > 0 ? `
      <div class="warning-box">
        ⚠️ <strong>Atenção:</strong> ${authFailedPages} páginas requerem autenticação mas o login falhou. 
        Screenshots podem mostrar a página de login em vez do conteúdo esperado.
      </div>
      ` : ''}
      <div class="summary">
        <div class="summary-item"><div class="number">${results.length}</div><div class="label">Total</div></div>
        <div class="summary-item"><div class="number">${successfulPages}</div><div class="label">✅ Sucesso</div></div>
        <div class="summary-item"><div class="number">${authFailedPages}</div><div class="label">⚠️ Auth Falhou</div></div>
        <div class="summary-item"><div class="number">${results.length - successfulPages}</div><div class="label">❌ Erros</div></div>
        <div class="summary-item"><div class="number">${timestamp.split('T')[0]}</div><div class="label">Data</div></div>
      </div>
    </header>
    
    <h2 class="section-title">🌐 Páginas Públicas</h2>
    <div class="pages-container">
      ${results.filter(r => !r.url.startsWith('/admin') || r.url === '/admin/login' || r.url === '/admin/signup').map(page => {
        const authBadgeClass = page.authStatus === 'authenticated' ? 'auth-authenticated' : 
                              page.authStatus === 'unauthenticated' ? 'auth-unauthenticated' : 'auth-not-attempted';
        const authBadgeText = page.authStatus === 'authenticated' ? '🔐 Autenticado' : 
                            page.authStatus === 'unauthenticated' ? '⚠️ Não autenticado' : '';
        const cardClass = page.authStatus === 'unauthenticated' ? 'auth-failed' : '';
        
        return `
        <div class="page-card ${cardClass}">
          <div class="page-header">
            <h2>${page.status === 'success' ? '✅' : '❌'} ${page.name}</h2>
            <span class="status-badge ${page.status === 'success' ? 'status-success' : 'status-error'}">${page.status === 'success' ? 'Sucesso' : 'Erro'}</span>
          </div>
          <p class="page-description">${page.description}</p>
          <p class="page-url"><code>${page.url}</code></p>
          ${authBadgeText ? `<span class="auth-badge ${authBadgeClass}">${authBadgeText}</span>` : ''}
          ${page.error ? `<p class="error-message">❌ ${page.error}</p>` : ''}
          ${page.status === 'success' ? `
          <div class="screenshots">
            <h3>Screenshots</h3>
            <div class="screenshot-grid">
              ${page.screenshotPath ? `<div class="screenshot-item"><h4>Desktop (1280x720)</h4><a href="${path.relative(OUTPUT_DIR, page.screenshotPath)}" target="_blank"><img src="${path.relative(OUTPUT_DIR, page.screenshotPath)}" alt="Desktop"></a></div>` : ''}
              ${page.mobileScreenshotPath ? `<div class="screenshot-item"><h4>Mobile (375x667)</h4><a href="${path.relative(OUTPUT_DIR, page.mobileScreenshotPath)}" target="_blank"><img src="${path.relative(OUTPUT_DIR, page.mobileScreenshotPath)}" alt="Mobile"></a></div>` : ''}
              ${page.tabletScreenshotPath ? `<div class="screenshot-item"><h4>Tablet (768x1024)</h4><a href="${path.relative(OUTPUT_DIR, page.tabletScreenshotPath)}" target="_blank"><img src="${path.relative(OUTPUT_DIR, page.tabletScreenshotPath)}" alt="Tablet"></a></div>` : ''}
            </div>
          </div>` : ''}
        </div>`;
      }).join('')}
    </div>
    
    <h2 class="section-title">🔐 Páginas do Painel Administrativo</h2>
    <div class="pages-container">
      ${results.filter(r => r.url.startsWith('/admin') && r.url !== '/admin/login' && r.url !== '/admin/signup').map(page => {
        const authBadgeClass = page.authStatus === 'authenticated' ? 'auth-authenticated' : 
                              page.authStatus === 'unauthenticated' ? 'auth-unauthenticated' : 'auth-not-attempted';
        const authBadgeText = page.authStatus === 'authenticated' ? '🔐 Autenticado' : 
                            page.authStatus === 'unauthenticated' ? '⚠️ NÃO AUTENTICADO' : '';
        const cardClass = page.authStatus === 'unauthenticated' ? 'auth-failed' : '';
        
        return `
        <div class="page-card auth-page ${cardClass}">
          <div class="page-header">
            <h2>${page.status === 'success' ? '✅' : '❌'} ${page.name}</h2>
            <span class="status-badge ${page.status === 'success' ? (page.authStatus === 'unauthenticated' ? 'status-warning' : 'status-success') : 'status-error'}">
              ${page.status === 'success' ? (page.authStatus === 'unauthenticated' ? 'Auth Falhou' : 'Sucesso') : 'Erro'}
            </span>
          </div>
          <p class="page-description">${page.description}</p>
          <p class="page-url"><code>${page.url}</code></p>
          <span class="auth-badge ${authBadgeClass}">🔐 Requer autenticação</span>
          ${authBadgeText ? `<span class="auth-badge ${authBadgeClass}">${authBadgeText}</span>` : ''}
          ${page.error ? `<p class="error-message">❌ ${page.error}</p>` : ''}
          ${page.status === 'success' ? `
          <div class="screenshots">
            <h3>Screenshots</h3>
            <div class="screenshot-grid">
              ${page.screenshotPath ? `<div class="screenshot-item"><h4>Desktop (1280x720)</h4><a href="${path.relative(OUTPUT_DIR, page.screenshotPath)}" target="_blank"><img src="${path.relative(OUTPUT_DIR, page.screenshotPath)}" alt="Desktop"></a></div>` : ''}
              ${page.mobileScreenshotPath ? `<div class="screenshot-item"><h4>Mobile (375x667)</h4><a href="${path.relative(OUTPUT_DIR, page.mobileScreenshotPath)}" target="_blank"><img src="${path.relative(OUTPUT_DIR, page.mobileScreenshotPath)}" alt="Mobile"></a></div>` : ''}
              ${page.tabletScreenshotPath ? `<div class="screenshot-item"><h4>Tablet (768x1024)</h4><a href="${path.relative(OUTPUT_DIR, page.tabletScreenshotPath)}" target="_blank"><img src="${path.relative(OUTPUT_DIR, page.tabletScreenshotPath)}" alt="Tablet"></a></div>` : ''}
            </div>
          </div>` : ''}
        </div>`;
      }).join('')}
    </div>
    
    <footer>
      <p>Gerado automaticamente | Base URL: ${BASE_URL} | Usuário: ${AUTH_CREDENTIALS.email}</p>
      <p style="margin-top: 0.5rem;">⚠️ Se páginas autenticadas mostram tela de login, o login no Supabase pode ter falhado.</p>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Gerando relatório de validação visual...\n');
  console.log(`📧 Usuário: ${AUTH_CREDENTIALS.email}\n`);

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
  console.log('🔧 Iniciando browser...');
  const browser = await chromium.launch({ headless: true });
  console.log('');

  // Obter cookies de autenticação
  const authResult = await loginAndGetCookies(BASE_URL);
  const storageState = authResult?.storageState;
  const isAuthenticated = !!storageState && authResult && authResult.cookies.length > 0;
  
  if (!isAuthenticated) {
    console.log('⚠️ Autenticação NÃO funcionou - páginas protegidas mostrarão tela de login\n');
  } else {
    console.log('✅ Autenticação funcionou - páginas protegidas terão acesso\n');
  }
  
  const results: PageResult[] = [];

  // Capturar páginas
  for (const page of PAGES_TO_CAPTURE) {
    console.log(`\n📄 ${page.name}${page.requiresAuth ? ' 🔐' : ''}`);
    const result = await capturePage(browser, BASE_URL, page, storageState, isAuthenticated);
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
  const authFailed = results.filter(r => r.authStatus === 'unauthenticated').length;
  console.log(`\n📊 ${results.length} páginas | ${success} ✅ | ${authFailed} ⚠️ Auth | ${results.length - success} ❌\n`);
}

main().catch(console.error);
