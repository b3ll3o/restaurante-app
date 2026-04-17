# Testes de Integração - MenuLink

## Visão Geral

Módulo de testes de integração que valida a interação entre módulos do sistema MenuLink. Cada teste de integração é derivado de cenários BDD documentados em arquivos `.feature` nos respectivos módulos.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Vitest + Supabase Test Utils

---

## Estrutura de Diretórios

```
tests/integration/
├── AGENTS.md          # Esta documentação
├── login.test.ts      # Login admin
├── signup.test.ts     # Cadastro admin
├── dashboard.test.ts  # Dashboard admin
├── categories.test.ts # CRUD categorias
├── products.test.ts   # CRUD produtos
├── orders.test.ts     # Gestão pedidos
├── orders-api.test.ts # API de pedidos
├── settings.test.ts   # Configurações restaurante
└── menu.test.ts       # Cardápio público
```

---

## Tabela de Links: Cenários BDD ↔ Testes de Integração

| Módulo | Arquivo BDD (.feature) | Teste de Integração | Tag @integration-test |
|--------|------------------------|---------------------|----------------------|
| Login Admin | `app/admin/login/login.feature` | `tests/integration/login.test.ts` | `@integration-test="tests/integration/login.test.ts"` |
| Cadastro Admin | `app/admin/signup/signup.feature` | `tests/integration/signup.test.ts` | `@integration-test="tests/integration/signup.test.ts"` |
| Dashboard Admin | `app/admin/dashboard/dashboard.feature` | `tests/integration/dashboard.test.ts` | `@integration-test="tests/integration/dashboard.test.ts"` |
| Categorias | `app/admin/categories/categories.feature` | `tests/integration/categories.test.ts` | `@integration-test="tests/integration/categories.test.ts"` |
| Produtos | `app/admin/products/products.feature` | `tests/integration/products.test.ts` | `@integration-test="tests/integration/products.test.ts"` |
| Pedidos Admin | `app/admin/orders/orders.feature` | `tests/integration/orders.test.ts` | `@integration-test="tests/integration/orders.test.ts"` |
| Configurações | `app/admin/settings/settings.feature` | `tests/integration/settings.test.ts` | `@integration-test="tests/integration/settings.test.ts"` |
| API Pedidos | `app/api/orders/orders.feature` | `tests/integration/orders-api.test.ts` | `@integration-test="tests/integration/orders-api.test.ts"` |
| Cardápio Público | `app/menu/[slug]/menu.feature` | `tests/integration/menu.test.ts` | `@integration-test="tests/integration/menu.test.ts"` |

---

## Tags @integration-test

A tag `@integration-test` é usada nos arquivos `.feature` para vincular cada cenário BDD ao teste de integração correspondente.

### Formato

```gherkin
@integration-test="tests/integration/{modulo}.test.ts"
```

### Regra de Proximidade BDD

Os arquivos `.feature` DEVEM estar no nível mais próximo do módulo que documentam:

| Módulo | Arquivo BDD | Proximidade |
|--------|-------------|-------------|
| Login | `app/admin/login/login.feature` | Mesma pasta da rota |
| Cadastro | `app/admin/signup/signup.feature` | Mesma pasta da rota |
| Dashboard | `app/admin/dashboard/dashboard.feature` | Mesma pasta da rota |
| Categorias | `app/admin/categories/categories.feature` | Mesma pasta da rota |
| Produtos | `app/admin/products/products.feature` | Mesma pasta da rota |
| Pedidos Admin | `app/admin/orders/orders.feature` | Mesma pasta da rota |
| Configurações | `app/admin/settings/settings.feature` | Mesma pasta da rota |
| API Pedidos | `app/api/orders/orders.feature` | Mesma pasta da rota |
| Cardápio | `app/menu/[slug]/menu.feature` | Mesma pasta da rota |

---

## Cenários BDD por Módulo

### Login Admin (`app/admin/login/login.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin faz login com credenciais válidas | `tests/integration/login.test.ts` |
| Admin faz login com credenciais inválidas | `tests/integration/login.test.ts` |
| Admin tenta login com email inválido | `tests/integration/login.test.ts` |
| Admin tenta login com campos vazios | `tests/integration/login.test.ts` |

### Cadastro Admin (`app/admin/signup/signup.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin cria conta com dados válidos | `tests/integration/signup.test.ts` |
| Admin tenta criar conta com email já existente | `tests/integration/signup.test.ts` |
| Admin tenta criar conta com senhas diferentes | `tests/integration/signup.test.ts` |

