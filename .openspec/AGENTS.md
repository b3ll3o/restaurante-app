# OpenSpec (.openspec/) - MenuLink

## Visão Geral

O módulo **OpenSpec** contém todas as especificações e artefatos do SDD (Specification-Driven Development) do projeto MenuLink. Este é o módulo de documentação técnica mais importante, servindo como fonte da verdade para todas as decisões de implementação.

**Idioma**: Português Brasileiro (pt-BR)  
**Paradigma**: SDD (Specification-Driven Development)

---

## Estrutura de Diretórios

```
.openspec/
├── specs/ # Especificações ativas (Source of Truth)
│ ├── menulink-specification.md # Regras de negócio (RFC 2119)
│ ├── menulink-technical-plan.md # Plano técnico e arquitetura
│ ├── menulink-quality-rules.md # Regras de qualidade
│ ├── menulink-modules-documentation.md # Documentação de módulos
│ ├── menulink-unit-tests-checklist.md # Checklist de testes unitários
│ └── menulink-acceptance-tests.feature # Cenários BDD (Gherkin)
├── templates/ # Templates OpenSpec
│ ├── prd-template.md # Template de PRD.md
│ ├── design-template.md # Template de design.md
│ └── tasks-template.md # Template de tasks.md
└── changes/ # Mudanças em andamento
└── README.md # Guia de controle de mudanças
```
.openspec/
├── specs/                           # Especificações ativas (Source of Truth)
│   ├── menulink-specification.md    # Regras de negócio (RFC 2119)
│   ├── menulink-technical-plan.md   # Plano técnico e arquitetura
│   ├── menulink-quality-rules.md    # Regras de qualidade
│   ├── menulink-modules-documentation.md # Documentação de módulos
│   ├── menulink-unit-tests-checklist.md # Checklist de testes unitários
│   └── menulink-acceptance-tests.feature # Cenários BDD (Gherkin)
└── changes/                          # Mudanças em andamento
    └── README.md                     # Guia de controle de mudanças
```

---

## Sub-módulo: Specs (`.openspec/specs/`)

### Responsabilidade

Documentar de forma rigorosa todas as especificações do sistema, incluindo regras de negócio, arquitetura, qualidade e testes.

### Arquivos

#### 1. menulink-specification.md

**Descrição**: Especificação principal com regras de negócio em linguagem RFC 2119.

**Formato**: Markdown com seções numeradas

**Conteúdo**:
- Visão geral do produto
- Linguagem ubíqua (DDD)
- Regras de negócio (REQ-XXX)
- Critérios de aceitação (CA-XXX)
- Casos de uso

**Exemplo de Regras**:
```markdown
### 3.1 Gestão de Restaurante

- REQ-001: O sistema **DEVE** permitir que um usuário crie uma conta e registre seu restaurante
- REQ-002: O sistema **DEVE** gerar automaticamente um slug único baseado no nome do restaurante
- REQ-003: O restaurante **DEVE** possuir um número de WhatsApp válido para receber pedidos
- REQ-004: O dono **PODE** atualizar o nome e WhatsApp do seu restaurante
```

**Palavras-chave RFC 2119**:
- **MUST** / **DEVE**: Requisito obrigatório
- **SHOULD** / **DEVERIA**: Requisito recomendado
- **MAY** / **PODE**: Requisito opcional
- **MUST NOT** / **NÃO DEVE**: Proibição

#### 2. menulink-technical-plan.md

**Descrição**: Plano técnico com decisões de arquitetura.

**Conteúdo**:
- Arquitetura do sistema
- Stack tecnológico
- Modelos de dados
- API design
- Autenticação/autorização
- Integrações (WhatsApp, Supabase)

**Formato**: Markdown com diagramas (Mermaid)

#### 3. menulink-quality-rules.md

**Descrição**: Regras de qualidade e métricas do projeto.

**Conteúdo**:
- Cobertura mínima de testes (80%)
- Paradigmas de desenvolvimento (TDD, BDD, ATDD, DDD, SDD)
- Arquitetura multi-tenant
- Gates de qualidade
- Scripts de teste

**Exemplo**:
```markdown
### 1.1 Cobertura de Testes
- **Mínimo 80%** de cobertura de testes unitários
- **100%** dos fluxos críticos devem ter testes E2E
- **Máximo possível** de testes automatizados
```

#### 4. menulink-modules-documentation.md

**Descrição**: Documentação completa de todos os módulos e sub-módulos.

**Conteúdo**:
- Estrutura de diretórios
- Responsabilidades
- Interfaces públicas
- Dependências
- Classes/funções importantes
- Regras de implementação

#### 5. menulink-unit-tests-checklist.md

**Descrição**: Checklist de testes unitários derivados das especificações.

**Formato**: Lista de verificação com Gherkin

**Exemplo**:
```markdown
### 2.1 Adicionar ao Carrinho

- [ ] `addItem(product)` - adicionar produto novo ao carrinho vazio
- [ ] `addItem(product)` - adicionar produto já existente (incrementa quantidade)
- [ ] `addItem(product)` - adicionar produto com quantity específica
```

#### 6. menulink-acceptance-tests.feature

**Descrição**: Cenários de teste BDD em formato Gherkin.

**Formato**: Gherkin (Given-When-Then)

**Localização (REGRA DE PROXIMIDADE)**: Arquivos `.feature` DEVEM estar no nível mais próximo do módulo que documentam.

**Estrutura de Proximidade**:
```
app/admin/orders/
├── page.tsx              ← Rota
├── AGENTS.md             ← Documentação
└── orders.feature        ← Cenários BDD (mesmo nível)

app/admin/
└── orders/
    ├── page.tsx
    ├── AGENTS.md
    └── orders.feature    ← Cenários BDD específicos
```

**Link com Testes de Integração (REGRA)**: TODO cenário BDD DEVE ter tag `@integration-test` apontando para o teste de integração que o valida.

**Exemplo**:
```gherkin
@integration-test="tests/integration/orders.test.ts"
Funcionalidade: Criação de Pedido

Cenário: Cliente cria pedido com dados válidos
Dado que o cliente está na página do cardápio
E adicionou "Pizza Grande" ao carrinho
Quando preenche "Maria Silva" no campo nome
E preenche "5511888888888" no campo WhatsApp
E seleciona "PIX" como forma de pagamento
E clica em "Confirmar Pedido"
Então o pedido deve ser criado com status "pending"
E deve aparecer mensagem de confirmação
```

---

## Sub-módulo: Changes (`.openspec/changes/`)

### Responsabilidade

Controlar mudanças em andamento no projeto.

### Estrutura

```
changes/
├── README.md                    # Guia de controle de mudanças
└── {change-name}/               # Diretório da mudança
    ├── proposal.md              # Proposta da mudança
    ├── spec.md                  # Especificação delta
    ├── design.md                # Design técnico
    ├── tasks.md                 # Lista de tarefas
    └── status.md                # Status da mudança
```

### Fluxo de Mudanças

```
proposal → spec → design → tasks → implementation → verification → archive
```

### Arquivo: README.md

```markdown
# Controle de Mudanças

## Fluxo

1. **proposal**: Proposta inicial da mudança
2. **spec**: Especificação formal em RFC 2119
3. **design**: Design técnico e decisões de arquitetura
4. **tasks**: Lista de tarefas de implementação
5. **implementation**: Código implementado
6. **verification**: Verificação contra spec
7. **archive**: Mudança concluída e arquivada

## Criar Nova Mudança

```bash
mkdir -p .openspec/changes/minha-mudanca
```

## Verificar Status

```bash
cat .openspec/changes/{change-name}/status.md
```
```

---

## SDD Workflow

### 1. Read (Ler)

Antes de implementar, consultar as especificações:

```bash
# Ler especificação principal
cat .openspec/specs/menulink-specification.md

