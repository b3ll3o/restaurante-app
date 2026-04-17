# Delta for Test Coverage

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e define os requisitos para o sistema de relatório de cobertura de testes E2E.

---

## ADDED Requirements

### REQ-COVER-001: Script de Cobertura de Testes E2E

O sistema DEVE fornecer um script Node.js que varre todas as rotas da aplicação, identifica testes E2E correspondentes e cenários BDD, e gera um relatório de cobertura.

#### Cenário: Execução bem-sucedida do script de coverage
- **GIVEN** o diretório `app/` contém rotas da aplicação
- **AND** o diretório `tests/e2e/` contém testes Playwright
- **AND** arquivos `.feature` existem mapeados por rota
- **WHEN** o comando `npm run test:coverage:e2e` é executado
- **THEN** o sistema DEVE gerar `tests/e2e/coverage-report.json`
- **AND** o sistema DEVE gerar `tests/e2e/coverage-report.html`

---

### REQ-COVER-002: Varredura de Rotas

O sistema DEVE varrer o diretório `app/` e identificar todas as rotas da aplicação, incluindo:

- Rotas de página (`app/*/page.tsx`)
- Rotas dinâmicas (`app/*/[param]/page.tsx`)
- Rotas de API (`app/api/*/route.ts`)

#### Cenário: Identificar rotas de página
- **GIVEN** a estrutura de diretórios `app/admin/`, `app/menu/`, `app/api/`
- **WHEN** o script de coverage executa
- **THEN** o sistema DEVE identificar `/admin/login`, `/admin/dashboard`, `/admin/categories`
- **AND** o sistema DEVE identificar `/menu/[slug]`
- **AND** o sistema DEVE identificar `/api/orders`

---

### REQ-COVER-003: Mapeamento de Testes E2E

O sistema DEVE mapear cada rota para seus arquivos de teste E2E correspondentes em `tests/e2e/**/*.spec.ts`.

#### Cenário: Teste E2E existente para rota
- **GIVEN** a rota `/admin/login`
- **AND** o arquivo `tests/e2e/admin/login.spec.ts` existe
- **WHEN** o script de coverage executa
- **THEN** a rota `/admin/login` DEVE ter `tests` contendo `["tests/e2e/admin/login.spec.ts"]`

#### Cenário: Nenhum teste E2E para rota
- **GIVEN** a rota `/admin/settings`
- **AND** nenhum arquivo `tests/e2e/admin/settings.spec.ts` existe
- **WHEN** o script de coverage executa
- **THEN** a rota `/admin/settings` DEVE ter `tests` contendo `[]`

---

### REQ-COVER-004: Mapeamento de Cenários BDD

O sistema DEVE mapear cada rota para seus arquivos `.feature` correspondentes, seguindo a regra de proximidade.

#### Cenário: Cenário BDD existente para rota
- **GIVEN** a rota `/admin/login`
- **AND** o arquivo `app/admin/login/login.feature` existe
- **WHEN** o script de coverage executa
- **THEN** a rota `/admin/login` DEVE ter `bdds` contendo `["app/admin/login/login.feature"]`

#### Cenário: Nenhum cenário BDD para rota
- **GIVEN** a rota `/admin/settings`
- **AND** nenhum arquivo `app/admin/settings/settings.feature` existe
- **WHEN** o script de coverage executa
- **THEN** a rota `/admin/settings` DEVE ter `bdds` contendo `[]`

---

### REQ-COVER-005: Status de Cobertura por Rota

O sistema DEVE atribuir um status de cor a cada rota baseado na cobertura de testes:

| Condição | Status | Cor |
|----------|--------|-----|
| ≥1 teste E2E E ≥1 cenário BDD | `green` | Verde |
| ≥1 teste E2E MAS sem BDD | `yellow` | Amarelo |
| Sem teste E2E | `red` | Vermelho |

#### Cenário: Rota com cobertura completa
- **GIVEN** a rota `/admin/login` tem 1+ teste E2E
- **AND** a rota `/admin/login` tem 1+ cenário BDD
- **WHEN** o script de coverage executa
- **THEN** o status da rota DEVE ser `green`

#### Cenário: Rota com teste mas sem BDD
- **GIVEN** a rota `/menu/[slug]` tem 1+ teste E2E
- **AND** a rota `/menu/[slug]` não tem cenários BDD
- **WHEN** o script de coverage executa
- **THEN** o status da rota DEVE ser `yellow`

#### Cenário: Rota sem teste E2E
- **GIVEN** a rota `/admin/settings` não tem teste E2E
- **WHEN** o script de coverage executa
- **THEN** o status da rota DEVE ser `red`

---

### REQ-COVER-006: Formato do Relatório JSON

O relatório JSON DEVE conter a estrutura:

```json
{
  "generated": "<ISO-8601 timestamp>",
  "routes": [
    {
      "path": "<route path>",
      "type": "page|api",
      "tests": ["<test file paths>"],
      "bdds": ["<feature file paths>"],
      "status": "green|yellow|red",
      "scenarios": <number>
    }
  ],
  "summary": {
    "total": <number>,
    "green": <number>,
    "yellow": <number>,
    "red": <number>
  }
}
```

