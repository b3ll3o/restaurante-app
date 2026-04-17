# PRD: 007 - CSS Mobile-First Responsiveness Fix

**ID:** 007-2026-04-17-mobile-css-fix
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Garantir que 100% das páginas funcionam em mobile
- **Objetivo 2:** Aplicar regra Mobile-First em todas as páginas
- **Objetivo 3:** Melhorar experiência do usuário em dispositivos móveis

---

## 1. Problema

### 1.1 Descrição do Problema

A aplicação MenuLink viola a regra Mobile-First (Seção 5 de `menulink-rules.md`) em várias páginas:

**Sintomas:**
- Tabelas sem scroll horizontal em mobile
- Texto muito pequeno em telas pequenas
- Botões não touch-friendly (menor que 44x44px)
- Layout quebrado em viewport < 640px
- Formulários não adaptados para mobile

### 1.2 Contexto

**Regra existente em `menulink-rules.md` (Seção 5):**

> "Responsivo: Layout responsivo obrigatório em todas as páginas"
> "Touch-Friendly: Elementos com mínimo 44x44px de área de toque"

**Páginas com problemas identificados:**

| Página | Problema | Severidade |
|--------|----------|------------|
| `/admin/dashboard` | Tabela de pedidos não tem scroll | Alta |
| `/admin/orders` | Tabela extensa não quebra em mobile | Alta |
| `/admin/products` | Grid de produtos não responsivo | Alta |
| `/admin/categories` | Lista de categorias não adaptável | Média |
| `/admin/settings` | Formulário não touch-friendly | Média |
| `/admin/login` | Inputs muito pequenos | Média |
| `/admin/signup` | Layout não otimizado para mobile | Média |
| `/menu/[slug]` | Carrinho Sheet pode não funcionar bem | Baixa |
| `/` (landing) | Seções podem não quebrar bem | Baixa |

### 1.3 Evidências

- [Evidência 1: Seção 5.1 de menulink-rules.md define Mobile-First como regra obrigatória]
- [Evidência 2: Admin pages usam Table sem overflow-x-auto]
- [Evidência 3: Breakpoints não são respeitados em vários componentes]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Corrigir CSS de todas as páginas admin e pública para:
1. Adicionar `overflow-x-auto` em tabelas
2. Usar classes responsivas do Tailwind (`sm:`, `md:`, `lg:`)
3. Garantir touch targets ≥ 44x44px
4. Ajustar fonte para mobile (base: 16px)

### 2.2 Benefícios Esperados

| Benefício | Antes | Depois |
|-----------|-------|--------|
| Mobile usability | Páginas quebradas | 100% funcionais |
| Touch targets | < 44px | ≥ 44px |
| Tabelas em mobile | Quebrado | Com scroll |
| CLS (Layout Shift) | > 0.1 | < 0.1 |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Owner em mobile:** Usa celular para gerenciar pedidos
  - **Necessidades:** Interface funcional em tela pequena
  - **Dores:** Não consegue ver tabela de pedidos no celular

- **Customer em mobile:** Faz pedido pelo celular
  - **Necessidades:** Carrinho e checkout funcionais em mobile
  - **Dores:** Botões pequenos, texto ilegível

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto |
|-------------|---------|
| Owners | Melhor gestão mobile |
| Customers | Melhor experiência de pedido |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Admin Dashboard** (`/admin/dashboard`)
   - Tabela de pedidos com `overflow-x-auto`
   - Cards empilhados em mobile, grid em desktop

2. **Admin Orders** (`/admin/orders`)
   - Tabela com scroll horizontal
   - Badges de status adaptáveis

3. **Admin Products** (`/admin/products`)
   - Grid responsivo: 1 coluna mobile, 2 tablet, 3 desktop
   - Cards de produto touch-friendly

4. **Admin Categories** (`/admin/categories`)
   - Lista com item-height adequado
   - Botões de ação visíveis em mobile

5. **Admin Settings** (`/admin/settings`)
   - Formulário com inputs maiores (min 44px height)
   - Labels acima dos inputs

6. **Admin Login/Signup** (`/admin/login`, `/admin/signup`)
   - Card centralizado e responsivo
   - Inputs com fonte ≥ 16px (evita zoom iOS)

7. **Menu Page** (`/menu/[slug]`)
   - Carrinho Sheet funcional em mobile
   - Botão de checkout fixo no bottom

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** Todas as tabelas admin têm `overflow-x-auto`
- [ ] **CA-02:** Touch targets ≥ 44x44px em todos os botões
- [ ] **CA-03:** Inputs com min-height 44px
- [ ] **CA-04:** Fonte base 16px para inputs (evita zoom iOS)
- [ ] **CA-05:** Layout funciona em viewport 375px (iPhone)
- [ ] **CA-06:** Build passa (npm run build)
- [ ] **CA-07:** Lint passa sem novos errors
- [ ] **CA-08:** Testes passam

### 4.3 fora do Escopo

**NÃO está Included:**
- Criar versão PWA/App nativa
- Otimização de imagens para mobile
- Lazy loading de componentes
- Service Worker enhancements

**Explicitamente fora:**
- Landing pages segmentadas (outro PRD)

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Usar componente de tabela responsivo (shadcn/ui Table com scroll)

**Descrição:** Substituir tabelas HTML por componente shadcn com scroll nativo.

**Prós:**
- Componente já testado
- Suporte mobile integrado

**Contras:**
- shadcn Table pode não estar instalado
- Alteração mais invasiva

**Por que foi descartada:** Solução CSS (overflow-x-auto) é mais simples e menos invasiva.

### 5.2 Alternativa B: Mobile-first CSS rewrite completo

**Descrição:** Reescrever todo CSS seguindo estritamente mobile-first.

