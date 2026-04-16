# Spec: Validação de WhatsApp e Mensagens de Erro

## Fonte da Verdade

Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-VAL-001: Validação de WhatsApp no Checkout

O sistema **DEVE** validar o campo WhatsApp antes de enviar o pedido, aceitando apenas números brasileiros válidos com 10 a 13 dígitos (incluindo DDI +55 opcional).

### REQ-VAL-002: Feedback Visual de Erro

O sistema **DEVE** mostrar mensagem de erro inline quando o WhatsApp for inválido, com borda vermelha no campo correspondente.

### REQ-VAL-003: Validação Client-Side

O sistema **DEVE** realizar validação client-side para melhorar a experiência do usuário, sem prejuízo da validação server-side.

### REQ-VAL-004: Mensagem de Erro para Supabase Não Configurado

O sistema **DEVE** mostrar erro claro no console quando as variáveis de ambiente do Supabase não estiverem configuradas.

## Critérios de Aceitação

### CA-VAL-001: Validação de Formato

- [ ] `11999999999` é aceito (11 dígitos)
- [ ] `5511999999999` é aceito (13 dígitos com DDI)
- [ ] `999999999` é rejeitado (9 dígitos - inválido)
- [ ] `abc` é rejeitado (não numérico)
- [ ] `119999999999999` é rejeitado (15 dígitos - muito longo)

### CA-VAL-002: Feedback Visual

- [ ] Campo mostra borda vermelha quando inválido
- [ ] Mensagem "Digite um WhatsApp válido" aparece abaixo do campo
- [ ] Erro é limpo ao digitar valor válido

### CA-VAL-003: Console Warning

- [ ] Warning aparece no console quando `NEXT_PUBLIC_SUPABASE_URL` está vazio
- [ ] Warning aparece no console quando `NEXT_PUBLIC_SUPABASE_ANON_KEY` está vazio

## Casos de Uso

### CU-VAL-001: Cliente digita WhatsApp inválido

**Ator**: Cliente no checkout
**Pré-condições**: Cliente está na etapa de checkout com itens no carrinho
**Fluxo**:
1. Cliente digita "123" no campo WhatsApp
2. Cliente clica em "Confirmar e Enviar"
3. Sistema exibe erro "Digite um WhatsApp válido"
4. Campo fica com borda vermelha
**Pós-condições**: Pedido não é enviado, erro é mostrado

### CU-VAL-002: Cliente corrige WhatsApp

**Ator**: Cliente no checkout
**Pré-condições**: Cliente viu erro de WhatsApp inválido
**Fluxo**:
1. Cliente digita "11999999999"
2. Erro desaparece
3. Cliente pode enviar pedido
**Pós-condições**: Erro não é mais exibido

## Dependências

- REQ-040 (Checkout com nome e WhatsApp)

## Restrições

- Validação client-side **NÃO** substitui validação server-side
- Mensagens de erro devem ser em português brasileiro

## Status

Especificação