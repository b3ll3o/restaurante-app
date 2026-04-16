# Spec: Evolução do Fluxo de Desenvolvimento com Qualidade Integrada

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e define os requisitos para a evolução do fluxo SDD.

---

## ADDED Requirements

### REQ-QWF-001: Etapa PRB.md (Product Requirement Brief)

O sistema DEVE fornecer um template de PRB.md como documento inicial de concepção para toda mudança significativa.

#### Cenário: Criação de PRB para nova funcionalidade
- **GIVEN** uma equipe identificando uma nova necessidade de negócio
- **WHEN** inicia-se o processo de mudança significativa
- **THEN** o sistema DEVE permitir a criação de um PRB.md contendo: título, descrição do problema/oportunidade, público-alvo impactado, resultado esperado de alto nível, e critérios de sucesso preliminares

#### Cenário: PRB como porta de entrada
- **GIVEN** um PRB.md existente no repositório
- **WHEN** a equipe inicia o trabalho
- **THEN** o sistema DEVE exigir que o PRB.md seja referenciado pelo proposal.md subsequente

---

### REQ-QWF-002: Análise com PRD.md

O sistema DEVE incluir uma etapa formal de análise que confronta o PRB.md com o PRD.md existente e a realidade atual da aplicação.

#### Cenário: Análise de viabilidade
- **GIVEN** um PRB.md aprovado
- **WHEN** a equipe inicia a fase de análise
- **THEN** o sistema DEVE produzir uma síntese documentada respondendo: viabilidade com arquitetura atual, módulos/serviços afetados, dependências ou débitos técnicos bloqueantes

#### Cenário: Análise de impacto
- **GIVEN** um PRB.md e o PRD.md do projeto
- **WHEN** a análise é realizada
- **THEN** o sistema DEVE identificar explicitamente todos os módulos que serão afetados pela mudança

---

### REQ-QWF-003: Design.md com TDD Integrado

O sistema DEVE exigir que o design.md inclua uma seção de "Estratégia de Qualidade e Design de Código" com TDD obrigatório.

#### Cenário: Definição de cobertura mínima
- **GIVEN** um novo design.md sendo criado
- **WHEN** a seção de TDD é preenchida
- **THEN** o sistema DEVE definir a cobertura mínima obrigatória de testes (Mínimo 80% de cobertura de linhas, 100% de cobertura de branches críticos)

#### Cenário: Estratégia de testes unitários
- **GIVEN** um design.md com requisitos de TDD
- **WHEN** a implementação é planejada
- **THEN** o sistema DEVE especificar: ferramentas de teste (Jest/Vitest), estratégia de Mock/Stub para isolar dependências, e tipos de testes (unitários, integração)

---

### REQ-QWF-004: Design.md com BDD Integrado

O sistema DEVE exigir que o design.md inclua cenários BDD em linguagem Gherkin para testes E2E automatizados.

#### Cenário: Cenários BDD para fluxos principais
- **GIVEN** um design.md sendo elaborado
- **WHEN** a seção de BDD é preenchida
- **THEN** o sistema DEVE incluir cenários Gherkin cobrindo Happy Path e exceções críticas

#### Cenário: Ferramenta de automação E2E
- **GIVEN** cenários BDD definidos no design
- **WHEN** a implementação é validada
- **THEN** o sistema DEVE utilizar ferramenta de automação (Playwright/Cucumber) para executar testes E2E

---

### REQ-QWF-005: Design.md com ATDD Integrado

O sistema DEVE exigir que o design.md defina critérios de aceitação detalhados alinhados entre negócio, desenvolvimento e QA.

#### Cenário: Critérios de aceitação por tarefa
- **GIVEN** um design.md com tarefas definidas
- **WHEN** a decomposição é realizada
- **THEN** o sistema DEVE definir critérios de aceitação verificáveis para cada tarefa

#### Cenário: Checklist de validação QA
- **GIVEN** uma feature implementada
- **WHEN** a QA valida
- **THEN** o sistema DEVE incluir checklist de validação além dos testes automatizados (testes exploratórios, segurança, performance)

---