# Ler plano técnico
cat .openspec/specs/menulink-technical-plan.md

# Ler regras de qualidade
cat .openspec/specs/menulink-quality-rules.md
```

### 2. Plan (Planejar)

Verificar se feature existe nas specs:

```bash
# Buscar requisito específico
grep -n "REQ-XXX" .openspec/specs/menulink-specification.md

# Buscar critério de aceitação
grep -n "CA-XXX" .openspec/specs/menulink-specification.md
```

### 3. Implement (Implementar)

Implementar código que cumpra as especificações:

```typescript
// Implementar conforme especificação
// REQ-XXX: O sistema DEVE fazer X
```

### 4. Verify (Verificar)

Garantir que implementação corresponde à spec:

```bash
# Rodar testes
npm run test

# Verificar cobertura
npm run test:coverage

# Verificar lint
npm run lint
```

---

## Versionamento de Specs

### Semantic Versioning

```
v1.0.0
│ │ │
│ │ └── Patch: Correções de bugs
│ └──── Minor: Novas funcionalidades (backwards compatible)
└────── Major: Breaking changes
```

### Changelog

```markdown
# Changelog

## [1.1.0] - 2026-04-15

### Adicionado
- REQ-XXX: Nova funcionalidade de X

### Modificado
- REQ-XXX: Atualizado comportamento de X

## [1.0.0] - 2026-04-14

### Adicionado
- Versão inicial com todas as funcionalidades básicas
```

---

## Revisão de Specs

### Pull Request Review

Ao criar PR, verificar:

- [ ] Spec foi atualizada?
- [ ] Testes foram adicionados?
- [ ] Cobertura ≥80%?
- [ ] Documentação atualizada?
- [ ] Lint passa?

### Spec Review Checklist

- [ ] Regras em linguagem RFC 2119
- [ ] Sem ambiguidades
- [ ] Testável
- [ ] Consistente com outras specs
- [ ] Linguagem ubíqua seguida

---

## Artefatos SDD

### Checklist de Artefatos

| Artefato | Descrição | Status |
|----------|-----------|--------|
| `PRB.md` | Product Requirement Brief (concepção) | ✅/❌ |
| `proposal.md` | Proposta inicial | ✅/❌ |
| `spec.md` | Especificação formal | ✅/❌ |
| `design.md` | Design técnico | ✅/❌ |
| `tasks.md` | Lista de tarefas | ✅/❌ |
| `verification.md` | Relatório de verificação | ✅/❌ |
| `archive.md` | Arquivamento | ✅/❌ |

### Template: PRB.md (Product Requirement Brief)

```markdown
# PRB: [Título da Iniciativa]

**Status:** Rascunho
**Autor:** [Nome/Time]
**Data:** [YYYY-MM-DD]

## 1. Problema / Oportunidade
[Descrição concisa do problema ou oportunidade]

## 2. Público-Alvo Impactado
[Quem será afetado pela mudança?]

## 3. Resultado Esperado (Alto Nível)
[O que se espera alcançar]

## 4. Critérios de Sucesso Preliminares
- [ ] Critério 1
- [ ] Critério 2

## 5. Análise Inicial
### Viabilidade Técnica
- [ ] Viável com arquitetura atual?
- [ ] Módulos afetados?

## 6. Urgência
- [ ] Crítica / [ ] Alta / [ ] Média / [ ] Baixa
```

### Template: proposal.md

```markdown
# Proposta: [Nome da Mudança]

## Problema
[Descrição do problema que esta mudança resolve]

## Solução Proposta
[Descrição da solução]

## Impacto
- [ ] Breaking changes?
- [ ] Migração necessária?
- [ ] Novos dependencies?

## Alternativas Consideradas
[Outras soluções consideradas e por que foram descartadas]

## Urgência
- [ ] Crítica
- [ ] Alta
- [ ] Média
- [ ] Baixa

## Status
Proposta
```

### Template: spec.md

```markdown
# Spec: [Nome da Mudança]

## Fonte da Verdade
Este documento é parte das especificações do MenuLink.

## Requisitos

### REQ-XXX: [Título do Requisito]
[Descrição em RFC 2119]

### REQ-XXX: [Título do Requisito]
[Descrição em RFC 2119]

## Critérios de Aceitação

### CA-XXX: [Título do Critério]
[Condição verificável]

## Casos de Uso

### CU-XXX: [Título do Caso de Uso]
**Ator**: [Quem executa]
**Pré-condições**: [O que deve ser verdade antes]
**Fluxo**:
1. [Passo 1]
2. [Passo 2]
**Pós-condições**: [O que é verdade depois]

## Dependências
- [Lista de requisitos dependentes]

## Restrições
- [Lista de restrições]

## Status
Especificação
```

### Template: tasks.md

```markdown
# Tasks: [Nome da Mudança]

## Pré-condições
- [ ] Spec aprovada
- [ ] Design aprovado

## Tarefas

### Fase 1: Infraestrutura
- [ ] Task 1.1
- [ ] Task 1.2

### Fase 2: Backend
- [ ] Task 2.1
- [ ] Task 2.2

### Fase 3: Frontend
- [ ] Task 3.1
- [ ] Task 3.2

### Fase 4: Testes
- [ ] Task 4.1
- [ ] Task 4.2

### Fase 5: Documentação
- [ ] Task 5.1
- [ ] Task 5.2

## Progresso
████████░░ 80%

## Status
Em Andamento
```

---

## Linguagem Ubíqua

### Termos de Domínio

| Termo | Definição | Sinonimos |
|-------|-----------|-----------|
| Restaurant | Estabelecimento comercial com cardápio digital | Loja, Restaurante |
| Owner | Proprietário do restaurante | Dono, Administrador |
| Customer | Cliente final que faz pedidos | Consumidor, Pedinte |
| Category | Agrupamento de produtos | Seção, Grupo |
| Product | Item vendido | Prato, Item |
| Order | Pedido realizado | Comanda, Pedido |
| OrderItem | Item dentro de um pedido | Linha do pedido |
| Cart | Lista temporária de produtos | Carrinho, Cesta |
| CartItem | Produto no carrinho | Item do carrinho |
| Slug | Identificador URL único | URL amigável |
| Status | Estado do pedido | Situação |

### Termos Técnicos

| Termo | Definição |
|-------|-----------|
| Tenant | Instância isolada de restaurante |
| Multi-tenant | Arquitetura com múltiplos tenants |
| RLS | Row Level Security (Segurança por linha) |
| SSR | Server Side Rendering |
| RSC | React Server Components |

---

## Métricas de Documentação

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Specs atualizadas | 100% | Crítica |
| Requisitos testáveis | 100% | Alta |
| Cobertura de checklist | 100% | Alta |
| Consistência entre docs | 100% | Alta |

---

## Processos

### 1. Criar Nova Especificação

1. Criar branch: `spec/nova-funcionalidade`
2. Criar spec em `.openspec/specs/`
3. Adicionar requisitos em RFC 2119
4. Adicionar critérios de aceitação
5. Criar PR e revisar
6. Merge na main

### 2. Atualizar Especificação Existente

1. Criar branch: `spec/update-xxx`
2. Modificar spec com tracking de mudanças
3. Atualizar versão no header
4. Verificar dependências
5. Criar PR e revisar
6. Merge na main

### 3. Verificar Implementação

1. Ler spec
2. Implementar código
3. Criar testes unitários
4. Criar testes de integração
5. Criar testes E2E
6. Verificar cobertura ≥80%
7. Verificar lint
8. Verificar build

---

## Referências

- [RFC 2119](https://tools.ietf.org/html/rfc2119)
- [Gherkin](https://cucumber.io/docs/gherkin/)
- [Specification by Example](https://gojko.net/books/specification-by-example/)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent