#!/usr/bin/env npx tsx
/**
 * Script para gerar relatório de validação visual de UI
 * 
 * Usa Playwright para navegar pelas páginas e tirar screenshots
 * Gera um relatório HTML com os resultados
 * 
 * Uso: npx tsx scripts/generate-ui-report.ts
 */

import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Configuração
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(process.cwd(), 'tests/e2e', 'ui-validation-report');

// Páginas para capturar (menu requer restaurante configurado no Supabase)
const PAGES_TO_CAPTURE = [
  {
    name: 'Landing Page',
    url: '/',
    description: 'Página inicial do PediAi com CTA para cadastro',
  },
  {
    name: 'Login Admin',
    url: '/admin/login',
    description: 'Página de login do painel administrativo',
  },
  {
    name: 'Cadastro Admin',
    url: '/admin/signup',
    description: 'Página de cadastro de novo restaurante',
  },
  {
    name: 'Landing Pizzaria',
    url: '/landing/pizzaria',
    description: 'Landing page segmentada para pizzarias',
  },
  {
    name: 'Landing Hamburgueria',
    url: '/landing/hamburgueria',
    description: 'Landing page segmentada para hamburguerias',
  },
  {
    name: 'Landing Bar',
    url: '/landing/bar',
    description: 'Landing page segmentada para bares',
  },
  {
    name: 'Landing Restaurante',
    url: '/landing/restaurante',
    description: 'Landing page segmentada para restaurantes',
  },
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

async function capturePage(
  browser: Browser,
  baseUrl: string,
  page: { name: string; url: string; description: string }
): Promise<PageResult> {
  const result: PageResult = {
    name: page.name,
    url: page.url,
    description: page.description,
    screenshotPath: null,
    status: 'error',
  };

  let context: BrowserContext | null = null;
  let browserPage: Page | null = null;

  try {
    // Desktop
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    browserPage = await context.newPage();
    
    const fullUrl = `${baseUrl}${page.url}`;
    console.log(`  📸 Capturando: ${fullUrl}`);
    
    const response = await browserPage.goto(fullUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    if (!response || response.status() >= 400) {
      result.error = `HTTP ${response?.status() || 'sem resposta'}`;
      console.log(`  ❌ Erro: ${result.error}`);
    } else {
      // Tirar screenshot desktop
      const desktopPath = path.join(OUTPUT_DIR, `desktop-${page.url.replace(/\//g, '-').replace(/^-/, '')}.png`);
      await browserPage.screenshot({
        path: desktopPath,
        fullPage: true,
      });
      result.screenshotPath = desktopPath;
      result.status = 'success';
      console.log(`  ✅ Desktop: ${desktopPath}`);
    }

    await context.close();
    context = null;

    // Mobile (375x667 - iPhone SE)
    context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
    });
    browserPage = await context.newPage();
    
    await browserPage.goto(fullUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const mobilePath = path.join(OUTPUT_DIR, `mobile-${page.url.replace(/\//g, '-').replace(/^-/, '')}.png`);
    await browserPage.screenshot({
      path: mobilePath,
      fullPage: true,
    });
    result.mobileScreenshotPath = mobilePath;
    console.log(`  ✅ Mobile: ${mobilePath}`);

    await context.close();
    context = null;

    // Tablet (768x1024 - iPad)
    context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
    });
    browserPage = await context.newPage();
    
    await browserPage.goto(fullUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const tabletPath = path.join(OUTPUT_DIR, `tablet-${page.url.replace(/\//g, '-').replace(/^-/, '')}.png`);
    await browserPage.screenshot({
      path: tabletPath,
      fullPage: true,
    });
    result.tabletScreenshotPath = tabletPath;
    console.log(`  ✅ Tablet: ${tabletPath}`);

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Erro desconhecido';
    console.log(`  ❌ Erro: ${result.error}`);
  } finally {
    if (context) await context.close().catch(() => {});
    if (browserPage) await browserPage.close().catch(() => {});
  }

  return result;
}

