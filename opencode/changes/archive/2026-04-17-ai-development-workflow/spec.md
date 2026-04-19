# Spec: Fluxo de Desenvolvimento Guiado por IA com OpenCode

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e define o fluxo de desenvolvimento assistido por IA utilizando o ecossistema OpenCode com agentes especializados.

---

## 1. Visão Geral

Este documento estabelece os requisitos para o pipeline de desenvolvimento assistido por IA que utiliza agentes especializados (PM, Arquiteto, Desenvolvedor, Revisor) para automatizar o ciclo desde a elicitação de requisitos (PRD) até a implementação validada.

---

## 2. Requisitos

### REQ-001: Início do Fluxo a partir de PRD

O sistema **DEVE** permitir que um usuário inicie o fluxo de desenvolvimento a partir de um comando PRD, disparando a execução orquestrada dos agentes especializados.

#### Cenário: Comando PRD válido inicia pipeline
- **GIVEN** o usuário está no contexto do projeto com OpenCode configurado
- **WHEN** o usuário executa o comando `/prd start` com um arquivo PRD.md válido
- **THEN** o sistema **DEVE** iniciar o pipeline de agentes na ordem PM → Arquiteto → Dev → Revisor
- **AND** o sistema **DEVE** criar o diretório `.openspec/changes/{change-name}/` com os artefatos gerados

#### Cenário: Comando PRD com arquivo inválido
- **GIVEN** o usuário está no contexto do projeto com OpenCode configurado
- **WHEN** o usuário executa o comando `/prd start` com um arquivo PRD.md mal formatado
- **THEN** o sistema **DEVE** retornar erro indicando os problemas de formatação
- **AND** o sistema **NÃO DEVE** iniciar o pipeline de agentes

#### Cenário: Comando PRD sem contexto de projeto
- **GIVEN** o usuário está fora de um projeto OpenCode
- **WHEN** o usuário executa o comando `/prd start`
- **THEN** o sistema **DEVE** retornar erro indicando que não há projeto configurado

---

### REQ-002: Geração de Histórias INVEST

O sistema **DEVE** gerar histórias de usuário validadas contra os critérios INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).

#### Cenário: Histórias geradas cumprem INVEST
- **GIVEN** o PRD.md foi processado pelo Agente PM
- **WHEN** o Agente PM termina a geração de backlog
- **THEN** cada história gerada **DEVE** ser Independent (não dependente de outras)
- **AND** cada história **DEVE** ser Negotiable (flexível em detalhes)
- **AND** cada história **DEVE** ser Valuable (traz valor ao usuário)
- **AND** cada história **DEVE** ser Estimable (possível estimar esforço)
- **AND** cada história **DEVE** ser Small (gerenciável em tempo)
- **AND** cada história **DEVE** ser Testable (possível verificar conclusão)

#### Cenário: Histórias inválidas são rejeitadas
- **GIVEN** o Agente PM gerou histórias de usuário
- **WHEN** alguma história viola critério INVEST
- **THEN** o sistema **DEVE** rejeitar a história
- **AND** o sistema **DEVE** informar qual critério INVEST foi violado
- **AND** o Agente PM **DEVE** regenerar a história

---

### REQ-003: Formato XP de Histórias

O sistema **DEVE** seguir o formato XP "Como um [ator], eu quero [ação] para que [benefício]" para todas as histórias de usuário geradas.

#### Cenário: histórias seguem formato XP
- **GIVEN** o Agente PM está gerando backlog de histórias
- **WHEN** uma história é criada
- **THEN** a história **DEVE** começar com "Como um [ator]"
- **AND** **DEVE** conter "eu quero [ação]"
- **AND** **DEVE** conter "para que [benefício]"

#### Cenário: Formato XP inválido é corrigido
- **GIVEN** o Agente PM gerou uma história fora do formato XP
- **WHEN** o sistema valida a história
- **THEN** o sistema **DEVE** identificar o formato inválido
- **AND** o Agente PM **DEVE** reescrever a história no formato correto

---

### REQ-004: Geração de Especificações Técnicas

O sistema **DEVE** gerar especificações técnicas completas incluindo arquitetura, design de API e schema de banco de dados.