#### Cenário: Relatório JSON com formato válido
- **GIVEN** o script de coverage executou com sucesso
- **WHEN** o arquivo `tests/e2e/coverage-report.json` é lido
- **THEN** o JSON DEVE ser válido
- **AND** DEVE conter a chave `generated`
- **AND** DEVE conter o array `routes`
- **AND** DEVE conter o objeto `summary`

---

### REQ-COVER-007: Relatório HTML Visual

O sistema DEVE gerar um relatório HTML que exibe visualmente o status de cobertura de cada rota.

#### Cenário: Relatório HTML exibe tabela de rotas
- **GIVEN** o script de coverage executou com sucesso
- **WHEN** o arquivo `tests/e2e/coverage-report.html` é aberto em um navegador
- **THEN** o relatório DEVE exibir uma tabela com todas as rotas
- **AND** cada linha DEVE mostrar o path da rota
- **AND** cada linha DEVE mostrar o status com cor (verde/amarelo/vermelho)
- **AND** cada linha DEVE conter link para arquivos de teste (se existirem)
- **AND** cada linha DEVE conter link para arquivos BDD (se existirem)

---

### REQ-COVER-008: Contagem de Cenários BDD

O sistema DEVE contar o número de cenários (Cenário/Given-When-Then) em cada arquivo `.feature` mapeado.

#### Cenário: Contagem correta de cenários
- **GIVEN** o arquivo `app/admin/login/login.feature` contém 5 cenários
- **WHEN** o script de coverage executa
- **THEN** a rota `/admin/login` DEVE ter `scenarios` igual a `5`

---

### REQ-COVER-009: Comando npm run test:coverage:e2e

O script DEVE ser executável via `npm run test:coverage:e2e` e ser adicionado ao `package.json`.

#### Cenário: Comando disponível no package.json
- **GIVEN** o projeto MenuLink
- **WHEN** `npm run test:coverage:e2e --help` é executado
- **THEN** o sistema DEVE exibir ajuda do script de coverage
- **AND** o script DEVE estar definido em `package.json` > `scripts`

---

### REQ-COVER-010: Resumo Estatístico

O relatório DEVE incluir um resumo com estatísticas de cobertura.

#### Cenário: Resumo mostra estatísticas
- **GIVEN** 10 rotas identificadas
- **AND** 7 rotas com status green
- **AND** 2 rotas com status yellow
- **AND** 1 rota com status red
- **WHEN** o script de coverage executa
- **THEN** o `summary.total` DEVE ser `10`
- **AND** o `summary.green` DEVE ser `7`
- **AND** o `summary.yellow` DEVE ser `2`
- **AND** o `summary.red` DEVE ser `1`

---

## Critérios de Aceitação

### CA-01: Script executa e gera relatório

O comando `npm run test:coverage:e2e` DEVE executar sem erros e gerar os arquivos `coverage-report.json` e `coverage-report.html`.

**Evidência**: Execução bem-sucedida do script via `npm run test:coverage:e2e`

---

### CA-02: Relatório mostra 100% das rotas

O relatório JSON DEVE conter todas as rotas dos domínios admin, menu e api conforme definido na arquitetura.

**Evidência**: `coverage-report.json` com `routes` array contendo todas as rotas especificadas

---

### CA-03: Cada rota tem status, link BDD e link teste

Cada entrada no relatório DEVE conter:
- `status`: string com valor `green`, `yellow` ou `red`
- `tests`: array com paths dos arquivos de teste
- `bdds`: array com paths dos arquivos feature

**Evidência**: Inspeção do `coverage-report.json` - todas as entradas têm os três campos

---

### CA-04: Build passa

A implementação NÃO DEVE quebrar o build de produção (`npm run build`).

**Evidência**: `npm run build` executa com exit code 0

---

### CA-05: Lint passa

A implementação NÃO DEVE introduzir novos erros de lint (`npm run lint`).

**Evidência**: `npm run lint` executa sem errors

---

### CA-06: Testes E2E existentes passam

Todos os testes E2E existentes DEVEM continuar passando após a implementação.

**Evidência**: `npm run test:e2e` executa com todos os testes passando

---

## Compliance Matrix

| Requisito | Cenário | Critério de Aceitação |
|-----------|---------|----------------------|
| REQ-COVER-001 | Execução bem-sucedida do script | CA-01 |
| REQ-COVER-002 | Identificar rotas de página | CA-02 |
| REQ-COVER-003 | Mapeamento de testes E2E | CA-03 |
| REQ-COVER-004 | Mapeamento de cenários BDD | CA-03 |
| REQ-COVER-005 | Status de cobertura por rota | CA-03 |
| REQ-COVER-006 | Formato do relatório JSON | CA-01, CA-02 |
| REQ-COVER-007 | Relatório HTML visual | CA-01 |
| REQ-COVER-008 | Contagem de cenários BDD | CA-03 |
| REQ-COVER-009 | Comando npm disponível | CA-01 |
| REQ-COVER-010 | Resumo estatístico | CA-02 |

---

## Status

Especificação
