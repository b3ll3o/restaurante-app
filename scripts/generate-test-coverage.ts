#!/usr/bin/env npx tsx

/**
 * Script: generate-test-coverage.ts
 * Responsabilidade: Gerar relatório de cobertura de testes E2E mapeando rotas, specs e BDD
 * 
 * Usage: npx tsx scripts/generate-test-coverage.ts
 */

import fs from 'fs';
import path from 'path';

// =============================================================================
// TYPES
// =============================================================================

type RouteStatus = 'green' | 'yellow' | 'red';
type RouteType = 'page' | 'api';

interface Route {
  path: string;
  type: RouteType;
  filePath: string;
  tests: string[];
  bdds: string[];
  status: RouteStatus;
  scenarios: number;
}

interface CoverageReport {
  generated: string;
  routes: Route[];
  summary: {
    total: number;
    green: number;
    yellow: number;
    red: number;
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PROJECT_ROOT = process.cwd();
const APP_DIR = path.resolve(PROJECT_ROOT, 'app');
const TESTS_E2E_DIR = path.resolve(PROJECT_ROOT, 'tests/e2e');
const OUTPUT_DIR = TESTS_E2E_DIR;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Lê recursivamente arquivos em um diretório
 */
function readdirRecursive(dir: string, extensions: string[] = []): string[] {
  const results: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...readdirRecursive(fullPath, extensions));
    } else if (entry.isFile()) {
      if (extensions.length === 0 || extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

/**
 * Converte caminho de arquivo para path da rota
 * app/admin/login/page.tsx → /admin/login
 * app/menu/[slug]/page.tsx → /menu/[slug]
 * app/api/orders/route.ts → /api/orders
 */
function filePathToRoute(filePath: string): string {
  const relativePath = path.relative(APP_DIR, filePath);
  const parts = relativePath.split(path.sep);
  
  // Remove extension
  const lastPart = parts[parts.length - 1];
  const withoutExt = lastPart.replace(/\.(tsx|ts)$/, '');
  
  // Handle page.tsx or route.ts
  if (withoutExt === 'page') {
    parts.pop(); // Remove page.tsx
  } else if (withoutExt === 'route') {
    parts.pop(); // Remove route.ts
    parts.push('route'); // Add 'route' to indicate API
  }
  
  if (parts.length === 0) {
    return '/';
  }
  
  // Handle index routes
  const routePath = '/' + parts.join('/').replace(/\/index$/, '');
  
  return routePath === '/index' ? '/' : routePath;
}

/**
 * Determina o tipo da rota (page ou api)
 */
function getRouteType(filePath: string): RouteType {
  if (filePath.includes('/api/') || filePath.endsWith('route.ts')) {
    return 'api';
  }
  return 'page';
}

/**
 * Infere caminho do teste E2E baseado na proximidade
 * app/admin/login/page.tsx → tests/e2e/admin/login.spec.ts
 * app/menu/[slug]/page.tsx → tests/e2e/public/menu.spec.ts
 */
function inferE2ETestPath(route: Route): string | null {
  const { path: routePath, type } = route;
  
  // Special handling for menu routes
  if (routePath.startsWith('/menu/')) {
    const e2ePath = path.join(TESTS_E2E_DIR, 'public', 'menu.spec.ts');
    if (fs.existsSync(e2ePath)) return e2ePath;
  }
  
  // For API routes, map to api folder
  if (type === 'api') {
    const segments = routePath.split('/').filter(Boolean);
    const apiSegment = segments[1] || 'orders'; // Default to orders for /api
    const e2ePath = path.join(TESTS_E2E_DIR, 'api', `${apiSegment}.spec.ts`);
    if (fs.existsSync(e2ePath)) return e2ePath;
  }
  
  // Standard admin mapping
  if (routePath.startsWith('/admin/')) {
    const segments = routePath.split('/').filter(Boolean);
    // /admin/login -> ['admin', 'login']
    if (segments.length >= 2) {
      const [, page] = segments;
      const e2ePath = path.join(TESTS_E2E_DIR, 'admin', `${page}.spec.ts`);
      if (fs.existsSync(e2ePath)) return e2ePath;
    }
  }
  
  return null;
}

/**
 * Infere caminho do arquivo BDD baseado na proximidade
 * app/admin/login/page.tsx → app/admin/login/login.feature
 */
function inferBDDFeaturePath(route: Route): string | null {
  const { filePath } = route;
  
  // Get the directory of the route file
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath).replace(/\.(tsx|ts)$/, '');
  
  // For page.tsx, use the parent directory + page name
  // For route.ts, use the parent directory + route name
  const featureName = fileName === 'page' || fileName === 'route' 
    ? path.basename(dir) 
    : fileName;
  
  const featurePath = path.join(dir, `${featureName}.feature`);
  
  if (fs.existsSync(featurePath)) {
    return featurePath;
  }
  
  return null;
}

/**
 * Conta cenários em arquivo .feature
 * Usa regex /^Cenário:|^Scenario:/im
 */
function countScenarios(featurePath: string): number {
  if (!fs.existsSync(featurePath)) {
    return 0;
  }
  
  const content = fs.readFileSync(featurePath, 'utf-8');
  const matches = content.match(/^Cenário:|^Scenario:/gim);
  
  return matches ? matches.length : 0;
}

/**
 * Calcula status da rota baseado em testes E2E e BDD
 * green: tem E2E E BDD
 * yellow: tem apenas E2E OU apenas BDD
 * red: não tem E2E nem BDD
 */
function calculateStatus(route: Route): RouteStatus {
  const hasE2E = route.tests.length > 0;
  const hasBDD = route.bdds.length > 0;
  
  if (hasE2E && hasBDD) {
    return 'green';
  }
  if (hasE2E || hasBDD) {
    return 'yellow';
  }
  return 'red';
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Escaneia todas as rotas em app/
 */
function scanRoutes(): Route[] {
  const routes: Route[] = [];
  
  // Find all page.tsx files
  const pageFiles = readdirRecursive(APP_DIR, ['.tsx']);
  
  // Find all route.ts files
  const routeFiles = readdirRecursive(APP_DIR, ['.ts']).filter(f => f.endsWith('route.ts'));
  
  // Process page routes
  for (const filePath of pageFiles) {
    const routePath = filePathToRoute(filePath);
    const type = getRouteType(filePath);
    
    routes.push({
      path: routePath,
      type,
      filePath,
      tests: [],
      bdds: [],
      status: 'red',
      scenarios: 0,
    });
  }
  
  // Process API routes
  for (const filePath of routeFiles) {
    const routePath = filePathToRoute(filePath);
    
    routes.push({
      path: routePath,
      type: 'api',
      filePath,
      tests: [],
      bdds: [],
      status: 'red',
      scenarios: 0,
    });
  }
  
  return routes;
}

/**
 * Mapeia testes E2E para cada rota
 */
function mapE2ETests(routes: Route[]): Route[] {
  return routes.map(route => {
    const e2ePath = inferE2ETestPath(route);
    return {
      ...route,
      tests: e2ePath ? [e2ePath] : [],
    };
  });
}

/**
 * Mapeia arquivos BDD para cada rota
 */
function mapBDDFeatures(routes: Route[]): Route[] {
  return routes.map(route => {
    const bddPath = inferBDDFeaturePath(route);
    return {
      ...route,
      bdds: bddPath ? [bddPath] : [],
    };
  });
}

/**
 * Adiciona contagem de cenários para cada rota
 */
function addScenarioCounts(routes: Route[]): Route[] {
  return routes.map(route => ({
    ...route,
    scenarios: route.bdds.reduce((sum, bdd) => sum + countScenarios(bdd), 0),
  }));
}

/**
 * Calcula status final para cada rota
 */
function calculateRouteStatus(routes: Route[]): Route[] {
  return routes.map(route => ({
    ...route,
    status: calculateStatus(route),
  }));
}

/**
 * Gera relatório JSON
 */
function generateJSON(report: CoverageReport, outputPath: string): void {
  const json = JSON.stringify(report, null, 2);
  fs.writeFileSync(outputPath, json, 'utf-8');
  console.log(`JSON report written to ${outputPath}`);
}

/**
 * Gera relatório HTML
 */
function generateHTML(report: CoverageReport, outputPath: string): void {
  const statusColors: Record<RouteStatus, string> = {
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
  };
  
  const statusLabels: Record<RouteStatus, string> = {
    green: '🟢 Green',
    yellow: '🟡 Yellow',
    red: '🔴 Red',
  };
  
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Cobertura E2E - PediAi</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.5rem; }
    .subtitle { color: #64748b; margin-bottom: 2rem; }
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
    .card-value { font-size: 2.5rem; font-weight: 700; }
    .card-label { font-size: 0.875rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .card.total { border-left: 4px solid #3b82f6; }
    .card.green { border-left: 4px solid #22c55e; }
    .card.yellow { border-left: 4px solid #eab308; }
    .card.red { border-left: 4px solid #ef4444; }
    table { width: 100%; background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    th { background: #f1f5f9; text-align: left; padding: 1rem; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
    td { padding: 1rem; border-top: 1px solid #e2e8f0; }
    tr:hover { background: #f8fafc; }
    .status-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .link { color: #3b82f6; text-decoration: none; }
    .link:hover { text-decoration: underline; }
    .none { color: #94a3b8; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Relatório de Cobertura de Testes E2E</h1>
    <p class="subtitle">Gerado em: ${new Date(report.generated).toLocaleString('pt-BR')}</p>
    
    <div class="summary-cards">
      <div class="card total">
        <div class="card-value">${report.summary.total}</div>
        <div class="card-label">Total de Rotas</div>
      </div>
      <div class="card green">
        <div class="card-value">${report.summary.green}</div>
        <div class="card-label">Green (E2E + BDD)</div>
      </div>
      <div class="card yellow">
        <div class="card-value">${report.summary.yellow}</div>
        <div class="card-label">Yellow (E2E ou BDD)</div>
      </div>
      <div class="card red">
        <div class="card-value">${report.summary.red}</div>
        <div class="card-label">Red (Sem Cobertura)</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Path</th>
          <th>Type</th>
          <th>Tests</th>
          <th>BDDs</th>
          <th>Status</th>
          <th>Scenarios</th>
        </tr>
      </thead>
      <tbody>
        ${report.routes.map(route => `
          <tr>
            <td><strong>${route.path}</strong></td>
            <td>${route.type === 'api' ? 'API' : 'Page'}</td>
            <td>${route.tests.length > 0 
              ? `<a class="link" href="${route.tests[0]}">${path.basename(route.tests[0])}</a>` 
              : '<span class="none">—</span>'}</td>
            <td>${route.bdds.length > 0 
              ? `<a class="link" href="${route.bdds[0]}">${path.basename(route.bdds[0])}</a>` 
              : '<span class="none">—</span>'}</td>
            <td><span class="status-badge" style="background: ${statusColors[route.status]}20; color: ${statusColors[route.status]};">${statusLabels[route.status]}</span></td>
            <td>${route.scenarios}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`HTML report written to ${outputPath}`);
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

function main(): void {
  console.log('🔍 Scanning routes...');
  
  // Phase 1 & 2: Scan routes and map tests/BDD
  let routes = scanRoutes();
  routes = mapE2ETests(routes);
  routes = mapBDDFeatures(routes);
  routes = addScenarioCounts(routes);
  routes = calculateRouteStatus(routes);
  
  // Calculate summary
  const summary = {
    total: routes.length,
    green: routes.filter(r => r.status === 'green').length,
    yellow: routes.filter(r => r.status === 'yellow').length,
    red: routes.filter(r => r.status === 'red').length,
  };
  
  // Create report
  const report: CoverageReport = {
    generated: new Date().toISOString(),
    routes,
    summary,
  };
  
  // Phase 3: Generate outputs
  const jsonPath = path.join(OUTPUT_DIR, 'coverage-report.json');
  const htmlPath = path.join(OUTPUT_DIR, 'coverage-report.html');
  
  generateJSON(report, jsonPath);
  generateHTML(report, htmlPath);
  
  // Log summary
  console.log('\n📊 Summary:');
  console.log(`   Total: ${summary.total}`);
  console.log(`   🟢 Green: ${summary.green}`);
  console.log(`   🟡 Yellow: ${summary.yellow}`);
  console.log(`   🔴 Red: ${summary.red}`);
}

main();
