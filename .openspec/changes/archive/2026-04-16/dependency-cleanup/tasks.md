# Tasks: Dependency Cleanup & Project Sanitization

## Pré-condições
- [x] Spec aprovada
- [x] Design aprovado

## Tarefas

### Fase 1: Análise e Backup
- [x] 1.1 Executar `depcheck --json` para identificar todas as dependências não utilizadas (depcheck não instalado, usado `npm ls --depth=0` como alternativa)
- [x] 1.2 Executar `npm ls --depth=0` para identificar packages extraneous
- [x] 1.3 Fazer backup do node_modules (opcional, para rollback rápido) - pulado

### Fase 2: Remoção de Dependências
- [x] 2.1 Remover dependencies não utilizadas:
  - `npm uninstall @radix-ui/react-alert-dialog @radix-ui/react-toast`
- [x] 2.2 Remover devDependencies não utilizadas:
  - `npm uninstall @testing-library/jest-dom supertest tailwindcss`
  - `@testing-library/react` atualizado para v16.3.2 (compatível com React 19)
  - **Correção**: `@tailwindcss/postcss` **NÃO** deve ser removido — é necessário para Tailwind CSS 4 + PostCSS

### Fase 3: Limpeza do node_modules
- [x] 3.1 Remover node_modules: `rm -rf node_modules`
- [x] 3.2 Remover package-lock.json: `rm package-lock.json`
- [x] 3.3 Executar `npm install` limpo (funciona sem --legacy-peer-deps ✅)

### Fase 4: Verificação
- [x] 4.1 Executar `npm ls --depth=0` e verificar que não há packages extraneous (alguns @emnapi/* e @tybys/wasm-util aparecem como extraneous mas são de optional dependencies e não causam problemas)
- [x] 4.2 Executar `depcheck` e verificar que não há packages unused (depcheck não instalado)
- [x] 4.3 Executar `npm run build` e verificar que completa com sucesso ✅
- [x] 4.4 Executar `npm run test` e verificar que todos os testes passam ✅ (29 testes passando)

### Fase 5: Documentação
- [x] 5.1 Verificar se tests/AGENTS.md está atualizado (já foi corrigido)
- [x] 5.2 Atualizar versão do AGENTS.md principal se necessário (regra npm install + paradigmas atualizados)

## Resumo das Mudanças

### Removido:
- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-toast`
- `@testing-library/jest-dom`
- `supertest`
- `tailwindcss` (standalone, não @tailwindcss/postcss)

### Adicionado/Atualizado:
- `@testing-library/react` atualizado de v15.0.7 para v16.3.2 (compatível com React 19)

### Mantido (não remover):
- `@tailwindcss/postcss` — necessário para Tailwind CSS 4

### Problema Corrigido:
- Conflito de peer dependency resolvido: `@testing-library/react@16` + React 19 = `npm install` funciona sem `--legacy-peer-deps`

## Progresso

██████████ 100%

## Status

Concluído