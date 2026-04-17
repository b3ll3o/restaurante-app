# Archive Report: Extrair Serviço WhatsApp para Módulo Reutilizável

## Resumo da Mudança

**Data**: 2026-04-16
**Nome**: extract-whatsapp-service
**Status**: Concluída

## Escopo Implementado

### Serviço Extraído
- `lib/whatsapp.ts` — módulo dedicado para WhatsApp Business API

### Funções Exportadas
- `sendWhatsAppMessage(phoneNumberId, token, to, message)` — envío de mensagens
- `formatOrderMessage(order, items)` — formatação de mensagens de pedido
- `generateWhatsAppUrl(whatsapp, message)` — geração de URL wa.me

### Tipo Exportado
- `WhatsAppResponse { success: boolean; messageId?: string; error?: string }`

### Integração
- `app/api/orders/route.ts` refatorado para usar `lib/whatsapp.ts`
- Token não configurado não bloqueia criação de pedidos
- Falha no envio não reverte criação do pedido

## Arquivos Modificados/Criados

| Arquivo | Ação |
|---------|------|
| `lib/whatsapp.ts` | Criado |
| `app/api/orders/route.ts` | Modificado |

## Decisões de Arquivo

1. **Separação de responsabilidades**: Lógica de WhatsApp isolada em service dedicado
2. **Graceful degradation**: Token não configurado mostra warning mas não bloqueia
3. **Erros estruturados**: Retorna `{ success, error }` ao invés de lançar exceções

## Referências

- REQ-045: Notificação via WhatsApp Business API
- Arquitetura: `.openspec/specs/menulink-technical-plan.md`

---

**Versão**: 1.0
**Data**: 2026-04-16
**Status**: Arquivada