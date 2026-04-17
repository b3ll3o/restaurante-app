# Spec: SDDD Templates - Templates OpenSpec com Qualidade Integrada

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e define os requisitos para os templates OpenSpec.

---

## ADDED Requirements

### REQ-ST-001: Template PRD.md

O sistema DEVE fornecer um template de PRD.md (Product Requirement Document) como documento inicial de concepção para toda mudança significativa.

#### Cenário: Estrutura do PRD.md
- **GIVEN** necessidade de criar PRD.md
- **WHEN** o template é utilizado
- **THEN** o documento DEVE conter: título, problema/oportunidade, público-alvo, resultado esperado, critérios de sucesso, análise inicial, urgência e referências

---

### REQ-ST-002: Template design.md com TDD

O sistema DEVE exigir que o design.md inclua uma seção de "Estratégia de Qualidade e Design de Código" com TDD obrigatório.

#### Cenário: Seção TDD no design.md
- **GIVEN** um novo design.md sendo criado
- **WHEN** a seção de TDD é preenchida
- **THEN** o sistema DEVE definir: cobertura mínima (80%), ferramentas (Vitest), estratégia de Mock/Stub

---

### REQ-ST-003: Template design.md com BDD

O sistema DEVE exigir que o design.md inclua cenários BDD em linguagem Gherkin.

#### Cenário: Seção BDD no design.md
- **GIVEN** um design.md sendo elaborado
- **WHEN** a seção de BDD é preenchida
- **THEN** o sistema DEVE incluir: cenários Gherkin, ferramenta (Playwright), cobertura E2E (100% fluxos críticos)

---

### REQ-ST-004: Template design.md com ATDD

O sistema DEVE exigir que o design.md defina critérios de aceitação detalhados.

#### Cenário: Seção ATDD no design.md
- **GIVEN** um design.md com tarefas definidas
- **WHEN** a decomposição é realizada
- **THEN** o sistema DEVE definir critérios de aceitação verificáveis para cada tarefa

---

### REQ-ST-005: Template design.md com DDD

O sistema DEVE exigir que o design.md reflita o domínio do problema utilizando modelagem DDD.

#### Cenário: Seção DDD no design.md
- **GIVEN** um design.md para mudança significativa
- **WHEN** a modelagem DDD é realizada
- **THEN** o sistema DEVE incluir: Bounded Context, Agregados, Entidades, Value Objects

---

### REQ-ST-006: Template tasks.md com Decomposição DDD

O sistema DEVE gerar tasks.md a partir do design orientado a DDD, com decomposição por camadas.

#### Cenário: Estrutura DDD no tasks.md
- **GIVEN** um design.md aprovado
- **WHEN** tasks.md é gerado
- **THEN** o sistema DEVE organizar tarefas em: Infraestrutura de Testes, Domínio, Aplicação, Infraestrutura, Interface, Documentação

---

## Critérios de Aceitação

### CA-ST-001: Template PRD.md
O template DEVE estar disponível em `.openspec/templates/prd-template.md` com campos para: título, problema/oportunidade, público-alvo, resultado esperado, critérios de sucesso.

### CA-ST-002: Template design.md atualizado
O template DEVE incluir seções obrigatórias para: TDD, BDD, ATDD, DDD.

### CA-ST-003: Template tasks.md baseado em DDD
O template DEVE seguir decomposição por camadas: Infraestrutura de Testes, Domínio, Aplicação, Infraestrutura, Interface, Documentação.

### CA-ST-004: AGENTS.md principal atualizado
O AGENTS.md principal DEVE refletir o novo fluxo SDD: PRB → Análise → proposal → spec → design → tasks → implementation → verification → archive.

---

## Status Especificação

**Versão:** 1.0
**Data:** 2026-04-16
**Autor:** AI Agent
**Status:** Rascunho