# Spec: Extrair Serviço WhatsApp

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

### REQ-WHATS-006: Interface WhatsAppResponse

```typescript
interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

## Critérios de Aceitação

### CA-WHATS-001: Estrutura do Serviço

- [ ] Arquivo `lib/whatsapp.ts` existe
- [ ] Exporta `sendWhatsAppMessage`
- [ ] Exporta `formatOrderMessage`
- [ ] Exporta `generateWhatsAppUrl`
- [ ] Exporta tipo `WhatsAppResponse`

### CA-WHATS-002: sendWhatsAppMessage

- [ ] Aceita phoneNumberId, token, to, message
- [ ] Retorna `{ success: true, messageId: string }` em sucesso
- [ ] Retorna `{ success: false, error: string }` em falha
- [ ] Não lança exceções
- [ ] Verifica se token está configurado antes de fazer requisição

### CA-WHATS-003: formatOrderMessage

- [ ] Formata mensagem com ID do pedido (primeiros 8 caracteres)
- [ ] Inclui nome do cliente
- [ ] Inclui WhatsApp do cliente
- [ ] Inclui itens do pedido (quantidade x nome - preço)
- [ ] Inclui total formatado em BRL
- [ ] Inclui forma de pagamento (PIX ou Dinheiro)

### CA-WHATS-004: generateWhatsAppUrl

- [ ] Remove caracteres não numéricos do telefone
- [ ] Codifica mensagem para URL (encodeURIComponent)
- [ ] Retorna URL válida para wa.me (https://wa.me/{numero}?text={mensagem})

## Casos de Uso

### CU-WHATS-001: Enviar notificação de pedido

**Ator**: Sistema (via API /api/orders)
**Pré-condições**: Pedido criado com sucesso no banco
**Fluxo**:
1. API chama `sendWhatsAppMessage(phoneNumberId, token, to, message)`
2. Serviço valida token e phoneNumberId
3. Serviço faz POST para Graph API
4. Retorna sucesso ou erro
**Pós-condições**: Notificação enviada ou erro tratado

### CU-WHATS-002: Formatar mensagem de pedido

**Ator**: Sistema
**Pré-condições**: Order e OrderItems disponíveis
**Fluxo**:
1. Chamar `formatOrderMessage(order, items)`
2. Serviço formata string com template
**Pós-condições**: String formatada retornada

## Dependências

- REQ-045: O sistema **DEVE** enviar notificação via WhatsApp Business API para o owner

## Restrições

- Token não configurado não deve bloquear criação de pedidos
- Falha no envio de WhatsApp não deve reverter criação do pedido
- Mensagens devem ser em português brasileiro

## Status

Especificação