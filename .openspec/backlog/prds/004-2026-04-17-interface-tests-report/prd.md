# PRD: 004 - Testes de Interface com Geração de Relatório por Rota

**ID:** 004-2026-04-17-interface-tests-report
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Garantir que 100% das rotas tenham testes E2E automatizados
- **Objetivo 2:** Gerar relatórios de cobertura de testes por rota
- **Objetivo 3:** Mapear cenários BDD para cada rota e verificar cobertura
- **Objetivo 4:** Ter visibilidade clara de qual rota tem/não tem testes

---

## 1. Problema

### 1.1 Descrição do Problema

O projeto MenuLink tem várias rotas (admin, menu, api) mas não há visibilidade clara de:
- Quais rotas têm testes E2E
- Quais rotas têm cenários BDD documentados
- Qual a cobertura real dos testes de interface

**Sintomas:**
- Algumas rotas podem não ter testes e isso só é descoberto em produção
- Não há relatório de cobertura de testes E2E
- Cenários BDD existem mas não estão mapeados para as rotas

### 1.2 Contexto

Rotas atuais do MenuLink:

| Rota | Tipo | Descrição | Status Atual |
|------|------|-----------|--------------|
| `/` | Page | Landing page | Parcial |
| `/admin/login` | Page | Login admin | Parcial |
| `/admin/signup` | Page | Cadastro | Parcial |
| `/admin/dashboard` | Page | Dashboard | Parcial |
| `/admin/categories` | Page | Categorias | Parcial |
| `/admin/products` | Page | Produtos | Parcial |
| `/admin/orders` | Page | Pedidos | Parcial |
| `/admin/settings` | Page | Configurações | Parcial |
| `/menu/[slug]` | Page | Cardápio público | Parcial |
| `/api/orders` | API | Criar pedido | Parcial |
| `/admin/auth/callback` | API | Callback auth | N/A |

### 1.3 Evidências

- [Evidência 1: Apenas checkout.spec.ts e offline.spec.ts existem em tests/e2e/public/]
- [Evidência 2: Não há relatório de cobertura de testes E2E]
- [Evidência 3: Arquivos .feature existem mas não mapeados por rota]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Criar uma estrutura de testes E2E completa com:
1. Scripts para gerar relatórios de cobertura por rota
2. Mapeamento de cenários BDD → rota → teste
3. Dashboard visual simples (HTML) com status de cobertura

### 2.2 Benefícios Esperados

| Benefício | Métrica | Valor Atual | Valor Esperado |
|-----------|---------|-------------|----------------|
| Cobertura de rotas | % rotas com E2E | ~40% | 100% |
| Visibilidade | Relatório disponível | Não | Sim |
| Mapeamento BDD | BDD → rota mapeado | Não | Sim |
| Confiança | Taxa de falha em produção | Alta | Baixa |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Dev/QA:** Precisa saber rapidamente quais rotas precisam de testes
  - **Necessidades:** Relatório visual, comandos simples, feedback rápido
  - **Dores:** Não sabe o que está coberto, descobre em produção

- **Tech Lead:** Precisa de visibilidade da qualidade de testes
  - **Necessidades:** Métricas de cobertura, relatório executive
  - **Dores:** Não consegue demonstrar coverage de forma clara

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto | Comunicação |
|-------------|---------|-------------|
| Dev Team | Mais testes para escrever | Briefing de guidelines |
| QA | Mais cobertura para validar | Cronograma de testes |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Relatório de Cobertura** (`npm run test:coverage:e2e`)
   - Script que varre todas as rotas
   - Verifica quais têm testes E2E
   - Gera relatório em HTML/JSON

2. **Mapeamento BDD → Rota**
   - Arquivo central `.openspec/test-coverage/map.json`
   - Mapeia cada rota para seus cenários BDD e testes correspondentes

3. **Dashboard Visual**
   - `tests/e2e/coverage-report.html`
   - Mostra verde/vermelho/amarelo por rota
   - Link para cenários BDD correspondentes

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** Script `npm run test:coverage:e2e` executa e gera relatório
- [ ] **CA-02:** Relatório mostra 100% das rotas (admin, menu, api)
- [ ] **CA-03:** Cada rota no relatório tem: status (verde/amarelo/vermelho), link para BDD, link para teste
- [ ] **CA-04:** Build passa (npm run build)
- [ ] **CA-05:** Lint passa sem novos errors
- [ ] **CA-06:** Todos os testes E2E existentes passam

### 4.3 fora do Escopo

**NÃO está Included:**
- Criar testes para todas as rotas (isso seria outro PRD/change)
- Integração com CI/CD externo
- Relatório em PDF formatado

**Explicitamente fora:**
- Testes de performance/load
- Testes de segurança automatizados

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Usar only:glob do Playwright

**Descrição:** Playwright supports `--glob` pattern para filtrar testes. Usar para rodar apenas testes por rota.

