# Spec: Serviço de Integração WhatsApp

## Fonte da Verdade

Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-WHATS-001: Serviço de WhatsApp

O sistema **DEVE** possuir um serviço dedicado em `lib/whatsapp.ts` para envio de notificações via WhatsApp Business API.

### REQ-WHATS-002: Função sendWhatsAppMessage

O serviço **DEVE** exportar a função `sendWhatsAppMessage(phoneNumberId, token, to, message)` que retorna `Promise<WhatsAppResponse>`.

### REQ-WHATS-003: Função formatOrderMessage

O serviço **DEVE** exportar a função `formatOrderMessage(order, items)` que formata uma mensagem de pedido completa.

### REQ-WHATS-004: Função generateWhatsAppUrl

O serviço **DEVE** exportar a função `generateWhatsAppUrl(whatsapp, message)` que gera URL para wa.me.

### REQ-WHATS-005: Tratamento de Erros

O serviço **DEVE** tratar erros de API e retornar resposta estruturada com `success: boolean` e `error?: string`.

## Critérios de Aceitação

### CA-WHATS-001: Estrutura do Serviço

- [ ] Arquivo `lib/whatsapp.ts` existe
- [ ] Exporta `sendWhatsAppMessage`
- [ ] Exporta `formatOrderMessage`
- [ ] Exporta `generateWhatsAppUrl`
- [ ] Exporta tipos `WhatsAppResponse`

### CA-WHATS-002: sendWhatsAppMessage

- [ ] Aceita phoneNumberId, token, to, message
- [ ] Retorna `{ success: true, messageId: string }` em sucesso
- [ ] Retorna `{ success: false, error: string }` em falha
- [ ] Não lança exceções

### CA-WHATS-003: formatOrderMessage

- [ ] Formata mensagem com ID do pedido
- [ ] Inclui nome do cliente
- [ ] Inclui itens do pedido
- [ ] Inclui total
- [ ] Inclui forma de pagamento

### CA-WHATS-004: generateWhatsAppUrl

- [ ] Remove caracteres não numéricos do telefone
- [ ] Codifica mensagem para URL
- [ ] Retorna URL válida para wa.me

## Dependências

- REQ-045: Notificação via WhatsApp Business API

## Restrições

- Token não configurado não deve bloquear criação de pedidos
- Falha no envio de WhatsApp não deve reverter criação do pedido

## Status

Especificação