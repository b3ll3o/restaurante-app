# Spec: Token Tracker Plugin

## Fonte da Verdade
Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-001: Instalação do Plugin
O sistema DEVE permitir a instalação do opencode-token-tracker via configuração no opencode.json.

#### Cenário: Plugin adicionado ao array de plugins
- **GIVEN** o arquivo opencode.json existe
- **WHEN** o plugin opencode-token-tracker é adicionado ao array de plugins
- **THEN** o sistema DEVE carregar o plugin sem erros

### REQ-002: Comando de Estatísticas
O sistema DEVE exibir o total de tokens gastos através do comando `opencode-tokens`.

#### Cenário: Comando retorna estatísticas
- **GIVEN** o plugin está instalado e configurado
- **WHEN** o usuário executa `opencode-tokens`
- **THEN** o sistema DEVE exibir estatísticas de consumo de tokens

## Critérios de Aceitação

### CA-001: Plugin Instalado
O plugin opencode-token-tracker aparece no array de plugins do opencode.json.

### CA-002: Comando Funcional
O comando `opencode-tokens` executa sem erros e retorna saída legível.

## Status
Especificação