### REQ-QWF-006: Design.md com DDD Integrado

O sistema DEVE exigir que o design.md reflita o domínio do problema utilizando modelagem DDD com Linguagem Ubíqua.

#### Cenário: Diagrama de Contexto Delimitado
- **GIVEN** um design.md para mudança significativa
- **WHEN** a modelagem DDD é realizada
- **THEN** o sistema DEVE incluir Diagrama de Contexto Delimitado (Bounded Context)

#### Cenário: Definição de Agregados e Entidades
- **GIVEN** um design.md com modelagem DDD
- **WHEN** o domínio é analisado
- **THEN** o sistema DEVE definir: Agregados, Entidades, Objetos de Valor principais, e Mapa de Contexto

---

### REQ-QWF-007: Tasks.md com Decomposição DDD

O sistema DEVE gerar tasks.md a partir do design orientado a DDD, com decomposição por camadas.

#### Cenário: Tarefas de Infraestrutura de Testes
- **GIVEN** um design.md aprovado
- **WHEN** tasks.md é gerado
- **THEN** o sistema DEVE incluir tarefas como: "Configurar suíte de testes unitários com cobertura mínima de X%", "Criar steps definitions para cenário BDD"

#### Cenário: Tarefas de Domínio
- **GIVEN** um design.md com modelagem DDD
- **WHEN** tasks.md é gerado
- **THEN** o sistema DEVE incluir tarefas como: "Implementar Agregado `Pedido` com regras de negócio `validarEstoque()`"

#### Cenário: Tarefas de Aplicação
- **GIVEN** um design.md com casos de uso
- **WHEN** tasks.md é gerado
- **THEN** o sistema DEVE incluir tarefas como: "Implementar Caso de Uso `RealizarCheckout` (orquestração de domínio)"

#### Cenário: Tarefas de Infraestrutura
- **GIVEN** um design.md com persistência definida
- **WHEN** tasks.md é gerado
- **THEN** o sistema DEVE incluir tarefas como: "Implementar Repositório `PedidoRepository` para Postgres"

#### Cenário: Tarefas de Interface
- **GIVEN** um design.md com endpoints definidos
- **WHEN** tasks.md é gerado
- **THEN** o sistema DEVE incluir tarefas como: "Expor endpoint REST `/checkout` chamando Caso de Uso"

---

### REQ-QWF-008: Critério de Conclusão Baseado em Testes e Documentação

O sistema DEVE definir que uma tarefa só é considerada concluída quando código, testes E documentação passam.

#### Cenário: Tarefa unitária concluída
- **GIVEN** uma tarefa de implementação
- **WHEN** o código é escrito
- **THEN** a tarefa SÓ SERÁ considerada `[x]` quando os testes unitários/integração obrigatórios passarem

#### Cenário: Tarefa E2E concluída
- **GIVEN** uma tarefa de implementação
- **WHEN** o código é escrito
- **THEN** a tarefa SÓ SERÁ considerada `[x]` quando os testes E2E referentes àquela funcionalidade passarem localmente

#### Cenário: Documentação verificada na conclusão
- **GIVEN** uma tarefa de implementação
- **WHEN** código e testes passam
- **THEN** a tarefa SÓ SERÁ considerada `[x]` quando AGENTS.md estiver atualizado com proximidade e cenários BDD tiverem tag @integration-test

---

### REQ-QWF-013: Etapa de Verification Inclui Documentação

O sistema DEVE executar verificação completa de código E documentação na etapa de verification.

#### Cenário: Verificação de código
- **GIVEN** implementação completa
- **WHEN** etapa de verification inicia
- **THEN** o sistema DEVE verificar: build passa, lint passa, testes passam, cobertura ≥80%

#### Cenário: Verificação de documentação
- **GIVEN** implementação completa
- **WHEN** etapa de verification inicia
- **THEN** o sistema DEVE verificar: AGENTS.md no nível correto, BDD com proximidade, tags @integration-test presentes

#### Cenário: Correção de documentação na verificação
- **GIVEN** verificação de documentação
- **WHEN** issues são encontrados
- **THEN** o sistema DEVE corrigir issues de documentação antes de gerar compliance report

---

### REQ-QWF-009: Atualização Obrigatória de Documentação

O sistema DEVE exigir que todos os AGENTS.md dos módulos afetados sejam atualizados como parte do critério de conclusão.

#### Cenário: Módulos afetados documentados
- **GIVEN** uma mudança que afeta múltiplos módulos
- **WHEN** a implementação é concluída
- **THEN** o sistema DEVE ter atualizado todos os AGENTS.md dos módulos afetados

#### Cenário: Checklist de documentação
- **GIVEN** uma mudança significativa
- **WHEN** a verificação é realizada
- **THEN** o sistema DEVE verificar: AGENTS.md do módulo está atualizado, nova API pública está documentada, exemplos de uso estão corretos, dependências estão listadas

---

### REQ-QWF-010: Documentação Abrangente com AGENTS.md

O sistema DEVE exigir que TODO elemento da arquitetura (módulos, sub-módulos, rotas, classes de negócio, componentes, hooks, utilitários, contextos, tipos) seja documentado em um arquivo AGENTS.md localizado no nível mais próximo possível do elemento documentado.

#### Cenário: Módulo documentado
- **GIVEN** um novo módulo sendo criado
- **WHEN** o módulo é implementado
- **THEN** o sistema DEVE criar um AGENTS.md dentro desse módulo documentando: responsabilidade, interfaces públicas, dependências, regras de implementação

#### Cenário: Sub-módulo documentado
- **GIVEN** um sub-módulo dentro de um módulo
- **WHEN** o sub-módulo é implementado
- **THEN** o sistema DEVE criar um AGENTS.md dentro do sub-módulo documentando: responsabilidade específica, arquitetura, interface pública, exemplos de uso

#### Cenário: Rota de página documentada
- **GIVEN** uma nova rota de página (page.tsx) sendo criada
- **WHEN** a rota é implementada
- **THEN** o sistema DEVE criar um AGENTS.md na mesma pasta documentando: propósito da página, parâmetros de URL, estados de carregamento, estados de erro, fluxos de usuário, componentes utilizados, permissões de acesso

#### Cenário: Rota de API documentada
- **GIVEN** uma nova rota de API (route.ts) sendo criada
- **WHEN** a rota é implementada
- **THEN** o sistema DEVE criar um AGENTS.md na mesma pasta documentando: endpoint, método HTTP, parâmetros de request, formato de response, códigos de erro, autenticação necessária, rate limiting

#### Cenário: Classe de negócio documentada
- **GIVEN** uma classe ou função de negócio sendo criada
- **WHEN** a lógica de domínio é implementada
- **THEN** o sistema DEVE criar um AGENTS.md no mesmo diretório documentando: propósito, regras de negócio, métodos públicos, side effects, exceções

#### Cenário: Componente React documentado
- **GIVEN** um componente React sendo criado
- **WHEN** o componente é implementado
- **THEN** o sistema DEVE criar um AGENTS.md no mesmo diretório documentando: props, estados, callbacks, ciclos de vida, exemplos de uso

#### Cenário: Hook customizado documentado
- **GIVEN** um hook customizado sendo criado
- **WHEN** o hook é implementado
- **THEN** o sistema DEVE criar um AGENTS.md no mesmo diretório documentando: parâmetros, retorno, side effects, casos de uso

#### Cenário: Testes documentados
- **GIVEN** uma estrutura de testes sendo criada
- **WHEN** os testes são implementados
- **THEN** o sistema DEVE criar AGENTS.md documentando: propósito dos testes, padrões usados, como executar, cobertura esperada

#### Cenário: Schema de banco documentado
- **GIVEN** um schema de banco sendo criado
- **WHEN** as tabelas são definidas
- **THEN** o sistema DEVE criar AGENTS.md documentando: entidades, relacionamentos, RLS, migrations

#### Cenário: Cenários BDD com proximidade
- **GIVEN** um cenário BDD para uma funcionalidade
- **WHEN** o cenário é criado
- **THEN** o sistema DEVE criar o arquivo `.feature` no nível mais próximo do módulo/sub-módulo que ele documenta (ex: `app/admin/orders/orders.feature` para cenários de pedidos)