**Prós:**
- Já faz parte do Playwright
- Sem nova dependência

**Contras:**
- Não gera relatório visual
- Não mapeia BDD

**Por que foi descartada:** Não atende necessidade de relatório visual e mapeamento BDD.

### 5.2 Alternativa B: Plugin @playwright/test coverage

**Descrição:** Usar plugin third-party para coverage报告。

**Prós:**
- Feature completa

**Contras:**
- Nova dependência
- Configuração complexa

**Por que foi descartada:** Complexidade desnecessária para o que precisamos.

### 5.3 Alternativa C: Script customizado + JSON report (ESCOLHIDA)

**Descrição:**
1. Script Node.js que varre `app/` e identifica rotas
2. Cruza com `tests/e2e/**/*.spec.ts` para identificar testes existentes
3. Cruza com `.feature` files para mapear BDD
4. Gera `coverage-report.json` e `coverage-report.html`

**Prós:**
- Sem nova dependência (usa FS built-in)
- Relatório customizável
- Mapeamento BDD completo

**Contras:**
- Manutenção do script é responsabilidade do time

**Por que foi escolhida:** Simplicidade, sem dependências, relatório customizável.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Opção A (Plugin) | Opção B (Script Custom) | Decisão | Justificativa |
|-----------|-------------------|------------------------|---------|---------------|
| Complexidade | Alta | Baixa | Custom | Menos dependências |
| Manutenção | Baixa (oficial) | Média | Plugin | Simplicidade > |
| Relatório | Pronto | Customizável | Custom | Precisamos de BDD mapping |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Script que积雪 | Média | Baixo | Tests existentes como fallback |
| BDD files não encontrados | Baixa | Médio | Graceful handling, marca como "no BDD" |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - apenas scripts Node.js + Playwright
- [x] Módulos/Serviços afetados? **Testes** - nenhuma mudança em código de produção
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não** (usa built-in Node.js + Playwright existente)

### 7.3 Módulos Afetados

| Módulo | Impacto | Mudanças Necessárias |
|--------|---------|---------------------|
| `tests/e2e/` | Alto | Scripts de coverage, relatório HTML |
| `.openspec/` | Médio | `test-coverage/map.json` |
| `scripts/` (novo) | Alto | `coverage-report.js` |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | | 4h | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 8 | 0.3 | 2.4 |
| Urgency (1-10) | 7 | 0.25 | 1.75 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 2 | 0.25 | 0.5 |
| **TOTAL** | | | **4.85** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: O relatório deve ser gerado automaticamente após cada teste?
- **Tipo:** scope
- **Data:** 2026-04-17
- **Resposta:** Sim, como parte do `npm run test:e2e` ou separado via `npm run test:coverage:e2e`

#### Q2: O formato do relatório precisa ser HTML interativo ou JSON simples basta?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** HTML com cores (verde/amarelo/vermelho) é preferível por ser mais visual

#### Q3: O mapeamento BDD deve apontar para arquivos .feature específicos?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Sim, cada rota deve ter link para seu(s) arquivo(s) .feature correspondente(s)

### 9.2 Resumo do Interview

- Relatório pode ser separado (`npm run test:coverage:e2e`)
- Formato HTML com cores para fácil visualização
- BDD mapping via arquivo .feature por rota

---

## 10. Arquitetura do Script

### 10.1 Estrutura de Arquivos

```
scripts/
└── e2e-coverage/
    ├── generate-coverage.js    # Script principal
    ├── route-scanner.js        # Identifica rotas do app/
    ├── test-mapper.js         # Mapeia testes para rotas
    ├── bdd-linker.js          # Link BDD scenarios
    └── templates/
        └── report.html        # Template do relatório
```

### 10.2 Output

1. `tests/e2e/coverage-report.json` - Dados estruturados
2. `tests/e2e/coverage-report.html` - Relatório visual

### 10.3 Formato do JSON

```json
{
  "generated": "2026-04-17T10:00:00Z",
  "routes": [
    {
      "path": "/admin/login",
      "type": "page",
      "tests": ["tests/e2e/admin/login.spec.ts"],
      "bdds": ["app/admin/login/login.feature"],
      "status": "green",
      "scenarios": 5
    }
  ],
  "summary": {
    "total": 10,
    "green": 7,
    "yellow": 2,
    "red": 1
  }
}
```

### 10.4 Status Colors

- **green**: Rota com ≥1 teste E2E E ≥1 cenário BDD
- **yellow**: Rota com ≥1 teste E2E MAS sem BDD
- **red**: Rota sem teste E2E

---

## 11. Prompt Original

> crie um prd para configurar os testes de interface com geração de relatorio de todas as rotas da aplicação seguindo os cenarios bdd daquela rota

---

## 12. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | interface-tests-report |
| Commit | TBD |
| Sprint | 2026-04-Sprint-3 |

---

## 13. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado |

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent