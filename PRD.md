1. Para criar um PRD.md (Product Requirements Document) robusto e um prompt de automação eficaz, utilizaremos a especificação como fonte da verdade (SDD)
, a linguagem ubíqua (DDD)
, e o foco no comportamento e critérios de aceitação (BDD/ATDD)
, integrando a disciplina técnica do TDD
.
Abaixo está o modelo de PRD e o prompt para o seu projeto.
1. Modelo de PRD Integrado (prd.md)
Este documento serve como o artefato central do fluxo Spec-as-Source

2. Prompt para Automação de Arquivos (OpenCode/AI)
Copie e cole o prompt abaixo para guiar a IA a transformar o seu .md inicial nos arquivos de implementação:
Instrução de Engenharia de Software (Fluxo xDD + SDD):
Você é um arquiteto de software especialista em SDD (Spec-Driven Development)
. Sua tarefa é ler o arquivo prd.md fornecido e, seguindo estritamente os paradigmas abaixo, gerar os arquivos necessários para a implementação do projeto.
Siga este padrão de escrita para os novos arquivos:
specification.md (SDD - Specify): Extraia as regras de negócio e transforme-as em um contrato executável sem ambiguidades
.
technical_plan.md (SDD - Plan): Defina a arquitetura, modelos de dados e restrições da API (ex: Webhooks, Cloud API, BSUID)
.
acceptance_tests.feature (BDD/ATDD): Escreva os cenários de uso em sintaxe Gherkin (Dado/Quando/Então) focando no comportamento do ponto de vista do usuário
.
unit_tests_checklist.md (TDD): Crie um checklist de testes unitários para a lógica mínima necessária (Ciclo Red-Green-Refactor), detalhando mocks e stubs para a API do WhatsApp
.
Regras Obrigatórias:
Trate a especificação como a "Fonte da Verdade" (SDD)
. Se houver ambiguidade no PRD, peça clarificação antes de gerar o código
.
Utilize a Linguagem Ubíqua definida no PRD em todos os arquivos (DDD)
.
Garanta que a entrega final (o código) seja apenas um detalhe da implementação da especificação
.
Entrada: [Insira ou anexe seu arquivo .md aqui]
Por que usar este fluxo?
SDD: Evita o "vibe coding" (prompts vagos) ao fornecer contratos executáveis para a IA
.
BDD/ATDD: Garante que o desenvolvedor e a IA foquem no que o cliente realmente precisa
.
DDD: Reduz erros de comunicação ao padronizar termos técnicos e de negócio
.
TDD: Protege o código contra regressões durante a evolução do chatbot
.