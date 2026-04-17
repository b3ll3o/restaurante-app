# Tasks: email-conf-auth-issue

**Change ID:** email-conf-auth-issue
**Pipeline:** Acelerado (config-only)
**Data:** 2026-04-17

---

## Pré-condições
- [ ] Design aprovado em `.openspec/changes/email-conf-auth-issue/design.md`

---

## Tarefas

### Fase 1: Configuração (Supabase Dashboard)

- [ ] 1.1: Acessar Supabase Dashboard → Authentication → Settings
- [ ] 1.2: Desabilitar "Enable email confirmations"
- [ ] 1.3: Salvar configurações

### Fase 2: Verificação Manual

- [ ] 2.1: Acessar `/admin/login`
- [ ] 2.2: Fazer login com credenciais de owner recém-cadastrado
- [ ] 2.3: Verificar redirecionamento para `/admin/dashboard` sem erro "Email not confirmed"
- [ ] 2.4: Confirmar **PASS** (sem erro) ou **FAIL** (erro exibido)

---

## Critério de Conclusão

**PASS**: Login funciona sem erro "Email not confirmed" → change concluída
**FAIL**: Erro "Email not confirmed" persiste → verificar se configuração foi salva corretamente

---

## Progresso
░░░░░░░░░░ 0%

## Status
Em Andamento
