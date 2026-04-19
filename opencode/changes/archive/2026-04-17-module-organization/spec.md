# Spec: module-organization

## Fonte da Verdade
Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-001: AGENTS.md no Nível do Código
Todo módulo (diretorio com código) DEVE ter um arquivo AGENTS.md no mesmo nível hierárquico, documentando o módulo que ele representa.

#### Cenário: Módulo app/admin/login
- **GIVEN** o módulo `app/admin/login/` contém `page.tsx`
- **WHEN** o módulo é analisado
- **THEN** DEVE existir `app/admin/login/AGENTS.md` no mesmo nível

#### Cenário: Módulo components/ui
- **GIVEN** o módulo `components/ui/` contém componentes shadcn/ui
- **WHEN** o módulo é analisado
- **THEN** DEVE existir `components/ui/AGENTS.md` no mesmo nível

### REQ-002: Arquivos .feature no Nível do Módulo
Todo módulo que possui cenários BDD DEVE ter o arquivo `.feature` no mesmo nível hierárquico do código que documenta.

#### Cenário: Módulo app/admin/orders com BDD
- **GIVEN** o módulo `app/admin/orders/` possui lógica de pedidos
- **WHEN** existem cenários BDD para pedidos
- **THEN** DEVE existir `app/admin/orders/orders.feature` no mesmo nível

### REQ-003: AGENTS.md e .feature Juntos
Quando um módulo possui tanto AGENTS.md quanto cenários BDD, ambos os arquivos DEVEM estar no mesmo nível, um ao lado do outro.

#### Cenário: Módulo com ambos os artefatos
- **GIVEN** o módulo `app/admin/products/` tem lógica de produtos
- **WHEN** existem cenários BDD e documentação AGENTS.md
- **THEN** `products.feature` e `AGENTS.md` DEVEM estar em `app/admin/products/`

## Critérios de Aceitação

### CA-001: Completude de AGENTS.md
- [ ] 100% dos módulos possuem AGENTS.md no nível correto
- [ ] AGENTS.md contém: visão geral, estrutura, interface pública, regras de implementação

### CA-002: Completude de .feature
- [ ] Todos os módulos com lógica de negócio possuem .feature no nível correto
- [ ] Cenários seguem formato Given-When-Then

### CA-003: Co-localização
- [ ] Quando AGENTS.md e .feature existem no mesmo módulo, estão no mesmo diretório

### CA-004: Integridade de Referências
- [ ] Referências em AGENTS.md para submódulos estão corretas
- [ ] Tags @integration-test em .feature apontam para testes existentes

## Status
Especificação