**Prós:**
- Consistente从头
- Tech debt reduzido

**Contras:**
- Muito tempo
- Alto risco de breaking changes

**Por que foi descartada:** Overkill. Melhor focar em correções específicas.

### 5.3 Alternativa Escolhida

**Justificativa:** Correções CSS pontuais usando Tailwind. Menor risco, menor esforço, resultado rápido.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Impacto | Decisão |
|-----------|---------|---------|
| Tempo de correção | ~8h estimado | Correções pontuais |
| Risco de breaking | Baixo | Testar em mobile real |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking em desktop | Baixa | Médio | Testar em ambos |
| CLS aumentado | Baixa | Médio | Verificar after |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - apenas CSS Tailwind
- [x] Módulos/Serviços afetados? **Componentes admin**
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Possível** - se修改 afectar layout
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

### 7.3 Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `app/admin/dashboard/page.tsx` | Tabela com overflow-x-auto |
| `app/admin/orders/page.tsx` | Tabela responsiva, scroll horizontal |
| `app/admin/products/page.tsx` | Grid responsivo, cards |
| `app/admin/categories/page.tsx` | Lista touch-friendly |
| `app/admin/settings/page.tsx` | Formulário mobile-friendly |
| `app/admin/login/page.tsx` | Card responsivo, inputs 44px |
| `app/admin/signup/page.tsx` | Card responsivo, inputs 44px |
| `app/menu/[slug]/page.tsx` | Carrinho Sheet responsivo |
| `app/globals.css` | Se necessário, variables globais |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | | | 8h | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 8 | 0.3 | 2.4 |
| Urgency (1-10) | 7 | 0.25 | 1.75 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 4 | 0.25 | 1.0 |
| **TOTAL** | | | **5.35** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: Qual breakpoint mínimo para testes?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** iPhone SE (375px) como referência mobile mínima.

#### Q2: Os botões de ação nas tabelas são suficientemente grandes?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Verificar se Action buttons têm min-width/min-height 44px.

#### Q3: O Sheet do carrinho funciona bem em mobile?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Sheet deve abrir full-screen ou pelo menos 90% da tela em mobile.

### 9.2 Resumo do Interview

- Testar em iPhone SE (375px)
- Botões de ação devem ter 44px mínimo
- Sheet do carrinho deve ser otimizado para mobile

---

## 10. Checklist de Correções

### 10.1 Tabelas (Admin)

```tsx
// ❌ ERRADO - tabela sem scroll
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>...</TableBody>
</Table>

// ✅ CORRETO - overflow-x-auto no container
<div className="overflow-x-auto">
  <Table>
    <TableHeader>...</TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>
```

### 10.2 Touch Targets (WCAG AAA)

```tsx
// ❌ ERRADO - botão menor que 44px
<Button className="px-2 py-1">Editar</Button>

// ✅ CORRETO - min-h-[44px] min-w-[44px]
<Button className="min-h-[44px] min-w-[44px] px-4 py-2">Editar</Button>

// ✅ CORRETO - usando classes do Tailwind (11 = 44px no Tailwind)
<Button className="h-11 w-11"> {/* 44x44px */}
  <EditIcon />
</Button>
```

### 10.3 Inputs Mobile (Previne Zoom iOS)

```tsx
// ❌ ERRADO - text-sm (14px) causa zoom em iOS
<input className="text-sm h-10" />

// ✅ CORRETO - text-base (16px) mínimo
<input className="text-base h-11 min-h-[44px]" />

// ✅ CORRETO - height 44px+
<input className="h-11 px-4 text-base" />
```

### 10.4 Grid Responsivo (Mobile-First)

```tsx
// ❌ ERRADO - desktop-first (grid-cols-3 por padrão)
<div className="grid grid-cols-3">

// ✅ CORRETO - mobile-first (base = 1 coluna)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

// ✅ CORRETO - auto-fit responsivo (sem breakpoints manuais!)
<div className="grid grid-cols-auto-fit minmax-280px-1fr">
```

### 10.5 Tipografia Fluid com clamp()

```tsx
// ✅ CORRETO - heading responsivo
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// ✅ OU - fluid typography com clamp() em globals.css
// h1 { font-size: clamp(1.875rem, 1.5rem + 2vw, 3rem); }
```

### 10.6 Container Queries (para componentes reutilizáveis)

```tsx
// ✅ CORRETO - container query para card reutilizável
<div className="container-type-inline-size">
  <div className="card">
    {/* Card responde ao container, não ao viewport */}
  </div>
</div>

// Definição do container:
<style jsx>{`
  .card-wrapper { container-type: inline-size; }
`}</style>
```

---

## 11. Testes Mobile-First

### 11.1 Cenários de Teste

| Cenário | Dispositivo | Viewport | Resultado Esperado |
|---------|--------------|----------|-------------------|
| Admin Dashboard | iPhone SE | 375px | Tabela com scroll |
| Admin Orders | iPhone 14 | 390px | Cards adaptáveis |
| Admin Login | Pixel 7 | 412px | Inputs touch-friendly |
| Menu Page | iPhone SE | 375px | Carrinho funcional |

### 11.2 Ferramentas de Teste

- Chrome DevTools Device Mode
- Playwright com viewport mobile
- Teste manual em device real (preferencial)

---

## 12. Prompt Original

> crie um prd para corrigir erros de css relacionados a responsividade, varias paginas não estão com mobile-first que é uma regra da aplicação, muitas paginas não estão preparadas para serem exibidas no celular

---

## 13. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | mobile-css-fix |
| Commit | TBD |
| Sprint | 2026-04-Sprint-3 |
| Dependência | Landing pages (003) pode usar mesmas correções |

---

## 14. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado |

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent