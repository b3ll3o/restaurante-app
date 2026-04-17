# PRD: general-review - Revisão Geral e Limpeza do Projeto

**Status:** Rascunho
**Autor:** AI Agent
**Data:** 2026-04-17

---

## 1. Problema / Oportunidade

O projeto MenuLink cresceu significativamente com múltiplas changes de documentação, refatoração e otimização. No entanto, essa evolução rápida deixou o projeto com several issues que precisam ser resolvidos:

1. **Duplicações e Redundâncias**: AGENTS.md com conteúdo repetido em diferentes níveis de diretório
2. **Inconsistências de Padrões**: Cada AGENTS.md segue um template ligeiramente diferente
3. **Documentação Desatualizada**: Algumas documentações referência arquivos/pastas que não existem mais (ex: `lib/supabase/client.ts` vs `lib/supabase/client/index.ts`)
4. **Testes Incompletos**: Cenários de teste BDD existem mas testes de integração E unitários não cobrem tudo
5. **Dificuldade de Manutenção**: Tanto humanos quanto IAs têm dificuldade de navegar na documentação

### Sintomas Observados

1. Há 3_AGENTS.md duplicados em `tests/` com estrutura inconsistente
2. `lib/AGENTS.md` menciona estrutura antiga (`client.ts`, `server.ts`) vs nova (`client/index.ts`, `server/index.ts`)
3. Alguns módulos têm AGENTS.md no nível errado
4. Testes unitários têm cobertura abaixo do target em algumas áreas

---

## 2. Público-Alvo Impactado

- Desenvolvedores (humanos) mantendo o projeto
- Agentes de IA executando tasks no projeto
- Novos contribuidores tentando entender a estrutura

---

## 3. Resultado Esperado (Alto Nível)

1. **Documentação Consistente**: Todos os AGENTS.md seguem o mesmo template padrão
2. **Zero Redundâncias**: Conteúdo não se repete entre AGENTS.md de diferentes níveis
3. **Padrões Definidos**: Templates de código, teste e documentação claramente documentados
4. **Testes Completos**: Cobertura ≥80% em todos os módulos com testes significativos
5. **Navegação Clara**: Tanto humanos quanto IAs podem facilmente encontrar a informação correta

---

## 4. Critérios de Sucesso Preliminares

### Documentação
- [ ] AGENTS.md raiz do projeto serve como índice central
- [ ] Cada submódulo tem AGENTS.md no nível correto (princípio da proximidade)
- [ ] Conteúdo não se repete entre níveis de AGENTS.md
- [ ] Templates padrão definidos e aplicados

### Padrões
- [ ] Template de AGENTS.md criado e aplicado
- [ ] Template de componente React definido
- [ ] Template de teste unitário definido
- [ ] Template de teste E2E definido

### Testes
- [ ] Cobertura unitária ≥80% em lib/utils
- [ ] Cobertura unitária ≥80% em context/cart-context
- [ ] Cobertura unitária ≥80% em lib/whatsapp
- [ ] Cenários BDD com @integration-test para 100% dos fluxos críticos
- [ ] Testes E2E para todos os fluxos críticos

### Qualidade
- [ ] Build passa sem erros
- [ ] Lint passa sem warnings
- [ ] Sem imports quebrados (Aliases verificados)

---

## 5. Análise Inicial

### 5.1 Estrutura Atual do Projeto

```
/home/leo/projetos/restaurante/
├── app/                      # Rotas Next.js
│   ├── admin/               # Painel admin
│   ├── menu/[slug]/          # Cardápio público
│   ├── api/                  # API routes
│   └── AGENTS.md            # ✅ Documenta app/
├── components/              # Componentes React
│   ├── ui/                  # shadcn/ui
│   ├── admin/               # Componentes admin
│   └── AGENTS.md            # ✅ Documenta components/
├── lib/                     # Utilitários e serviços
│   ├── utils.ts             # Funções utilitárias
│   ├── whatsapp.ts          # Serviço WhatsApp
│   ├── supabase/            # Clientes Supabase
│   │   ├── client/index.ts  # Cliente browser
│   │   └── server/index.ts  # Cliente server
│   └── AGENTS.md           # ⚠️ Refere estrutura antiga
├── context/                  # Contextos React
│   ├── cart-context/        # Contexto do carrinho
│   └── AGENTS.md           # ✅ Documenta context/
├── types/                   # Definições TypeScript
│   ├── index.ts             # Tipos centrais
│   ├── cart/                # Tipos de carrinho
│   ├── order/               # Tipos de pedido
│   ├── product/              # Tipos de produto
│   ├── category/             # Tipos de categoria
│   └── AGENTS.md           # ✅ Documenta types/
├── hooks/                   # Custom hooks
│   └── AGENTS.md           # ✅ Documenta hooks/
├── tests/                   # Testes automatizados
│   ├── unit/                # Testes unitários
│   ├── integration/          # Testes de integração
│   ├── e2e/                 # Testes E2E (Playwright)
│   └── AGENTS.md           # ⚠️ 3_AGENTS.md duplicados
└── .openspec/               # Especificações SDD
```

### 5.2 Issues Identificados

| # | Issue | Severidade | Módulo |
|---|-------|------------|--------|
| 1 | `lib/AGENTS.md` menciona `client.ts` e `server.ts` mas agora são `client/index.ts` e `server/index.ts` | Alta | lib/ |
| 2 | 3_AGENTS.md duplicados em `tests/` com estrutura inconsistente | Alta | tests/ |
| 3 | `tests/AGENTS.md` contém 3 estruturas diferentes do mesmo diretório | Alta | tests/ |
| 4 | Falta `lib/domain/AGENTS.md` para justificar a criação desse diretório | Média | lib/ |
| 5 | Alguns submódulos não têm AGENTS.md próprio (ex: hooks/) | Média | hooks/ |
| 6 | Testes unitários de `cart-context` não existem mas são referenciados | Alta | context/ |
| 7 | Falta validação de request para API de orders | Alta | app/api/ |
| 8 | `app/menu/[slug]/checkout/` tem AGENTS.md mas a página é `page.tsx` na mesma pasta | Baixa | app/menu/ |

### 5.3 Análise de Cobertura de Testes

| Módulo | Cobertura Atual | Target | Gap |
|--------|----------------|--------|-----|
| lib/utils.ts | ~90% | 80% | ✅ OK |
| lib/whatsapp.ts | ~70% | 80% | ⚠️ Falta ~10% |
| context/cart-context | 0% | 80% | ❌ Falta 80% |
| app/api/orders/route.ts | 0% | 80% | ❌ Falta 80% |

---

## 6. Urgência

- [x] Crítica
- [ ] Alta
- [ ] Média
- [ ] Baixa

**Justificativa**: O projeto está difícil de manter com as inconsistências atuais. Bugs podem emergir de documentação desatualizada. A produtividade de desenvolvimento está comprometida.

---

## 7. Plano de Execução

### Fase 1: Análise e Diagnóstico (Dia 1)

#### 1.1: Mapear todos os AGENTS.md e identificar duplicações
```bash
find . -name "AGENTS.md" -type f | sort
grep -r "client.ts\|server.ts" --include="*.md" .
```

#### 1.2: Analisar estrutura de testes atual
```bash
ls -la tests/unit/
ls -la tests/integration/
ls -la tests/e2e/
```

#### 1.3: Verificar consistência de imports
```bash
grep -r "from '@/lib/supabase" --include="*.ts" --include="*.tsx" .
```

### Fase 2: Padronização de Templates (Dia 1-2)

#### 2.1: Criar template padrão de AGENTS.md
```
template-agents.md
├── 1. Visão Geral (modulo, responsabilidade)
├── 2. Estrutura de Diretórios
├── 3. Interface Pública (exports)
├── 4. Arquitetura (código exemplar)
├── 5. Regras de Implementação
├── 6. Métricas de Qualidade
├── 7. Dependências
└── 8. Referências
```

#### 2.2: Criar template de componente React
```
template-component.tsx
├── Props interface
├── Default exports
├── JSDoc comments
└── Test file
```

#### 2.3: Criar template de teste
```
template.test.ts
├── describe por função/método
├── it com Given-When-Then em português
└── Cobertura de edge cases
```

### Fase 3: Correção de Issues (Dia 2-3)

#### 3.1: Corrigir lib/AGENTS.md
- Atualizar referências de `client.ts` → `client/index.ts`
- Atualizar referências de `server.ts` → `server/index.ts`

#### 3.2: Unificar tests/AGENTS.md
- Remover duplicações
- Manter apenas a estrutura correta

#### 3.3: Criar testes faltantes
- cart-context.test.tsx
- whatsapp.test.ts (completar)
- API route tests

### Fase 4: Verificação Final (Dia 3)

#### 4.1: Run build
```bash
npm run build
```

#### 4.2: Run lint
```bash
npm run lint
```

#### 4.3: Run tests
```bash
npm run test:unit -- --coverage
npm run test:e2e
```

---

## 8. Escopo Detalhado

### 8.1 In

- Análise e correção de todos os AGENTS.md
- Criação de templates padrão
- Correção de imports desatualizados
- Criação de testes unitários faltantes
- Verificação de cobertura de testes
- Consolidação da documentação de testes

### 8.2 Out

- NÃO criar novas funcionalidades
- NÃO alterar lógica de negócio
- NÃO alterar APIs públicas
- NÃO modificar código de produção sem necessidade de correção de bug

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking de imports durante correção | Média | Alto | Verificar todos os imports antes de mudar |
| Perda de informação durante consolidação de AGENTS.md | Baixa | Alto | Fazer backup antes de modificar |
| Testes quebrando durante aumento de cobertura | Média | Médio | Run testes frequentemente |

---

## 10. Dependências

- Vitest (já instalado)
- Playwright (já instalado)
- Testing Library (já instalado)

---

## 11. Resources Estimados

| Tarefa | Tempo Estimado |
|--------|----------------|
| Análise e diagnóstico | 2 horas |
| Padronização de templates | 3 horas |
| Correção de issues | 4 horas |
| Criação de testes | 4 horas |
| Verificação final | 2 horas |
| **Total** | **15 horas** |

---

## 12. Alternativas Consideradas

### Manter como está (Descartada)
- Issue piora com tempo
- Produtividade continua degradando

### Reescrever tudo do zero (Descartada)
- Risco muito alto
- Perde histórico de decisões
- Tempo excessivo

### Incremental + Templates (Escolhida)
- Resolve issues existentes
- Estabelece padrões para futuro
- Risco controlado

---

## 13. Métricas de Sucesso Final

| Métrica | Antes | Depois | Target |
|---------|-------|--------|--------|
| AGENTS.md duplicados | 3+ | 0 | 0 |
| Cobertura unitária lib/whatsapp | ~70% | 80%+ | ≥80% |
| Cobertura unitária cart-context | 0% | 80%+ | ≥80% |
| Inconsistências de imports | 5+ | 0 | 0 |
| Templates documentados | 0 | 4 | 4 |

---

## 14. Plano de Risco de Rollback

1. Se AGENTS.md ficar corrompido: `git checkout` do último commit válido
2. Se testes falharem: commits incrementais com testes passando
3. Se build quebrar: não fazer push até resolver

---

**Próximos Passos**:
1. [ ] Aprovar este PRD
2. [ ] Criar proposal.md formal
3. [ ] Executar plano em fases
4. [ ] Verificar e commit
