# Scripts - PediAi

## Visão Geral

O diretório **scripts/** contém scripts utilitários para build, quality e automação do projeto PediAi.

**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
scripts/
├── generate-test-coverage.ts    # Gerador de relatório de cobertura E2E
└── AGENTS.md                    # Este arquivo
```

---

## Script: generate-test-coverage.ts

### Responsabilidade

Gerar relatório de cobertura de testes E2E mapeando todas as rotas da aplicação (`app/`), seus arquivos de teste E2E correspondentes (`tests/e2e/`) e cenários BDD (arquivos `.feature`).

### Arquitetura

O script executa as seguintes fases:

1. **Scan Routes**: Varre `app/` recursivamente buscando `page.tsx` e `route.ts`
2. **Map E2E Tests**: Para cada rota, infere o caminho do teste E2E usando convenção de proximidade
3. **Map BDD Features**: Para cada rota, busca arquivo `.feature` na mesma pasta
4. **Count Scenarios**: Conta cenários BDD usando regex `/^Cenário:|^Scenario:/im`
5. **Calculate Status**: Aplica lógica de status:
   - 🟢 **green**: Rota tem E2E **E** BDD
   - 🟡 **yellow**: Rota tem apenas E2E **ou** apenas BDD
   - 🔴 **red**: Rota não tem E2E nem BDD
6. **Generate JSON**: Escreve `tests/e2e/coverage-report.json`
7. **Generate HTML**: Escreve `tests/e2e/coverage-report.html`

### Interface Pública

#### Tipos

```typescript
type RouteStatus = 'green' | 'yellow' | 'red';
type RouteType = 'page' | 'api';

interface Route {
  path: string;           // e.g., "/admin/login"
  type: RouteType;        // 'page' | 'api'
  filePath: string;       // absolute path to file
  tests: string[];        // paths of E2E specs
  bdds: string[];         // paths of .feature files
  status: RouteStatus;   // green | yellow | red
  scenarios: number;      // count of scenarios in BDD files
}

interface CoverageReport {
  generated: string;      // ISO-8601 timestamp
  routes: Route[];
  summary: {
    total: number;
    green: number;
    yellow: number;
    red: number;
  };
}
```

#### Funções Exportadas

O script não exporta funções (é um script standalone executável), mas expõe as seguintes funcionalidades via CLI:

- `npm run test:coverage:e2e` — Gera os relatórios JSON e HTML

### Mapeamento de Rotas

O script segue convenção de proximidade para mapear rotas para testes:

| Rota | Arquivo E2E | Arquivo BDD |
|------|-------------|-------------|
| `app/admin/login/page.tsx` | `tests/e2e/admin/login.spec.ts` | `app/admin/login/login.feature` |
| `app/menu/[slug]/page.tsx` | `tests/e2e/public/menu.spec.ts` | `app/menu/[slug]/menu.feature` |
| `app/api/orders/route.ts` | `tests/e2e/api/orders.spec.ts` | `app/api/orders/orders.feature` |

### Output

| Arquivo | Descrição |
|---------|-----------|
| `tests/e2e/coverage-report.json` | Relatório estruturado em JSON |
| `tests/e2e/coverage-report.html` | Relatório visual em HTML com CSS inline |

### Uso

```bash
# Gerar relatório de cobertura E2E
npm run test:coverage:e2e

# O script também pode ser executado diretamente com tsx
npx tsx scripts/generate-test-coverage.ts
```

### Exemplo de Output JSON

```json
{
  "generated": "2026-04-17T12:00:00.000Z",
  "routes": [
    {
      "path": "/admin/login",
      "type": "page",
      "tests": ["tests/e2e/admin/login.spec.ts"],
      "bdds": ["app/admin/login/login.feature"],
      "status": "green",
      "scenarios": 4
    }
  ],
  "summary": {
    "total": 10,
    "green": 4,
    "yellow": 2,
    "red": 4
  }
}
```

### Exemplo de Output HTML

O HTML inclui:
- Cards de resumo (total, green, yellow, red)
- Tabela com todas as rotas
- Links para arquivos de teste e BDD
- Badges coloridos para status

---

## Regras de Implementação

1. **Sem dependências externas**: O script usa apenas APIs nativas do Node.js (`fs`, `path`)
2. **TypeScript nativo**: Executado via `tsx` sem build prévio
3. **Convenção de proximidade**: Segue a mesma regra de proximidade do BDD
4. **Status semântico**: green/yellow/red baseado na presença de E2E e BDD

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Rotas com coverage (green) | 100% | Alta |
| Tempo de execução | <5s | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| tsx | ^4.0.0 | Executar TypeScript diretamente |

---

## Referências

- [tests/e2e/AGENTS.md](../tests/e2e/AGENTS.md) - Documentação dos testes E2E
- [opencode/openspec/specs/pediai-quality-rules.md](../opencode/openspec/specs/pediai-quality-rules.md) - Regras de qualidade

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