### Dashboard Admin (`app/admin/dashboard/dashboard.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin acessa dashboard | `tests/integration/dashboard.test.ts` |
| Admin visualiza métricas de pedidos | `tests/integration/dashboard.test.ts` |
| Admin acessa dashboard sem estar autenticado | `tests/integration/dashboard.test.ts` |

### Categorias (`app/admin/categories/categories.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin cria categoria válida | `tests/integration/categories.test.ts` |
| Admin cria categoria sem nome | `tests/integration/categories.test.ts` |
| Admin edita categoria existente | `tests/integration/categories.test.ts` |
| Admin exclui categoria sem produtos | `tests/integration/categories.test.ts` |
| Admin tenta excluir categoria com produtos | `tests/integration/categories.test.ts` |

### Produtos (`app/admin/products/products.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin cria produto válido | `tests/integration/products.test.ts` |
| Admin cria produto sem nome | `tests/integration/products.test.ts` |
| Admin ativa/desativa produto | `tests/integration/products.test.ts` |
| Admin edita produto existente | `tests/integration/products.test.ts` |
| Admin exclui produto | `tests/integration/products.test.ts` |

### Pedidos Admin (`app/admin/orders/orders.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin visualiza lista de pedidos | `tests/integration/orders.test.ts` |
| Admin filtra pedidos por status | `tests/integration/orders.test.ts` |
| Admin confirma pedido | `tests/integration/orders.test.ts` |
| Admin cancela pedido | `tests/integration/orders.test.ts` |
| Admin visualiza detalhes do pedido | `tests/integration/orders.test.ts` |
| Admin tenta confirmar pedido já cancelado | `tests/integration/orders.test.ts` |

### Configurações (`app/admin/settings/settings.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Admin acessa página de configurações e vê dados atuais | `tests/integration/settings.test.ts` |
| Admin edita nome do restaurante com sucesso | `tests/integration/settings.test.ts` |
| Admin edita WhatsApp com formato válido | `tests/integration/settings.test.ts` |
| Admin tenta editar com nome vazio | `tests/integration/settings.test.ts` |
| Admin tenta editar com WhatsApp inválido | `tests/integration/settings.test.ts` |
| Admin copia link do cardápio público | `tests/integration/settings.test.ts` |
| Link do cardápio contém o slug correto | `tests/integration/settings.test.ts` |

### API Pedidos (`app/api/orders/orders.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Criar pedido com dados válidos | `tests/integration/orders-api.test.ts` |
| Criar pedido com dados inválidos | `tests/integration/orders-api.test.ts` |
| Criar pedido para restaurante inexistente | `tests/integration/orders-api.test.ts` |
| Criar pedido sem itens | `tests/integration/orders-api.test.ts` |
| Criar pedido e verificar notificação WhatsApp | `tests/integration/orders-api.test.ts` |

### Cardápio Público (`app/menu/[slug]/menu.feature`)

| Cenário | Teste Correspondente |
|---------|---------------------|
| Cliente acessa cardápio válido | `tests/integration/menu.test.ts` |
| Cliente acessa restaurante inexistente | `tests/integration/menu.test.ts` |
| Cliente visualiza produtos de uma categoria | `tests/integration/menu.test.ts` |
| Cliente adiciona produto ao carrinho | `tests/integration/menu.test.ts` |
| Cliente adiciona múltiplas unidades do mesmo produto | `tests/integration/menu.test.ts` |
| Cliente remove produto do carrinho | `tests/integration/menu.test.ts` |
| Cliente vai para checkout | `tests/integration/menu.test.ts` |

---

## Regras de Implementação

1. **TODO cenário BDD DEVE ter tag `@integration-test`** apontando para o teste que o valida
2. **TODO arquivo `.feature` DEVE estar no nível mais próximo do módulo** que documenta
3. **TODO teste de integração DEVE corresponder a um ou mais cenários BDD** com a mesma tag
4. **A tag `@integration-test` DEVE usar caminho relativo** a partir da raiz do projeto

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de cenários BDD por testes | 100% | Alta |
| Testes passando | 100% | Alta |
| Arquivos .feature com @integration-test | 100% | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| vitest | ^3.0.0 | Framework de testes |
| @supabase/supabase-js | ^2.103.0 | Cliente banco para testes |
| @testing-library/react | ^16.0.0 | Renderização de componentes |

---

## Referências

- [BDD - Gherkin Reference](https://cucumber.io/docs/gherkin/)
- [Vitest Documentation](https://vitest.dev/)
- [AGENTS.md - Tests](../tests/AGENTS.md)
- [Spec: menulink-specification.md](../../.openspec/specs/menulink-specification.md)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
