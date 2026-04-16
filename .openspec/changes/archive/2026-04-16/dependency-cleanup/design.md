# Design: Dependency Cleanup & Project Sanitization

## Decisões de Arquitetura

### 1. Análise de Dependências

Usar `depcheck` para identificar:
- Dependências não utilizadas (unused)
- Dependências extraneous (não declaradas no package.json)

### 2. Estratégia de Remoção

**Opção Escolhida**: Remoção completa + reinstalação
- Remove packages não utilizados do package.json
- Remove node_modules completo
- Remove package-lock.json
- Executa npm install limpo

**Justificativa**: Garante que dependências transitive desnecessárias também sejam removidas.

### 3. Verificação

Após a limpeza, verificar:
- `npm ls --depth=0` - sem extraneous
- `depcheck` - sem unused
- `npm run build` - continua funcionando
- `npm run test` - continua funcionando

## Arquitetura

### Fluxo de Limpeza

```
1. Identificar dependências não utilizadas (depcheck)
       ↓
2. Remover do package.json (npm uninstall)
       ↓
3. Remover node_modules e lockfile
       ↓
4. Reinstalar dependências (npm install)
       ↓
5. Verificar (build + tests)
```

## Arquivos a Modificar

- `package.json` - remoção de dependências não utilizadas
- `tests/AGENTS.md` - atualizar estrutura de diretórios (se necessário)

## Dependências

| Dependência | Ação |
|-------------|------|
| @radix-ui/react-alert-dialog | REMOVER |
| @radix-ui/react-toast | REMOVER |
| @tailwindcss/postcss | REMOVER |
| @testing-library/jest-dom | REMOVER |
| supertest | REMOVER |
| tailwindcss | REMOVER |

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Remover dependência que está em uso | Verificar com `depcheck --detailed` antes de remover |
| Build quebrar após reinstalação | Fazer backup do node_modules antes da limpeza |
| Tests falharem | Executar testes antes e depois da limpeza |

## Estimativa

- **Tempo**: ~15 minutos
- **Complexidade**: Baixa
- **Risco**: Mínimo