#### Cenário: Especificações técnicas completas
- **GIVEN** o Agente Arquiteto recebeu o backlog aprovado
- **WHEN** o Agente Arquiteto inicia a especificação
- **THEN** o sistema **DEVE** gerar `design.md` com decisões de arquitetura
- **AND** o sistema **DEVE** gerar `tasks.md` com decomposição DDD
- **AND** o sistema **DEVE** documentar APIs (endpoints, requests, responses)
- **AND** o sistema **DEVE** documentar schema de banco (tabelas, campos, relações)

#### Cenário: Specs técnicas validadas contra codebase
- **GIVEN** o Agente Arquiteto gerou especificações
- **WHEN** as especificações são validadas
- **THEN** as especificações **DEVEM** ser compatíveis com a stack atual (Next.js 16, React 19, TypeScript strict)
- **AND** **DEVEM** seguir padrões do projeto (shadcn/ui, Supabase, Drizzle)
- **AND** **DEVEM** ser consistentes com `.openspec/specs/` existentes

---

### REQ-005: Implementação TDD (Red-Green-Refactor)

O sistema **DEVE** implementar TDD seguindo o ciclo Red-Green-Refactor, onde testes são escritos antes do código de produção.

#### Cenário: Ciclo Red-Green-Refactor completo
- **GIVEN** o Agente Dev recebeu as tasks aprovadas
- **WHEN** o Agente Dev implementa uma tarefa
- **THEN** o Agente Dev **DEVE** primeiro escrever teste que falha (RED)
- **AND** **DEVE** implementar código mínimo para teste passar (GREEN)
- **AND** **DEVE** refatorar código mantendo testes passando (REFACTOR)

#### Cenário: Testes unitários obrigatórios
- **GIVEN** o Agente Dev está implementando lógica de domínio
- **WHEN** a implementação é concluída
- **THEN** a cobertura de testes unitários **DEVE** ser ≥80%
- **AND** **DEVE** existir teste para cada regra de negócio (REQ-XXX)

#### Cenário: Testes de integração
- **GIVEN** o Agente Dev implementou APIs ou integração entre módulos
- **WHEN** a implementação é concluída
- **THEN** **DEVE** existir teste de integração para cada endpoint
- **AND** **DEVE** existir teste de integração para cada interação entre módulos

---

### REQ-006: Validação contra Padrões Aprendidos

O sistema **DEVE** validar código gerado contra os padrões aprendidos do projeto através do OpenAgentsControl.

#### Cenário: Código validado contra padrões TypeScript
- **GIVEN** o Agente Dev gerou código TypeScript
- **WHEN** o código é validado
- **THEN** o código **DEVE** passar em `strict: true`
- **AND** **DEVE** seguir convenções do projeto (nomes, imports, exports)
- **AND** **DEVE** utilizar tipos definidos em `types/`

#### Cenário: Código validado contra padrões de UI
- **GIVEN** o Agente Dev gerou componentes React
- **WHEN** o código é validado
- **THEN** **DEVE** utilizar componentes de `components/ui/` quando disponíveis
- **AND** **DEVE** seguir padrões de estilização do Tailwind CSS 4
- **AND** **DEVE** ser consistente com estrutura em `app/`

#### Cenário: Padrões ensinados ao OpenAgentsControl
- **GIVEN** novos padrões são identificados durante o desenvolvimento
- **WHEN** o desenvolvedor ensina o padrão ao OpenAgentsControl
- **THEN** o sistema **DEVE** armazenar o padrão para validação futura
- **AND** **DEVE** aplicar o padrão em validações subsequentes

---

### REQ-007: Feedback Contínuo do Agente Revisor

O sistema **DEVE** fornecer feedback contínuo através do Agente Revisor, validando cada fase do pipeline e aprovar ou rejeitar entregas.

#### Cenário: Revisor valida output do Agente PM
- **GIVEN** o Agente PM gerou o backlog de histórias
- **WHEN** o backlog é submetido ao Agente Revisor
- **THEN** o Agente Revisor **DEVE** validar formato XP
- **AND** **DEVE** validar critérios INVEST
- **AND** **DEVE** aprobar ou rejeitar com justificativa

#### Cenário: Revisor valida output do Agente Arquiteto
- **GIVEN** o Agente Arquiteto gerou design.md e tasks.md
- **WHEN** as especificações são submetidas ao Agente Revisor
- **THEN** o Agente Revisor **DEVE** validar consistência com specs existentes
- **AND** **DEVE** validar viabilidade técnica
- **AND** **DEVE** aprovar ou rejeitar com justificativa

#### Cenário: Revisor valida output do Agente Dev
- **GIVEN** o Agente Dev completou implementação
- **WHEN** o código é submetido ao Agente Revisor
- **THEN** o Agente Revisor **DEVE** validar cobertura de testes ≥80%
- **AND** **DEVE** validar lint sem erros
- **AND** **DEVE** validar build bem-sucedido
- **AND** **DEVE** aprovar ou rejeitar com justificativa

#### Cenário: Rejeição causa reprocessamento
- **GIVEN** o Agente Revisor rejeitou uma entrega
- **WHEN** a rejeição ocorre
- **THEN** o agente responsável **DEVE** receber feedback detalhado
- **AND** **DEVE** reprocessar a entrega corrigindo os problemas identificados

---

## 3. Critérios de Aceitação

### CA-001: Inicialização de Pipeline

O comando `/prd start` **DEVE** iniciar o pipeline de agentes quando executado com PRD.md válido no contexto de projeto OpenCode.

**Verificável por**:
- Teste automatizado que executa `/prd start` com PRD válido e verifica criação de diretório `.openspec/changes/{change-name}/`

### CA-002: Histórias XP + INVEST

O backlog gerado **DEVE** conter apenas histórias no formato XP "Como um [ator]..." e que cumpram todos os critérios INVEST.

**Verificável por**:
- Teste automatizado que valida formato XP em 100% das histórias
- Teste automatizado que verifica cada critério INVEST

### CA-003: Especificações Técnicas Completas

As especificações geradas **DEVEM** incluir design.md e tasks.md com arquitetura, APIs e schema documentados.

**Verificável por**:
- Verificação de existência de seções em design.md (arquitetura, APIs, banco)
- Verificação de existência de tasks.md com fases DDD

### CA-004: Ciclo TDD Implementado

O Agente Dev **DEVE** executar ciclo Red-Green-Refactor para cada tarefa, com cobertura ≥80%.

**Verificável por**:
- Análise de commits/artefatos mostrando teste antes de implementação
- Relatório de cobertura `npm run test:coverage` ≥80%

### CA-005: Código Validado

Todo código gerado **DEVE** passar em lint, typecheck e build sem erros.

**Verificável por**:
- `npm run lint` retorna 0 erros
- `npm run typecheck` retorna 0 erros
- `npm run build` bem-sucedido

### CA-006: Revisor Aprova Entregas

O Agente Revisor **DEVE** aprovar todas as entregas antes de prosseguir no pipeline.

**Verificável por**:
- Log do pipeline mostrando "APROVADO" pelo Agente Revisor em cada fase
- Fallback para reprocessamento em caso de rejeição

---

## 4. Arquitetura do Pipeline

```
PRD.md
   │
   ▼
Agente PM ──► Backlog (Histórias XP + INVEST)
   │
   ▼
Agente Arquiteto ──► design.md + tasks.md
   │
   ▼
Agente Dev ──► TDD (Red-Green-Refactor) + Código
   │
   ▼
Agente Revisor ──► Validação + Aprovação
   │
   ▼
implementation + documentation
```

---

## 5. Dependências

| Requisito Dependente | Descrição |
|----------------------|-----------|
| REQ-001 | REQ-002, REQ-003 dependem da inicialização |
| REQ-002, REQ-003 | REQ-004 depende do backlog aprovado |
| REQ-004 | REQ-005 depende das tasks geradas |
| REQ-005 | REQ-007 valida a implementação |

---

## 6. Restrições

- O fluxo **NÃO DEVE** prosseguir para próxima fase sem aprovação da anterior
- O sistema **NÃO DEVE** permitir que código sem testes seja aprovado
- O sistema **NÃO DEVE** aceitar código que viole `strict: true` do TypeScript
- O sistema **NÃO DEVE** permitir-breaking changes sem aprovação explícita

---

## 7. Status Especificação

**Status**: Rascunho
**Revisão Necessária**: Oracle
**Próximo Passo**: design.md após aprovação desta spec

---

**Especificação criada em**: 2026-04-17
**Autor**: AI Agent
**Baseado em**: proposal.md "ai-development-workflow"