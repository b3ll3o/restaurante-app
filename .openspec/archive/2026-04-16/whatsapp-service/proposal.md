# Proposta: Extrair Serviço WhatsApp para Módulo Reutilizável

## Problema

A integração com WhatsApp Business API está implementada inline em `app/api/orders/route.ts`. Isso viola o princípio de separação de responsabilidades e impede reutilização em outras partes da aplicação.

## Solução Proposta

Extrair a lógica de WhatsApp para um serviço dedicado em `lib/whatsapp.ts`, seguindo a arquitetura definida em `.openspec/AGENTS.md` (lib/AGENTS.md).

## Impacto

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

## Alternativas Consideradas

1. **Manter inline em route.ts** - Viola princípio de responsabilidade única
2. **Criar classe/hook WhatsApp** - Interface diferente da especificada

## Urgência

- [x] Alta
- [ ] Média
- [ ] Baixa

## Status

Proposta