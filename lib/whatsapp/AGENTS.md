# WhatsApp Service - MenuLink

## Visão Geral

**Módulo**: `lib/whatsapp`
**Responsabilidade**: Integração com WhatsApp Business API para envio de notificações de pedidos
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + TypeScript + WhatsApp Graph API

---

## Estrutura de Diretórios

```
lib/whatsapp/
├── whatsapp.ts    # Funções de integração WhatsApp
└── AGENTS.md      # Esta documentação
```

---

## Responsabilidade

Este módulo fornece funções para envio de notificações via WhatsApp, formatação de mensagens de pedido e geração de URLs para wa.me.

---

## Interface Pública

| Função | Assinatura | Descrição |
|--------|------------|-----------|
| `sendWhatsAppMessage` | `(phoneNumberId, token, to, message) => Promise<WhatsAppResponse>` | Envia mensagem via API Graph |
| `formatOrderMessage` | `(order, items) => string` | Formata mensagem de pedido |
| `generateWhatsAppUrl` | `(whatsapp, message) => string` | Gera URL wa.me |

---

## Tipos

```typescript
export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

---

## Funções Principais

### sendWhatsAppMessage

Envia mensagem via WhatsApp Business API (Graph API v18.0).

```typescript
export async function sendWhatsAppMessage(
  phoneNumberId: string,
  token: string,
  to: string,
  message: string
): Promise<WhatsAppResponse>
```

**Parâmetros:**
- `phoneNumberId`: ID do número de telefone do WhatsApp Business
- `token`: Token de acesso da API Graph
- `to`: Número de telefone do destinatário
- `message`: Texto da mensagem

**Retorno:**
```typescript
{ success: boolean; messageId?: string; error?: string }
```

**Comportamento:**
- Remove caracteres não numéricos do número destinatário
- Retorna erro estruturado se API não estiver configurada
- Nunca faz throw, sempre retorna `WhatsAppResponse`

### formatOrderMessage

Formata mensagem de pedido para envio via WhatsApp.

```typescript
export function formatOrderMessage(
  order: {
    id: string;
    customer_name: string;
    customer_whatsapp: string;
    total: number;
    payment_method: string;
  },
  items: {
    quantity: number;
    product_name: string;
    total_price: number;
  }[]
): string
```

**Formato da mensagem:**
```
*NOVO PEDIDO #XXXXXXXX*

*Cliente:* Nome do Cliente
*WhatsApp:* 11999999999
*Pagamento:* PIX

*Itens:* 2x Produto A - R$ 10.00, 1x Produto B - R$ 25.00

*Total:* R$ 35.00

Acesse o painel para confirmar ou cancelar.
```

### generateWhatsAppUrl

Gera URL para abrir WhatsApp com mensagem pré-preenchida.

```typescript
export function generateWhatsAppUrl(whatsapp: string, message: string): string
```

**Retorna:** `https://wa.me/{numero}?text={mensagem编码}`

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `WHATSAPP_TOKEN` | Sim | Token da API Graph do WhatsApp Business |
| `WHATSAPP_PHONE_NUMBER_ID` | Sim | Phone Number ID do WhatsApp Business |

**Nota:** As variáveis são passadas como parâmetros nas funções (`phoneNumberId`, `token`), não lidas diretamente do ambiente.

---

## Formato de Mensagens

O WhatsApp Business API suporta Markdown-like formatting:

| Formatação | Sintaxe |
|------------|---------|
| Negrito | `*texto*` |
| Itálico | `_texto_` (não suportado em todas as versões) |

---

## Regras de Implementação

1. **Retorno Estruturado**: Nunca faz throw, sempre retorna `{ success, error? }`
2. **Validação de Config**: Retorna erro se token ou phoneNumberId não fornecidos
3. **Formatação de Número**: Sempre remove caracteres não numéricos antes de enviar
4. **Sem Side Effects**: Funções puras para formatação; API call é isolada em `sendWhatsAppMessage`
5. **Type Safety**: Tipos explícitos para todas as funções e retornos

---

## Uso

```typescript
import { formatOrderMessage, generateWhatsAppUrl, sendWhatsAppMessage } from "@/lib/whatsapp";

// Cenário 1: Gerar URL para link direto (redirecionamento)
const message = formatOrderMessage(order, orderItems);
const whatsappUrl = generateWhatsAppUrl(restaurant.owner_whatsapp, message);
return NextResponse.json({ whatsappUrl });

// Cenário 2: Envio direto via API Graph
const result = await sendWhatsAppMessage(
  process.env.WHATSAPP_PHONE_NUMBER_ID!,
  process.env.WHATSAPP_TOKEN!,
  customer_whatsapp,
  message
);
if (!result.success) {
  console.error("Falha ao enviar:", result.error);
}
```

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/api/orders/route.ts` | Usa `formatOrderMessage` e `generateWhatsAppUrl` |
| `app/admin/orders/page.tsx` | Exibe link do WhatsApp |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Complexidade ciclomática | ≤5 | Média |
| Linhas por função | ≤30 | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| (nenhuma externa) | - | Usa fetch nativo |

---

## Referências

- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [WhatsApp Message Templates](https://developers.facebook.com/docs/whatsapp/api/messages)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent