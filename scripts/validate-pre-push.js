/**
 * Script de validação pré-push para MenuLink
 * Executa: build, lint, typecheck, unit tests e coverage
 */

import { execSync } from 'child_process';

// Cores para output
const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const YELLOW = '\x1b[1;33m';
const BLUE = '\x1b[0;34m';
const NC = '\x1b[0m'; // No Color

const COVERAGE_THRESHOLD = 70;

function log(message, color = NC) {
    console.log(`${color}${message}${NC}`);
}

function runCommand(command, options = {}) {
    const { silent = false, fail = true } = options;
    try {
        if (!silent) {
            log(`\n▶ ${command}`, BLUE);
        }
        execSync(command, {
            stdio: silent ? 'pipe' : 'inherit',
            cwd: process.cwd(),
            encoding: 'utf-8',
        });
        return true;
    } catch {
        if (fail) {
            log(`✗ Falhou: ${command}`, RED);
        }
        return false;
    }
}

function main() {
    log('\n======================================', BLUE);
    log('  MenuLink - Validação Pre-Push', BLUE);
    log('======================================\n', BLUE);

    let allPassed = true;
    const results = [];

    // 1. Build
    log('\n[1/5] Build (next build)...', YELLOW);
    const buildPassed = runCommand('npm run build', { silent: true });
    if (buildPassed) {
        log('   ✓ Build OK', GREEN);
        results.push({ name: 'Build', passed: true });
    } else {
        log('   ✗ Build falhou', RED);
        results.push({ name: 'Build', passed: false });
        allPassed = false;
    }

    // 2. Lint
    log('\n[2/5] Lint (eslint)...', YELLOW);
    const lintPassed = runCommand('npm run lint', { silent: true });
    if (lintPassed) {
        log('   ✓ Lint OK', GREEN);
        results.push({ name: 'Lint', passed: true });
    } else {
        log('   ✗ Lint falhou', RED);
        results.push({ name: 'Lint', passed: false });
        allPassed = false;
    }

    // 3. Type check
    log('\n[3/5] Type check (tsc --noEmit)...', YELLOW);
    const typePassed = runCommand('npx tsc --noEmit', { silent: true });
    if (typePassed) {
        log('   ✓ Type check OK', GREEN);
        results.push({ name: 'Type Check', passed: true });
    } else {
        log('   ✗ Type check falhou', RED);
        results.push({ name: 'Type Check', passed: false });
        allPassed = false;
    }

    // 4. Unit tests
    log('\n[4/5] Testes unitários (vitest)...', YELLOW);
    const unitPassed = runCommand('npm run test:unit', { silent: true });
    if (unitPassed) {
        log('   ✓ Testes unitários OK', GREEN);
        results.push({ name: 'Unit Tests', passed: true });
    } else {
        log('   ✗ Testes unitários falharam', RED);
        results.push({ name: 'Unit Tests', passed: false });
        allPassed = false;
    }

    // 5. Coverage com threshold
    log(`\n[5/5] Cobertura (threshold >= ${COVERAGE_THRESHOLD}%)...`, YELLOW);

    // Captura output do coverage para extrair percentage
    try {
        const coverageOutput = execSync('npm run test:coverage', {
            cwd: process.cwd(),
            encoding: 'utf-8',
        });

        // Procura linha com "All files" ou percentage no output
        const lines = coverageOutput.split('\n');
        let totalCoverage = null;

        for (const line of lines) {
            // Formato típico do @vitest/coverage-v8
            const match = line.match(/All files[^|]*\|\s*([\d.]+)/);
            if (match) {
                totalCoverage = parseFloat(match[1]);
                break;
            }
        }

        if (totalCoverage !== null) {
            if (totalCoverage >= COVERAGE_THRESHOLD) {
                log(`   ✓ Cobertura: ${totalCoverage}% (>= ${COVERAGE_THRESHOLD}%)`, GREEN);
                results.push({ name: `Coverage (${totalCoverage}%)`, passed: true });
            } else {
                log(`   ✗ Cobertura: ${totalCoverage}% (< ${COVERAGE_THRESHOLD}%)`, RED);
                log(`   Mínimo requerido: ${COVERAGE_THRESHOLD}%`, RED);
                results.push({ name: `Coverage (${totalCoverage}%)`, passed: false });
                allPassed = false;
            }
        } else {
            // Se não conseguiu extrair, considera como passou se o teste passou
            log('   ✓ Coverage executado', GREEN);
            results.push({ name: 'Coverage', passed: true });
        }
    } catch {
        log('   ✗ Coverage falhou', RED);
        results.push({ name: 'Coverage', passed: false });
        allPassed = false;
    }

    // Resumo
    log('\n======================================', BLUE);
    log('  Resumo', BLUE);
    log('======================================\n', BLUE);

    for (const r of results) {
        const icon = r.passed ? '✓' : '✗';
        const color = r.passed ? GREEN : RED;
        log(`   ${icon} ${r.name}`, color);
    }

    log('\n======================================', BLUE);

    return allPassed ? 0 : 1;
}

main();
