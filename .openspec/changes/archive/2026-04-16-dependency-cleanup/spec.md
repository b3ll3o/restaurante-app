# Spec: Dependency Cleanup & Project Sanitization

## Fonte da Verdade

Este documento é parte das especificações do MenuLink.

---

## Requisitos

### REQ-001: Dependências Não Utilizadas DEVEM Ser Removidas

O sistema **DEVE** remover todas as dependências declaradas no `package.json` que não são utilizadas em nenhum arquivo do projeto.

#### Cenário: Remover dependencies não utilizadas
- **GIVEN** que o projeto tem dependências declaradas no `package.json`
- **WHEN** o `depcheck` identifica uma dependência como "unused"
- **THEN** a dependência **DEVE** ser removida via `npm uninstall`

#### Cenário: Remover devDependencies não utilizadas
- **GIVEN** que o projeto tem devDependencies declaradas no `package.json`
- **WHEN** o `depcheck` identifica uma devDependency como "unused"
- **THEN** a devDependency **DEVE** ser removida via `npm uninstall`

### REQ-002: Dependências Extraneous DEVEM Ser Removidas

O sistema **DEVE** remover todas as dependências extraneous (presentes no node_modules mas não declaradas no package.json).

#### Cenário: Limpar node_modules de packages extraneous
- **GIVEN** que o projeto tem packages extraneous no node_modules
- **WHEN** uma limpeza de dependências é executada
- **THEN** o node_modules **DEVE** ser removido e reinstalado corretamente

### REQ-003: Estrutura de Diretórios DEVE Estar Consistente com Documentação

O sistema **DEVE** garantir que toda pasta mencionada na documentação exista e contenha o mínimo necessário.

#### Cenário: Criar pasta tests/integration
- **GIVEN** que a documentação menciona `tests/integration/`
- **WHEN** a pasta não existe
- **THEN** a pasta **DEVE** ser criada vazia ou com um arquivo README

---

## Critérios de Aceitação

### CA-001: npm ls --depth=0 NÃO mostra dependências extraneous

Após a limpeza, o comando `npm ls --depth=0` **NÃO DEVE** mostrar packages com sufixo "extraneous".

### CA-002: depcheck NÃO mostra dependências unused

Após a remoção, o comando `depcheck` **DEVE** retornar vazio na seção "unused".

### CA-003: npm install funciona corretamente

Após a reinstalação, `npm install` **DEVE** completar sem erros.

### CA-004: Build continua funcionando

Após a limpeza, `npm run build` **DEVE** completar com sucesso.

### CA-005: Testes continuam funcionando

Após a limpeza, `npm run test` **DEVE** completar com sucesso.

---

## Dependências

- None (esta mudança não adiciona dependências)

## Restrições

- Não remover dependências que estão em uso
- Não alterar comportamento do código
- Manter compatibilidade com scripts existentes

---

## Status

Especificação