# Proposta: Dependency Cleanup & Project Sanitization

## Problema

O projeto MenuLink apresenta os seguintes problemas de dependências e estrutura:

### 1. Dependências Não Utilizadas (unused)
O `depcheck` identificou que as seguintes dependências estão declaradas mas **não são utilizadas** em nenhum arquivo:

**Dependencies:**
- `@radix-ui/react-alert-dialog` - não existe arquivo usando AlertDialog
- `@radix-ui/react-toast` - não existe arquivo usando Toast

**DevDependencies:**
- `@tailwindcss/postcss` - não utilizado (Tailwind 4 usa PostCSS via Vite, não precisa deste pacote)
- `@testing-library/jest-dom` - não utilizado (parece não estar sendo importado em lugar nenhum)
- `supertest` - não utilizado (para testes de API HTTP, mas não temos testes de integração de API)
- `tailwindcss` - duplicado (já temos `@tailwindcss/postcss` que é o correto para Tailwind 4)

### 2. Dependências Extraneous (não declaradas no package.json)
Estas dependências estão instaladas mas não estão no package.json:
- `@emnapi/core@1.9.2`
- `@emnapi/runtime@1.9.2`
- `@emnapi/wasi-threads@1.2.1`
- `@napi-rs/wasm-runtime@0.2.12`
- `@tybys/wasm-util@0.10.1`

Provavelmente foram instaladas como transitive dependencies de outras bibliotecas e acabaram no node_modules.

### 3. Pasta tests/integration Vazia
O AGENTS.md menciona `tests/integration/` mas a pasta não existe, causando confusão na documentação.

## Solução Proposta

### Fase 1: Remoção de Dependências Não Utilizadas

```bash
# Remover dependencies não utilizadas
npm uninstall @radix-ui/react-alert-dialog @radix-ui/react-toast

# Remover devDependencies não utilizadas
npm uninstall @testing-library/jest-dom supertest tailwindcss @tailwindcss/postcss
```

### Fase 2: Limpeza de node_modules (remoção de extraneous packages)

```bash
# Remover node_modules e reinstalar
rm -rf node_modules
rm package-lock.json  # ou yarn.lock/pnpm-lock.yaml
npm install
```

### Fase 3: Criar Estrutura de Testes de Integração

```bash
mkdir -p tests/integration
# Criar placeholder ou arquivos de teste de integração
```

### Fase 4: Atualizar Documentação

- Atualizar `tests/AGENTS.md` para refletir a estrutura real
- Atualizar `package.json` se necessário

## Impacto

- [ ] **Breaking changes?** Não - apenas remoção de código morto
- [ ] **Migração necessária?** Não
- [ ] **Novos dependencies?** Não
- [ ] **Pode afetar build/testes?** Não - são dependências não utilizadas

## Alternativas Consideradas

### Alternativa 1: Manter as dependências
- **Descartada**: Aumenta bundle size desnecessariamente e causa confusão na equipe
- Impacto: ~500KB de dependências não utilizadas

### Alternativa 2: Apenas remover do package.json (não reinstalar node_modules)
- **Descartada**: Deixaria dependências extraneous no node_modules
- Não resolve o problema completo

## Urgência

- [ ] Crítica
- [x] Alta - manutenção preventiva
- [ ] Média
- [ ] Baixa

## Status

Proposta