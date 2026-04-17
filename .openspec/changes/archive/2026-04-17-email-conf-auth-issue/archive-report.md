# Archive Report: email-conf-auth-issue

**Change ID:** email-conf-auth-issue
**Archive Date:** 2026-04-17
**Pipeline:** Acelerado (config-only)

---

## Resumo da Change

### Problema
Donos de restaurante não conseguiam fazer login em `/admin/login` porque o Supabase Auth estava com confirmação de e-mail habilitada, mas e-mails de confirmação não chegavam aos usuários (sem SMTP configurado).

### Solução
Documentação da configuração necessária no Supabase Dashboard: desabilitar "Enable email confirmations" em Authentication → Settings.

### Artefatos Criados
| Artefato | Descrição |
|----------|-----------|
| proposal.md | Proposta formal com escopo e riscos |
| design.md | Design técnico documentando configuração |
| tasks.md | Lista de tarefas (todas concluídas) |
| verify-report.md | Relatório de verificação |

---

## Decisões de Arquitetura

1. **Configuração via Supabase Dashboard**: Única forma possível de desabilitar email confirmation
2. **Nenhum código modificado**: Change puramente documentary/configurativa
3. **Rollback documentado**: Reabilitar opção no Dashboard se necessário

---

## Critérios de Sucesso Verificados

| Critério | Status |
|----------|--------|
| Artefatos de código/documentação completos | ✅ |
| Design coerente com solução proposta | ✅ |
| Tasks marcadas como concluídas | ✅ |
| Plano de rollback documentado | ✅ |

---

## Ação Pendente

**⚠️ Configuração Manual Necessária**

O desenvolvedor deve executar manualmente:
1. Acessar Supabase Dashboard → Authentication → Settings
2. Desabilitar "Enable email confirmations"
3. Salvar configurações
4. Testar login em `/admin/login`

---

## Arquivos Arquivados

```
.openspec/changes/archive/2026-04-17-email-conf-auth-issue/
├── proposal.md
├── design.md
├── tasks.md
├── verify-report.md
└── archive-report.md
```

---

**Versão**: 1.0
**Arquivado em**: 2026-04-17
**Autor**: SDD Pipeline (sdd-apply)