function generateHTMLReport(results: PageResult[]): string {
  const timestamp = new Date().toISOString();
  const successfulPages = results.filter(r => r.status === 'success').length;
  const failedPages = results.filter(r => r.status === 'error').length;

  const pagesHTML = results.map(page => {
    const statusIcon = page.status === 'success' ? '✅' : '❌';
    const statusClass = page.status === 'success' ? 'status-success' : 'status-error';
    
    return `
    <div class="page-card">
      <div class="page-header">
        <h2>${statusIcon} ${page.name}</h2>
        <span class="status-badge ${statusClass}">${page.status === 'success' ? 'Sucesso' : 'Erro'}</span>
      </div>
      <p class="page-description">${page.description}</p>
      <p class="page-url"><code>${page.url}</code></p>
      ${page.error ? `<p class="error-message">❌ ${page.error}</p>` : ''}
      
      ${page.status === 'success' ? `
      <div class="screenshots">
        <h3>Screenshots</h3>
        <div class="screenshot-grid">
          <div class="screenshot-item">
            <h4>Desktop (1280x720)</h4>
            <a href="${path.relative(OUTPUT_DIR, page.screenshotPath!)}" target="_blank">
              <img src="${path.relative(OUTPUT_DIR, page.screenshotPath!)}" alt="Desktop - ${page.name}" loading="lazy">
            </a>
          </div>
          ${page.mobileScreenshotPath ? `
          <div class="screenshot-item">
            <h4>Mobile (375x667)</h4>
            <a href="${path.relative(OUTPUT_DIR, page.mobileScreenshotPath)}" target="_blank">
              <img src="${path.relative(OUTPUT_DIR, page.mobileScreenshotPath)}" alt="Mobile - ${page.name}" loading="lazy">
            </a>
          </div>
          ` : ''}
          ${page.tabletScreenshotPath ? `
          <div class="screenshot-item">
            <h4>Tablet (768x1024)</h4>
            <a href="${path.relative(OUTPUT_DIR, page.tabletScreenshotPath)}" target="_blank">
              <img src="${path.relative(OUTPUT_DIR, page.tabletScreenshotPath)}" alt="Tablet - ${page.name}" loading="lazy">
            </a>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
    </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Validação Visual - PediAi</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .summary {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }
    
    .summary-item {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
    }
    
    .summary-item .number {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .summary-item .label {
      font-size: 0.875rem;
      opacity: 0.9;
    }
    
    .pages-container {
      display: grid;
      gap: 1.5rem;
    }
    
    .page-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .page-header h2 {
      font-size: 1.25rem;
      color: #1a1a1a;
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .status-success {
      background: #dcfce7;
      color: #166534;
    }
    
    .status-error {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .page-description {
      color: #666;
      margin-bottom: 0.5rem;
    }
    
    .page-url {
      margin-bottom: 1rem;
    }
    
    .page-url code {
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #7c3aed;
    }
    
    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.75rem;
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .screenshots h3 {
      font-size: 1rem;
      color: #333;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .screenshot-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .screenshot-item h4 {
      background: #f9fafb;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      color: #666;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .screenshot-item img {
      width: 100%;
      height: auto;
      display: block;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .screenshot-item img:hover {
      transform: scale(1.02);
    }
    
    footer {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .summary {
        flex-direction: column;
        gap: 1rem;
      }
      
      .screenshot-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📸 Relatório de Validação Visual</h1>
      <p>Relatório automático de screenshots das páginas do PediAi</p>
      <div class="summary">
        <div class="summary-item">
          <div class="number">${results.length}</div>
          <div class="label">Total de Páginas</div>
        </div>
        <div class="summary-item">
          <div class="number">${successfulPages}</div>
          <div class="label">✅ Sucesso</div>
        </div>
        <div class="summary-item">
          <div class="number">${failedPages}</div>
          <div class="label">❌ Erros</div>
        </div>
        <div class="summary-item">
          <div class="number">${timestamp.split('T')[0]}</div>
          <div class="label">Data</div>
        </div>
      </div>
    </header>
    
    <div class="pages-container">
      ${pagesHTML}
    </div>
    
    <footer>
      <p>Gerado automaticamente pelo script scripts/generate-ui-report.ts</p>
      <p>Base URL: ${BASE_URL}</p>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Gerando relatório de validação visual...\n');

  // Verificar se o servidor está rodando
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      console.log(`⚠️  Servidor respondeu com status ${response.status}`);
    } else {
      console.log(`✅ Servidor encontrado em ${BASE_URL}`);
    }
  } catch {
    console.log(`❌ Servidor não está rodando em ${BASE_URL}`);
    console.log('   Inicie o servidor com: npm run dev');
    console.log('   ou configure BASE_URL para a URL correta');
    process.exit(1);
  }

  // Criar diretório de saída
  await ensureDir(OUTPUT_DIR);
  console.log(`📁 Diretório de saída: ${OUTPUT_DIR}\n`);

  // Iniciar browser
  console.log('🔧 Iniciando browser...');
  const browser = await chromium.launch({ headless: true });
  console.log('✅ Browser iniciado\n');

  const results: PageResult[] = [];

  // Capturar cada página
  for (const page of PAGES_TO_CAPTURE) {
    console.log(`\n📄 Processando: ${page.name}`);
    const result = await capturePage(browser, BASE_URL, page);
    results.push(result);
  }

  // Fechar browser
  await browser.close();
  console.log('\n✅ Browser fechado\n');

  // Gerar relatório HTML
  console.log('📝 Gerando relatório HTML...');
  const htmlReport = generateHTMLReport(results);
  const reportPath = path.join(OUTPUT_DIR, 'index.html');
  fs.writeFileSync(reportPath, htmlReport);
  console.log(`✅ Relatório gerado: ${reportPath}`);

  // Salvar JSON com resultados
  const jsonPath = path.join(OUTPUT_DIR, 'results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`✅ Resultados salvos: ${jsonPath}`);

  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO');
  console.log('='.repeat(50));
  console.log(`Total de páginas: ${results.length}`);
  console.log(`Sucesso: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Erros: ${results.filter(r => r.status === 'error').length}`);
  console.log(`\n📁 Relatório: file://${reportPath}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
