# Tasks: Instalar Plugins de IA para OpenCode

## Pré-condições
- [x] Proposal aprovado
- [x] Design aprovado
- [x] Spec aprovada

## Tarefas

### Fase 1: Instalação dos Plugins
- [x] 1.1: opencode-plugin-openspec já está no opencode.json (configuração automática)
- [x] 1.2: Instalar opencode-autopm via npm (instalado via npm install -g opencode-autopm@3.7.0)
- [x] 1.3: oh-my-opencode-lite já está no opencode.json (confirmado instalado via npm install -g oh-my-opencode-lite@0.1.7)

### Fase 2: Configuração
- [x] 2.1: Plugins configurados no opencode.json (oh-my-opencode-lite, opencode-plugin-openspec, opencode-autopm)

### Fase 3: Verificação
- [x] 3.1: Testar comandos disponíveis dos plugins (opencode agent list OK, comandos disponíveis OK)

### Fase 4: Análise de Necessidade
- [x] 4.1: Analisar se cada plugin instalado atende necessidade real
- [x] 4.2: Documentar gap analysis (o que cada plugin resolve)
- [x] 4.3: Identificar plugins redundantes ou não utilizados

### Fase 5: Validação
- [x] 5.1: Testar comandos de cada plugin
- [x] 5.2: Verificar integração entre plugins
- [x] 5.3: Documentar resultados da validação

## Progresso
██████████ 100%

## Status: ✅ VALIDADO - Todos os plugins testados e integrados

## Notas
- oh-my-opencode-slim NÃO existe no npm; o nome correto é oh-my-opencode-lite
- opencode-plugin-openspec já estava referenciado no opencode.json
- Todos os 3 plugins instalados via npm install -g:
  - oh-my-opencode-lite@0.1.7
  - opencode-autopm@3.7.0
  - opencode-plugin-openspec@0.1.4
- Configuração do ~/.config/opencode/opencode.json corrigida: "plugins" → "plugin"
- opencode.json do projeto atualizado com todos os 3 plugins
- Análise inclui opencode-token-tracker (4 plugins ao total)
- Todos os 4 plugins são NECESSÁRIOS e NÃO REDUNDANTES
- plugins.json atualizado para incluir todos os 4 plugins