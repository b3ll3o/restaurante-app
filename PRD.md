# PRD: Estruturação de Rules, Workflows e Skills no OpenCode

**Status:** Em Refinamento
**Autor:** Time de Plataforma
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17
**Versão:** 1.0

## 0. Objetivos de Negócio

Padronizar a forma como o OpenCode interage com o código-fonte e automatiza tarefas repetitivas, reduzindo o tempo de onboarding de novos desenvolvedores e garantindo consistência nos processos de desenvolvimento, revisão e entrega. Esta iniciativa visa aumentar a produtividade do time em pelo menos 30% ao eliminar configurações manuais e retrabalho causado por inconsistências de estilo e fluxo.

## 1. Problema

Atualmente, cada desenvolvedor ou projeto mantém suas próprias regras de linting, comandos de shell e scripts de automação de forma ad-hoc. Isso causa:

- **Inconsistência:** Diferentes padrões de código, mensagens de commit e estruturas de arquivo convivem no mesmo repositório.
- **Retrabalho:** Agentes de IA (OpenCode) precisam ser instruídos repetidamente sobre as mesmas preferências.
- **Baixa reutilização:** Boas práticas encapsuladas em skills ou workflows não são compartilhadas entre projetos.
- **Onboarding lento:** Novos membros gastam horas configurando seu ambiente e entendendo os fluxos locais.

**Dados de baseline:** Em levantamento interno, 25% do tempo de desenvolvimento é gasto com tarefas de configuração e alinhamento de padrões. O tempo médio para implementar uma história simples é de 4 horas, sendo 1 hora apenas com atividades de "setup mental" e adequação ao estilo do projeto.

## 2. Oportunidade

Ao criar uma estrutura canônica de **Rules** (regras de comportamento), **Workflows** (processos automatizados) e **Skills** (capacidades sob demanda) dentro do OpenCode, podemos:

- Ter um "cérebro compartilhado" que orienta todos os agentes e desenvolvedores de forma uniforme.
- Acelerar o ciclo de desenvolvimento, permitindo que o OpenCode execute tarefas complexas com um simples comando.
- Facilitar a governança técnica, pois as regras passam a ser versionadas junto com o código.
- Possibilitar que o próprio modelo MiniMax M2.7 crie, refine e salve novas skills baseadas no uso real.

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Desenvolvedor Full‑Stack (Ana):** Quer se concentrar na lógica de negócio, não em configurações. Precisa que o OpenCode siga automaticamente os padrões do time e que possa invocar habilidades complexas (ex: "criar release") sem memorizar sintaxes.
- **Tech Lead / Arquiteto (Carlos):** Responsável por manter a qualidade e a consistência técnica. Precisa definir regras que sejam aplicadas de forma obrigatória e poder auditar os workflows utilizados.
- **Agente de IA do OpenCode (PM-Bot, Dev-Bot):** Consumirá este PRD e a estrutura resultante para orquestrar tarefas. Necessita de instruções claras, semanticamente estruturadas e localizáveis no sistema de arquivos.

### 3.2 Stakeholders Impactados

- **Equipe de Desenvolvimento:** Será a principal beneficiária da automação e padronização.
- **Equipe de QA:** Os workflows incluirão etapas de teste e validação, melhorando a previsibilidade das entregas.
- **OpenCode (sistema):** A implementação correta desta estrutura depende de hooks e convenções que o próprio OpenCode reconhece.

## 4. Resultado Esperado (Alto Nível)

Uma estrutura de diretórios padronizada (`.opencode/`) versionada no repositório, contendo:

- **Rules:** Comportamento padrão do assistente (estilo de código, linguagem preferida, mensagens de commit).
- **Skills:** Conjuntos de instruções para tarefas específicas (ex: gerar changelog, revisar segurança, criar diagramas).
- **Workflows:** Processos multi-etapas orquestrados (ex: pipeline de revisão de PR, release automatizado).

