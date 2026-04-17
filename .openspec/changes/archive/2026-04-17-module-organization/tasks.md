# Tasks: module-organization

## Pré-condições
- [ ] Proposal aprovado
- [ ] Spec aprovada
- [ ] Design aprovado

## Tarefas

### Fase 1: Análise da Estrutura Atual

- [x] 1.1: Analisar estrutura atual de `app/`
- Identificar módulos existentes
- Mapear onde AGENTS.md estão localizados
- Mapear onde arquivos .feature estão localizados
- **Verificação**: Run: `ls -la app/*/AGENTS.md app/*/*/AGENTS.md 2>/dev/null | grep -c AGENTS.md` | Expected: contagem de AGENTS.md encontrados

- [x] 1.2: Analisar estrutura de `components/`
- Identificar componentes existentes
- Mapear AGENTS.md e .feature
- **Verificação**: Run: `ls -la components/*/AGENTS.md components/*/*/AGENTS.md 2>/dev/null | grep -c AGENTS.md` | Expected: contagem de AGENTS.md encontrados

- [x] 1.3: Analisar estrutura de `lib/`
- Identificar utilitários e serviços
- Mapear AGENTS.md existentes
- **Verificação**: Run: `ls -la lib/*/AGENTS.md 2>/dev/null | grep -c AGENTS.md` | Expected: contagem de AGENTS.md encontrados

- [x] 1.4: Analisar estrutura de `context/`, `hooks/`, `types/`
- Verificar existência de AGENTS.md
- Verificar existência de .feature
- **Verificação**: Run: `ls -la context/AGENTS.md hooks/AGENTS.md types/AGENTS.md 2>/dev/null | grep -c AGENTS.md` | Expected: 3 (um para cada módulo)

### Fase 2: Reorganização de Módulos

- [x] 2.1: Criar AGENTS.md em `app/menu/[slug]/checkout/`
- Módulo `app/menu/[slug]/checkout/` não possui AGENTS.md (único módulo incorreto identificado)
- Criar documentação seguindo template padrão de AGENTS.md
- **Verificação**: Run: `ls -la app/menu/\[slug\]/checkout/AGENTS.md` | Expected: arquivo existe

- [x] 2.2: Verificar módulos de `components/`
- **Status**: 97% conformidade - módulos já estão corretos
- Verificar se todos os componentes possuem AGENTS.md no nível correto
- **Verificação**: Run: `ls -la components/ui/AGENTS.md components/admin/AGENTS.md 2>/dev/null` | Expected: ambos existem

- [x] 2.3: Verificar módulos de `lib/`
- **Status**: 97% conformidade - módulos já estão corretos
- Verificar se todos os submódulos possuem AGENTS.md
- **Verificação**: Run: `ls -la lib/supabase/AGENTS.md lib/AGENTS.md 2>/dev/null` | Expected: ambos existem

- [x] 2.4: Verificar módulos de `context/`, `hooks/`, `types/`
- **Status**: 97% conformidade - módulos já estão corretos
- Verificar se todos os módulos possuem AGENTS.md
- **Verificação**: Run: `ls -la context/AGENTS.md hooks/AGENTS.md types/AGENTS.md 2>/dev/null` | Expected: todos existem

### Fase 3: Verificação e Consolidação

- [x] 3.1: Verificar imports após reorganização
- Executar `npm run build` para validar
- Corrigir imports quebrados
- **Verificação**: Run: `npm run build 2>&1 | tail -20` | Expected: "Compiled successfully" ou "Route (app)" listado

- [x] 3.2: Verificar consistência da documentação
- Verificar referências entre AGENTS.md
- Atualizar tags @integration-test em .feature se necessário
- **Verificação**: Run: `grep -r "@integration-test" --include="*.feature" . | wc -l` | Expected: contagem de cenários com tags

### Fase 4: Documentação Final

- [x] 4.1: Criar `verify-report.md` com compliance report
- [x] 4.2: Consolidar mudanças no `.openspec/specs/menulink-modules-documentation.md`
- **Verificação**: Run: `grep "module-organization" .openspec/specs/menulink-modules-documentation.md` | Expected: referência à change

## Progresso
```
██████████ 100%
```

## Status
Concluído

## Resumo dos Blockers Corrigidos

| Blocker | Correção Aplicada |
|---------|-------------------|
| BLOCKER 1 | Adicionada seção "Verificação" com comando e expected result em todas as tasks 2.1-2.4 e 3.1-3.2 |
| BLOCKER 2 | Especificado que 2.1 cria AGENTS.md em `app/menu/[slug]/checkout/`; 2.2-2.4 verificam conformidade (97% já correto) |
| BLOCKER 3 | Adicionada verificação em todas as tasks 1.1-1.4 com comando ls e expected de contagem |