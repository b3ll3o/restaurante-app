# Spec: Instalar Plugins de IA para OpenCode

## Fonte da Verdade
Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-001: Instalação do opencode-plugin-openspec
O sistema DEVE permitir a instalação do plugin `opencode-plugin-openspec` para estender as capacidades de integração OpenSpec no ambiente OpenCode.

#### Cenário: Instalação bem-sucedida do opencode-plugin-openspec
- **GIVEN** que o diretório do projeto existe
- **WHEN** o desenvolvedor executa a instalação do opencode-plugin-openspec
- **THEN** o plugin DEVE ser adicionado ao opencode.json e estar disponível no OpenCode

### REQ-002: Instalação do opencode-autopm
O sistema DEVE permitir a instalação do plugin `opencode-autopm` para automatizar o gerenciamento de packages no ambiente OpenCode.

#### Cenário: Instalação bem-sucedida do opencode-autopm
- **GIVEN** que o diretório do projeto existe
- **WHEN** o desenvolvedor executa a instalação do opencode-autopm
- **THEN** o plugin DEVE ser adicionado ao opencode.json e estar disponível no OpenCode

### REQ-003: Instalação do oh-my-opencode-slim
**STATUS**: N/A - oh-my-opencode-lite já está instalado no opencode.json e atende aos mesmos propósitos.

O sistema DEVE permitir a instalação do plugin `oh-my-opencode-slim` para fornecer funcionalidades auxiliares no ambiente OpenCode.

#### Cenário: Instalação bem-sucedida do oh-my-opencode-slim
- **GIVEN** que o diretório do projeto existe
- **WHEN** o desenvolvedor executa a instalação do oh-my-opencode-slim
- **THEN** o plugin DEVE ser adicionado ao opencode.json e estar disponível no OpenCode

### REQ-004: Configuração no opencode.json
O sistema DEVE registrar os plugins instalados no arquivo `opencode.json` para que o OpenCode os carregue corretamente.

## Critérios de Aceitação

### CA-001: Plugin opencode-plugin-openspec disponível
O plugin opencode-plugin-openspec deve estar instalado e configurado no opencode.json.

### CA-002: Plugin opencode-autopm disponível
O plugin opencode-autopm deve estar instalado e configurado no opencode.json.

### CA-003: Plugin oh-my-opencode-slim disponível
**STATUS**: N/A - oh-my-opencode-lite já está instalado.

### CA-004: opencode.json atualizado
O arquivo opencode.json deve conter a seção de plugins configurada com os três plugins.

## Status: Especificação