Espera-se que, ao abrir o projeto no OpenCode, o assistente automaticamente carregue essas definições e que os comandos (ex: `/release`, `/review`) estejam disponíveis e funcionais. A meta é reduzir o tempo de ciclo de desenvolvimento de uma história padrão de 4h para 2,5h.

### 4.1 Fora do Escopo

- Criação de um servidor centralizado de skills (isso será tratado futuramente via plugins ou repositórios compartilhados).
- Integração com ferramentas de CI/CD externas além do suporte nativo a comandos shell e APIs.
- Customização da interface gráfica do OpenCode.

## 5. Critérios de Sucesso

### 5.1 Critérios de Aceitação do Produto (Checklist)

- [ ] A estrutura de diretórios `.opencode/` está presente na raiz do projeto e versionada.
- [ ] O arquivo `AGENTS.md` ou as regras em `.opencode/rules/` são carregadas automaticamente pelo OpenCode ao iniciar.
- [ ] Ao menos **3 skills** documentadas e funcionais estão disponíveis (ex: `git-release`, `pr-review`, `generate-diagram`).
- [ ] Ao menos **1 workflow** multi-agente está definido e pode ser disparado via comando de barra.
- [ ] O modelo MiniMax M2.7 consegue, via prompt, criar uma nova skill e salvá-la na pasta correta.
- [ ] A documentação (`README.md` ou `CONTRIBUTING.md`) explica como utilizar e estender as skills.

### 5.2 Métricas de Sucesso (KPIs)

- **Tempo de implementação de história:** Redução de 4h para ≤ 2,5h (medido em 10 histórias após a adoção).
- **Adoção:** 100% dos desenvolvedores do time utilizando os comandos padronizados em até 2 semanas.
- **Consistência:** Zero revisões de código rejeitadas por violação de estilo que já estejam cobertas pelas Rules.
- **Criação de skills:** Pelo menos uma nova skill criada por um desenvolvedor (não só pelo time de plataforma) no primeiro mês.

## 6. Backlog Inicial (Épicos e Histórias de Usuário)

### Épico 1: Fundação da Estrutura de Configuração

- **História Exemplo 1:** "Como um **Tech Lead**, quero que exista uma pasta `.opencode/rules/` versionada, para que as regras de estilo de código sejam aplicadas consistentemente."
  - **Critérios de Aceitação (Exemplo Gherkin):**
    - **Dado** que o repositório foi clonado, **Quando** abro o projeto no OpenCode, **Então** o assistente segue as regras definidas em `.opencode/rules/coding-style.md`.
- **História Exemplo 2:** "Como um **Desenvolvedor**, quero poder executar `/skill-create "gerar changelog"` e ter a skill salva em `.opencode/skills/`, para que eu possa reutilizá-la depois."
  - **Critérios:** O comando gera um arquivo `SKILL.md` válido dentro do diretório nomeado corretamente.

### Épico 2: Implementação de Skills Essenciais

- **Skill: `git-release`**
  - **Descrição:** Gera automaticamente uma tag de versão baseada em commits convencionais, cria um changelog e faz o push.
  - **Formato:** `Como um dev, quero executar /git-release para que uma nova versão seja publicada com documentação automática.`
- **Skill: `pr-review`**
  - **Descrição:** Analisa um Pull Request em busca de problemas de segurança, complexidade ciclomática e aderência às regras.
  - **Formato:** `Como um revisor, quero executar /pr-review #123 para obter um relatório automatizado de qualidade.`

### Épico 3: Workflow Multi-Agente de Revisão

- **Workflow: Revisão Completa de Código**
  - **Descrição:** Orquestra três agentes: `@style-checker` (rules), `@security-bot` (skill), `@complexity-analyzer` (skill), gerando um relatório consolidado.
  - **Formato:** `Como um autor de PR, quero que ao marcar um PR como "ready for review", o workflow seja disparado automaticamente.`

## 7. Análise Inicial

### 7.1 Viabilidade Técnica

- O OpenCode suporta nativamente a leitura de `.opencode/` e `AGENTS.md`.
- O modelo MiniMax M2.7 possui capacidade de geração de arquivos estruturados e pode ser instruído a salvá-los no local correto.
- A criação de comandos de barra customizados pode ser feita via arquivos de configuração JSON na pasta `commands/`.

### 7.2 Impacto Estimado

- **Esforço de implementação:** 2-3 dias para estruturar as pastas, escrever as primeiras skills e documentar.
- **Curva de aprendizado:** 1 hora de workshop para o time.

### 7.3 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| Regras muito restritivas irritarem devs | Média | Médio | Incluir período de adaptação e canal para sugestões de ajuste nas próprias rules. |
| Conflito entre rules locais e globais | Baixa | Baixo | Documentar a precedência (projeto > usuário) e permitir sobrescrita explícita. |
| Skills geradas automaticamente serem de baixa qualidade | Média | Médio | Incluir etapa de validação humana (code review da própria skill) antes de mergear. |

### 7.4 Dependências Externas

- Nenhuma dependência externa obrigatória. O funcionamento básico depende apenas do OpenCode e do MiniMax M2.7.
- Para workflows que disparam ações no GitHub, será necessário configurar um token de acesso (já existente no ambiente de CI).

## 8. Urgência e Justificativa

- [x] **Alta**
- **Justificativa:** O time está crescendo e a falta de padronização já está causando atrasos visíveis nas entregas do Q2. A implementação desta estrutura é um pré-requisito para outros projetos de automação planejados para o próximo mês.

## 9. Instruções para Orquestração de Agentes (OpenCode)

- **Comando de Início:** `/prd implement "Estruturação de Rules, Workflows e Skills"`
- **Pipeline Esperado:**
    1. `@pm` lê este PRD e gera um backlog detalhado em `backlog.md`.
    2. `@architect` define a estrutura exata dos arquivos `.opencode/` e valida as dependências.
    3. `@dev` implementa as pastas, arquivos de exemplo e skills iniciais utilizando TDD (testando os comandos manualmente).
    4. `@critic` revisa se a estrutura está conforme as convenções do OpenCode e se as skills são acionáveis.
- **Contexto Obrigatório:** Os agentes devem ler `OPENCODE.md` (se existir) e `AGENTS.md` antes de iniciar qualquer modificação.
- **Práticas Obrigatórias:**
    - **Refinamento contínuo:** As histórias geradas devem ser validadas com a técnica **SPIDR** (Spike, Path, Iterate, Demo, Retro).
    - **Validação INVEST:** Cada história deve ser Independente, Negociável, Valiosa, Estimável, Pequena e Testável.
    - **TDD:** Para skills que geram código ou comandos, os agentes devem simular a execução e validar a saída esperada.

## 10. Definição de Pronto (DoR e DoD)

### Definition of Ready (DoR) para uma História

- [ ] A história está no formato "Como... quero... para que...".
- [ ] Os critérios de aceitação estão escritos em Gherkin (Dado-Quando-Então).
- [ ] A história está estimada (S, M, L) e priorizada no backlog.
- [ ] Não há dependências externas não resolvidas.
- [ ] A história foi compreendida e aceita pelo agente `@dev` designado.

### Definition of Done (DoD) para o Incremento

- [ ] A estrutura de diretórios foi criada e commitada.
- [ ] As skills implementadas foram testadas manualmente (ex: `/git-release --dry-run` retorna sucesso).
- [ ] O código da skill ou workflow foi revisado por um par humano ou pelo agente `@critic`.
- [ ] A documentação (`README.md` ou `docs/skills.md`) foi atualizada com exemplos de uso.
- [ ] O time foi notificado sobre a nova funcionalidade.

## 11. Referências

- **Template de PRD utilizado:** Baseado no modelo melhorado para desenvolvimento com agentes de IA.
- **Especificação OpenCode Skills:** [Link para documentação oficial](https://opencode.ai/docs/skills)
- **Backlog do Projeto:** [Link para o board no Jira/GitHub Projects]
- **Issue relacionada:** #456 - "Padronizar configurações do OpenCode"