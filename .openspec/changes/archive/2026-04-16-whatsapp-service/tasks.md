# Tasks: Extrair Serviço WhatsApp

## Pré-condições

- [ ] Spec aprovada
- [ ] Design aprovado

## Tarefas

### Fase 1: Criar lib/whatsapp.ts

- [ ] Task 1.1: Criar arquivo `lib/whatsapp.ts`
- [ ] Task 1.2: Implementar tipo `WhatsAppResponse`
- [ ] Task 1.3: Implementar `sendWhatsAppMessage()`
- [ ] Task 1.4: Implementar `formatOrderMessage()`
- [ ] Task 1.5: Implementar `generateWhatsAppUrl()`

### Fase 2: Refatorar API Route

- [ ] Task 2.1: Importar funções de `lib/whatsapp.ts` em `app/api/orders/route.ts`
- [ ] Task 2.2: Substituir `sendWhatsAppNotification()` inline pela função do serviço
- [ ] Task 2.3: Remover código duplicado

### Fase 3: Verificação

- [ ] Task 3.1: Verificar que lint passa
- [ ] Task 3.2: Verificar que build passa
- [ ] Task 3.3: Testar manualmente criação de pedido (verificar WhatsApp)

### Fase 4: Documentação

- [ ] Task 4.1: Atualizar PROGRESS.md
- [ ] Task 4.2: Verificar que lib/AGENTS.md está atualizado

## Progresso

░░░░░░░░░░ 0%

## Status

Aguardando aprovação

## Notas

- Esta mudança é necessária para seguir a arquitetura definida em `.openspec/AGENTS.md`
- O serviço atual em `route.ts` será movido para `lib/whatsapp.ts`