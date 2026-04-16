# Spec: Estratégia de Automação de Testes Full-Stack

## Fonte da Verdade

Este documento é parte das especificações do MenuLink, derivado do PRD.md.

## Requisitos

### REQ-TEST-001: Stack de Testes

O sistema **DEVE** utilizar as seguintes ferramentas (existentes):
- **Jest** para testes unitários e integração
- **Playwright** para testes E2E
- **React Testing Library** para testes de componentes
- **MSW** para mock de APIs (se necessário)

### REQ-TEST-002: Metas de Cobertura

O sistema **DEVE** atingir:
- **80%+** de cobertura em lógica de negócio (core domain)
- **100%** de cobertura em fluxos críticos (E2E)
- Cobertura de 100% das páginas principais

### REQ-TEST-003: Testes Unitários (Jest)

O sistema **DEVE** incluir testes unitários para:
- Funções em `lib/utils.ts` (cn, formatPrice, generateSlug, isValidWhatsApp, isValidPrice, isValidName)
- Funções em `lib/whatsapp.ts` (sendWhatsAppMessage, formatOrderMessage, generateWhatsAppUrl)
- Contextos React (CartContext)
- Validações de domínio

### REQ-TEST-004: Testes de Integração

O sistema **DEVE** incluir testes de integração para:
- API Routes (POST /api/orders)
- CRUD de categorias (via API simulada)
- CRUD de produtos (via API simulada)

### REQ-TEST-005: Testes E2E (Playwright)

O sistema **DEVE** incluir testes E2E para:
- Fluxo de cadastro/login
- CRUD de categorias no admin
- CRUD de produtos no admin
- Checkout completo (cardápio → pedido)
- Gestão de pedidos (confirmar/cancelar)

### REQ-TEST-006: CI/CD

O sistema **DEVE** ter pipeline GitHub Actions que execute:
- Lint
- Testes unitários
- Testes de integração
- Testes E2E

## Critérios de Aceitação

### CA-TEST-001: Infraestrutura de Testes

- [ ] Jest configurado e funcionando
- [ ] Playwright configurado e funcionando
- [ ] Scripts npm atualizados (test, test:unit, test:integration, test:e2e, test:coverage)

### CA-TEST-002: Testes Unitários

- [ ] `tests/unit/lib/utils.test.ts` - testes para cn, formatPrice, generateSlug, isValidWhatsApp, isValidPrice, isValidName
- [ ] `tests/unit/lib/whatsapp.test.ts` - testes para sendWhatsAppMessage, formatOrderMessage, generateWhatsAppUrl
- [ ] `tests/unit/context/cart-context.test.tsx` - testes para CartContext

### CA-TEST-003: Testes de Integração

- [ ] `tests/integration/api/orders.test.ts` - teste da API de pedidos

### CA-TEST-004: Testes E2E

- [ ] `tests/e2e/admin/signup.spec.ts` - fluxo de cadastro
- [ ] `tests/e2e/admin/login.spec.ts` - fluxo de login
- [ ] `tests/e2e/admin/categories.spec.ts` - CRUD categorias
- [ ] `tests/e2e/admin/products.spec.ts` - CRUD produtos
- [ ] `tests/e2e/public/checkout.spec.ts` - checkout completo
- [ ] `tests/e2e/admin/orders.spec.ts` - gestão de pedidos

### CA-TEST-005: Pipeline CI

- [ ] GitHub Actions configurado
- [ ] Todos os testes executam no PR
- [ ] Coverage report gerado

## Dependências Necessárias

| Pacote | Versão Atual | Versão Necessária | Motivo |
|--------|--------------|-------------------|--------|
| @testing-library/react | 15.0.7 | ^16.0.0 (quando disponível) ou manter 15.x | Conflito com React 19 |
| jest | 29.7.0 | Manter | Já funciona |
| @playwright/test | 1.59.1 | Manter | Já funciona |
| msw | Não instalado | ^2.3.0 | Mock de APIs |

## Restrições

- Testes **NÃO DEVEM** depender de banco de dados real
- Testes **DEVEM** ser determinísticos (mesmo resultado sempre)
- Testes E2E **DEVEM** usar Page Objects

## Status

Especificação