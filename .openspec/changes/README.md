# Controle de Mudanças

## Fluxo SDD

```
PRD.md → Análise → proposal → spec → design → tasks → implementation → verification → archive
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

**Nenhuma** - Todas as changes foram concluídas ou arquivadas.

## Changes Arquivadas

| Change | Data | Descrição |
|--------|------|-----------|
| test-automation-strategy | 2026-04-16 | Estratégia de testes full-stack ✅ |
| extract-whatsapp-service | 2026-04-16 | Extrair lib/whatsapp.ts ✅ |
| whatsapp-validation | 2026-04-16 | Validação WhatsApp (implementada) |
| whatsapp-service | 2026-04-16 | Substituída por extract-whatsapp-service |