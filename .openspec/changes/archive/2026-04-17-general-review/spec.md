# Spec: general-review - Revisão Geral e Limpeza do Projeto

## Fonte da Verdade

Este documento é parte das especificações do MenuLink.

## Problema

O projeto MenuLink apresenta issues de documentação e qualidade que comprometem manutenibilidade:
1. **Duplicações**: 3+ AGENTS.md duplicados em `tests/`
2. **Inconsistências**: `lib/AGENTS.md` referencia estrutura antiga vs atual
3. **Cobertura insuficiente**: cart-context 0%, whatsapp ~70%
4. **Templates ausentes**: Falta padronização

---

## Requisitos

### REQ-GR-01: Padronização de AGENTS.md

O sistema **DEVE** ter todos os AGENTS.md seguindo template padrão com:
- Visão Geral (módulo, responsabilidade)
- Estrutura de Diretórios
- Interface Pública
- Arquitetura (código exemplar)
- Regras de Implementação
- Métricas de Qualidade
- Dependências
- Referências

### REQ-GR-02: Correção de Inconsistências

O sistema **DEVE** corrigir todas as referências desatualizadas:
- `lib/supabase/client.ts` → `lib/supabase/client/index.ts`
- `lib/supabase/server.ts` → `lib/supabase/server/index.ts`

### REQ-GR-03: Unificação de Documentação

O sistema **DEVE** remover duplicações em `tests/`:
- Consolidar 3_AGENTS.md duplicados em um único
- Garantir consistência de estrutura

### REQ-GR-04: Cobertura de Testes

O sistema **DEVE** atingir cobertura ≥80% em:
- `lib/utils.ts` (manter ~90%)
- `lib/whatsapp.ts` (70% → 80%+)
- `context/cart-context` (0% → 80%+)

### REQ-GR-05: Templates Documentados

O sistema **DEVE** ter templates documentados para:
- AGENTS.md (template padrão)
- Componente React (template de código)
- Teste unitário (template de teste)
- Teste E2E (template Playwright)

---

## Critérios de Aceitação

### CA-GR-01: Build Passa

- [ ] `npm run build` completa sem erros
- [ ] Nenhum warning de lint

### CA-GR-02: AGENTS.md Consistente

- [ ] Zero duplicações em `tests/`
- [ ] Zero referências a arquivos antigos (`client.ts`, `server.ts`)

### CA-GR-03: Cobertura Atingida

- [ ] Cobertura lib/whatsapp ≥80%
- [ ] Cobertura context/cart-context ≥80%

### CA-GR-04: Templates Existentes

- [ ] Template AGENTS.md criado em `.openspec/templates/`
- [ ] Template componente documentado
- [ ] Template teste documentado

---

## Casos de Uso

### CU-GR-01: Corrigir lib/AGENTS.md

**Ator**: Desenvolvedor
**Pré-condições**: Arquivo `lib/AGENTS.md` com referências desatualizadas
**Fluxo**:
1. Identificar referências incorretas
2. Substituir `client.ts` por `client/index.ts`
3. Substituir `server.ts` por `server/index.ts`
4. Verificar que imports continuam funcionando
**Pós-condições**: `lib/AGENTS.md` correto

### CU-GR-02: Unificar tests/AGENTS.md

**Ator**: Desenvolvedor
**Pré-condições**: 3_AGENTS.md duplicados em `tests/`
**Fluxo**:
1. Identificar conteúdo único em cada AGENTS.md
2. Consolidar conteúdo em único arquivo
3. Remover duplicações
4. Verificar que não há perda de informação
**Pós-condições**: Um único `tests/AGENTS.md` consolidado

### CU-GR-03: Criar testes cart-context

**Ator**: Desenvolvedor
**Pré-condições**: `context/cart-context.tsx` sem testes
**Fluxo**:
1. Criar `tests/unit/context/cart-context.test.tsx`
2. Testar `addItem` (adicionar novo, incrementar existente)
3. Testar `removeItem` (remover quantidade, remover completo)
4. Testar `updateQuantity`
5. Testar `clearCart`
6. Testar isolamento por restaurantId
**Pós-condições**: Cobertura ≥80%

---

## Dependências

- Vitest (já instalado)
- Playwright (já instalado)
- Testing Library (já instalado)

## Restrições

- Não criar novas funcionalidades
- Não alterar lógica de negócio
- Não modificar APIs públicas
- Não alterar código de produção desnecessariamente

## Status

Especificação
