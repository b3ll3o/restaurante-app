# Controle de Mudanças

## Fluxo SDD

```
proposal → spec → design → tasks → implementation → verification → archive
```

## Como Criar Nova Mudança

```bash
mkdir -p .openspec/changes/{nome-da-mudanca}
```

## Artefatos Obrigatórios

Cada change deve conter:

1. **proposal.md** - Proposta inicial da mudança
2. **spec.md** - Especificação formal em RFC 2119
3. **design.md** - Design técnico e decisões de arquitetura
4. **tasks.md** - Lista de tarefas de implementação
5. **status.md** - Status atual da mudança

## Verificar Status

```bash
cat .openspec/changes/{change-name}/status.md
```

## Arquivar Mudança

Após conclusão, mover para `.openspec/archive/{data}/`:

```bash
mv .openspec/changes/{change-name} .openspec/archive/{data}/
```

## Changes em Andamento

| Change | Status | Descrição |
|--------|--------|-----------|
| extract-whatsapp-service | ✅ Concluída | Extrair lib/whatsapp.ts |

## Changes Arquivadas

| Change | Data | Descrição |
|--------|------|-----------|
| whatsapp-validation | 2026-04-16 | Validação WhatsApp (implementada) |
| whatsapp-service | 2026-04-16 | Substituída por extract-whatsapp-service |