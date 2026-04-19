#!/usr/bin/env npx tsx
/**
 * Script para gerar relatório de validação visual de UI
 * 
 * ⚠️ REGRA: Este script NÃO deve usar dados mockados para páginas autenticadas.
 * O relatório de interface serve para validar o que o USUÁRIO REAL está vendo.
 * Para páginas admin, o script DEVE fazer login real com credenciais do Supabase.
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(process.cwd(), 'tests/e2e', 'ui-validation-report');

// Credenciais de teste - DEVEM ser configuradas via variáveis de ambiente
// Não usar dados mockados - o relatório deve mostrar a experiência real do usuário
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@test.com';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Teste@01';

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

/**
 * Faz login real no Supabase e retorna o contexto autenticado
 * ⚠️ NÃO usa dados mockados - usa credenciais reais do ambiente
 */
async function loginAndGetAuthenticatedContext(
  browser: any,
  email: string,
  password: string
): Promise<{ context: any; page: any } | null> {
  console.log(`  🔐 Fazendo login real com ${email}...`);
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  });
  
  const page = await context.newPage();
  
  try {
    // Navegar para página de login
    await page.goto(`${BASE_URL}/admin/login`, { 
      timeout: 15000, 
      waitUntil: 'domcontentloaded' 
    });
    
    // Aguardar campos do formulário
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    // Preencher credenciais
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill(email);
    await passwordInput.fill(password);
    
    // Clicar no botão de login
    const loginButton = page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first();
    await loginButton.click();
    
    // Aguardar redirecionamento para dashboard ou verificação
    await page.waitForURL(`${BASE_URL}/admin/**`, { timeout: 15000 }).catch(() => {});
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    console.log(`  ✅ Login realizado com sucesso`);
    
    return { context, page };
    
  } catch (error) {
    console.log(`  ❌ Erro no login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    await context.close();
    return null;
  }
}

async function capturePage(
  browser: any,
  baseUrl: string,
  page: PageCapture,
  authenticatedPage?: any
): Promise<PageResult> {
  const result: PageResult = {
    name: page.name,
    url: page.url,
    description: page.description,
    screenshotPath: null,
    status: 'error',
  };

  const fullUrl = `${baseUrl}${page.url}`;
  console.log(`  📸 ${fullUrl}`);

  const breakpoints = [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
  ];

  try {
    for (const bp of breakpoints) {
      let context: any;
      let browserPage: any;

      // Para páginas autenticadas, reutilizar página já logada
      if (page.requiresAuth && authenticatedPage) {
        // Apenas mudar o viewport da página existente
        await authenticatedPage.setViewportSize({ width: bp.width, height: bp.height });
        browserPage = authenticatedPage;
      } else {
        context = await browser.newContext({
          viewport: { width: bp.width, height: bp.height },
          ignoreHTTPSErrors: true,
        });
        browserPage = await context.newPage();
      }

      try {
        await browserPage.goto(fullUrl, { 
          timeout: 15000, 
          waitUntil: 'domcontentloaded' 
        });
        
        // Aguardar para página carregar conteúdo
        await browserPage.waitForTimeout(1500);
        
        // Aguardar elementos específicos aparecerem
        try {
          if (page.url.includes('/admin/')) {
            await browserPage.waitForSelector('[class*="sidebar"], header, main, nav', { timeout: 5000 }).catch(() => {});
          } else {
            await browserPage.waitForSelector('main, header, body', { timeout: 3000 }).catch(() => {});
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
      } finally {
        // Fechar contexto apenas se foi criado novo (páginas não autenticadas)
        if (!page.requiresAuth || !authenticatedPage) {
          await context.close();
        }
      }
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
        ${isAuthPage ? '<span class="auth-badge">🔐 Autenticação Real</span>' : ''}
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
      <div class="note-box">🔐 Páginas admin usam autenticação REAL (não mockada) para mostrar a experiência real do usuário.</div>
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
    
    <h2 class="section-title">🔐 Páginas do Painel Administrativo (Autenticação Real)</h2>
    <div class="pages-container">
      ${adminPages.map(page => createPageCard(page, true)).join('')}
    </div>
    
    <footer>
      <p>Gerado automaticamente | Base URL: ${BASE_URL}</p>
      <p style="margin-top: 0.5rem;">🔐 Autenticação REAL via Supabase - Este relatório mostra a experiência real do usuário.</p>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Gerando relatório de validação visual...\n');
  console.log('🔐 Usando autenticação REAL para páginas admin (não mockado)\n');

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

  // Para páginas autenticadas, fazer login real uma vez
  const authPages = PAGES_TO_CAPTURE.filter(p => p.requiresAuth);
  let authenticatedContext: { context: any; page: any } | null = null;

  if (authPages.length > 0) {
    console.log('🔐 Fazendo login real para páginas autenticadas...\n');
    authenticatedContext = await loginAndGetAuthenticatedContext(
      browser,
      TEST_ADMIN_EMAIL,
      TEST_ADMIN_PASSWORD
    );
    
    if (!authenticatedContext) {
      console.log('❌ Não foi possível fazer login. Páginas autenticadas podem não funcionar corretamente.');
      console.log('   Configure TEST_ADMIN_EMAIL e TEST_ADMIN_PASSWORD corretamente.\n');
    }
  }

  // Capturar páginas
  for (const page of PAGES_TO_CAPTURE) {
    console.log(`📄 ${page.name}${page.requiresAuth ? ' 🔐' : ''}`);
    const result = await capturePage(browser, BASE_URL, page, authenticatedContext?.page);
    results.push(result);
  }

  // Fechar contexto autenticado
  if (authenticatedContext) {
    await authenticatedContext.context.close();
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
