# Tasks: Extrair Serviço WhatsApp

## Pré-condições

- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Criar lib/whatsapp.ts

- [x] Task 1.1: Criar arquivo `lib/whatsapp.ts`
- [x] Task 1.2: Implementar tipo `WhatsAppResponse`
- [x] Task 1.3: Implementar `sendWhatsAppMessage()`
- [x] Task 1.4: Implementar `formatOrderMessage()`
- [x] Task 1.5: Implementar `generateWhatsAppUrl()`

### Fase 2: Refatorar API Route

- [x] Task 2.1: Importar funções de `lib/whatsapp.ts` em `app/api/orders/route.ts`
- [x] Task 2.2: Substituir `sendWhatsAppNotification()` inline pela função do serviço
- [x] Task 2.3: Remover código duplicado

### Fase 3: Verificação

- [x] Task 3.1: Verificar que lint passa (`npm run lint`) ✅
- [x] Task 3.2: Verificar que build passa (`npm run build`) ✅
- [ ] Task 3.3: Testar manualmente criação de pedido

### Fase 4: Documentação

- [ ] Task 4.1: Atualizar PROGRESS.md
- [ ] Task 4.2: Verificar que lib/AGENTS.md está consistente

## Progresso

██████████ 90%

## Status

Implementação concluída, aguardando testes manuais

## Notas

- Implementação seguiu rigorosamente o design especificado
- Lint e build passam sem erros
- Falta testar manualmente o fluxo completo