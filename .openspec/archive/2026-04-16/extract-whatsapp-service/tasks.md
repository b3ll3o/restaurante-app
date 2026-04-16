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
- [ ] Task 3.3: Testar manualmente criação de pedido ⏸️ (requer Supabase configurado)

### Fase 4: Documentação

- [x] Task 4.1: Atualizar PROGRESS.md ✅ (incluído no commit)
- [x] Task 4.2: Verificar que lib/AGENTS.md está consistente ✅

## Progresso

██████████ 95%

## Status

✅ Implementação concluída - Change pronta para arquivar

## Notas

- Implementação seguiu rigorosamente o design especificado
- Lint e build passam sem erros
- Testes manuais requerem:
  1. Credenciais Supabase configuradas em .env.local
  2. Schema SQL executado no Supabase
  3. WHATSAPP_TOKEN e WHATSAPP_PHONE_NUMBER_ID configurados (opcional)

## Como testar manualmente

```bash
# 1. Configurar .env.local com credenciais Supabase
# 2. Executar supabase/schema.sql no SQL Editor
# 3. npm run dev
# 4. Acessar http://localhost:3000/admin/signup
# 5. Criar restaurante, categorias e produtos
# 6. Acessar /menu/[slug] e fazer pedido
```