#### Cenário: Link BDD com testes de integração
- **GIVEN** um cenário BDD criado
- **WHEN** os testes de integração são implementados
- **THEN** o sistema DEVE linkar explicitamente cada cenário BDD ao teste de integração que o valida (via tags, comentários ou documentação)

---

### REQ-QWF-011: Princípio da Proximidade de Documentação

O sistema DEVE posicionar cada arquivo AGENTS.md no nível mais próximo possível do elemento que ele documenta, seguindo o princípio: "a documentação vive junto ao código que ela descreve".

#### Cenário: Estrutura de documentação por proximidade
- **GIVEN** a arquitetura do projeto
- **WHEN** a documentação é organizada
- **THEN** o sistema DEVE seguir: `app/admin/login/page.tsx` → `app/admin/login/AGENTS.md` (mesmo nível, mesma pasta)

#### Cenário: AGENTS.md de módulo vs sub-módulo
- **GIVEN** um módulo com múltiplos sub-módulos
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar AGENTS.md no nível de cada sub-módulo que tenha responsabilidade distinta, e um AGENTS.md no nível do módulo pai para visão geral

#### Cenário: Documentação de utilitários
- **GIVEN** um arquivo de utilitários (ex: `lib/utils.ts`)
- **WHEN** utilitários são implementados
- **THEN** o sistema DEVE criar um AGENTS.md em `lib/AGENTS.md` documentando todos os utilitários collectively, OU um AGENTS.md ao lado de cada utilitário se ele for complexo

#### Cenário: Checklist de proximidade
- **GIVEN** uma nova implementação
- **WHEN** a verificação de PR é realizada
- **THEN** o sistema DEVE verificar: AGENTS.md existe no nível mais próximo da implementação, não há AGENTS.md em nível hierárquico errado, documentação está colocalizada com código

---

## Critérios de Aceitação

### CA-QWF-001: Template PRB.md
O template de PRB.md DEVE estar disponível em `.openspec/` e incluir campos para: título, descrição, público-alvo, resultado esperado, critérios de sucesso.

### CA-QWF-002: Template design.md atualizado
O template de design.md DEVE incluir seções obrigatórias para: TDD (cobertura, ferramentas, mock), BDD (cenários Gherkin), ATDD (critérios de aceitação), DDD (bounded context, agregados).

### CA-QWF-003: Template tasks.md baseado em DDD
O template de tasks.md DEVE seguir decomposição por camadas: Infraestrutura de Testes, Domínio, Aplicação, Infraestrutura, Interface.

### CA-QWF-004: Cobertura mínima documentada
A cobertura mínima de 80% para unitários e 100% para fluxos críticos E2E DEVE estar documentada no design.md.

### CA-QWF-005: Documentação atualizada
Todos os AGENTS.md dos módulos afetados DEVEM ser atualizados conforme checklist de documentação.

### CA-QWF-006: Documentação abrangente
TODO elemento da arquitetura (módulo, sub-módulo, rota, classe de negócio, componente, hook, utilitário, contexto, tipo) DEVE ter um AGENTS.md no nível mais próximo possível do elemento documentado.

### CA-QWF-007: Proximidade de documentação
Os arquivos AGENTS.md DEVEM estar colocalizados com o código que documentam. Um AGENTS.md de `app/admin/login/page.tsx` DEVE estar em `app/admin/login/AGENTS.md`, não em `app/admin/AGENTS.md` ou `app/AGENTS.md`.

### CA-QWF-008: Arquivos BDD com proximidade
Os arquivos `.feature` DEVEM estar no nível mais próximo do módulo que documentam. Ex: `app/admin/orders/orders.feature` para cenários de pedidos.

### CA-QWF-009: Link BDD ↔ Testes de Integração
TODO cenário BDD DEVE ter tag `@integration-test` apontando para o teste de integração que o valida.

---

## Status Especificação

**Versão:** 1.0
**Data:** 2026-04-16
**Autor:** AI Agent
**Status:** Aprovada para implementação