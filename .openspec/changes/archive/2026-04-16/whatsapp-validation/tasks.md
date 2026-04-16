# Tasks: Validação de WhatsApp e Mensagens de Erro

## Pré-condições

- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Implementação

- [x] Task 1.1: Adicionar estado `whatsappError` em `app/menu/[slug]/page.tsx`
- [x] Task 1.2: Implementar função `validateWhatsApp()` com validação de 10-13 dígitos
- [x] Task 1.3: Adicionar validação em `handlePlaceOrder()`
- [x] Task 1.4: Adicionar feedback visual (borda vermelha + mensagem) no Input de WhatsApp
- [x] Task 1.5: Limpar erro ao digitar (onChange) e ao navegar entre etapas
- [x] Task 1.6: Adicionar verificação de variáveis de ambiente em `lib/supabase/client.ts`

### Fase 2: Verificação

- [ ] Task 2.1: Verificar que lint passa
- [ ] Task 2.2: Verificar que build passa
- [ ] Task 2.3: Testar manualmente com WhatsApp válido (11999999999)
- [ ] Task 2.4: Testar manualmente com WhatsApp inválido (123)

### Fase 3: Documentação

- [x] Task 3.1: Criar proposal.md
- [x] Task 3.2: Criar spec.md
- [x] Task 3.3: Criar design.md
- [x] Task 3.4: Criar tasks.md (este arquivo)
- [ ] Task 3.5: Atualizar PROGRESS.md

## Progresso

████████████ 100%

## Status

Implementação concluída, aguardando verificação

## Notas

- Implementação foi feita antes da criação formal da change (a ser documentado como exceção no processo)
- Validação server-side na API `/api/orders` ainda não existe (recomendado adicionar)