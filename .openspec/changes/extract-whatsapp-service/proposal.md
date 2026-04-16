# Proposta: Extrair Serviço WhatsApp para Módulo Reutilizável

## Problema

A integração com WhatsApp Business API está implementada inline em `app/api/orders/route.ts` (função `sendWhatsAppNotification`). Isso viola o princípio de separação de responsabilidades definido em `.openspec/AGENTS.md` (lib/AGENTS.md) e impede reutilização em outras partes da aplicação.

## Solução Proposta

Extrair a lógica de WhatsApp para um serviço dedicado em `lib/whatsapp.ts`, conforme arquitetura definida em `.openspec/specs/menulink-technical-plan.md` seção 6 (Estrutura de Diretórios).

## Impacto

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

## Alternativas Consideradas

1. **Manter inline em route.ts** - Viola princípio de responsabilidade única (SRP)
2. **Criar classe WhatsAppService** - Interface diferente da especificada em lib/AGENTS.md

## Urgência

- [x] Alta
- [ ] Média
- [ ] Baixa

## Status

Proposta