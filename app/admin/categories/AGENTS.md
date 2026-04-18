# Categories - MenuLink

## Visão Geral

**Rota**: `app/admin/categories/page.tsx`
**Responsabilidade**: Gestão de categorias do cardápio (CRUD)
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/categories/
├── page.tsx    # Página de categorias
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Interface para criar, editar, visualizar e excluir categorias do cardápio do restaurante.

### Operações CRUD

| Operação | Método | Endpoint |
|----------|--------|----------|
| Listar | GET | Supabase query |
| Criar | POST | Supabase insert |
| Editar | PATCH | Supabase update |
| Excluir | DELETE | Supabase delete |

### Campos da Categoria

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | Identificador único |
| `restaurant_id` | `uuid` | FK para restaurante |
| `name` | `string` | Nome da categoria |
| `display_order` | `integer` | Ordem de exibição |

### Fluxo de Usuário

1. Admin acessa `/admin/categories`
2. Sistema carrega lista de categorias
3. Admin pode:
   - Ver lista de categorias
   - Criar nova categoria (modal/form)
   - Editar categoria existente
   - Reordenar categorias (drag & drop)
   - Excluir categoria (com confirmação)

---

## Interface Pública

### Estados da Página

| Estado | Descrição |
|--------|-----------|
| `loading` | Carregando categorias |
| `success` | Lista exibida |
| `error` | Erro ao carregar |
| `creating` | Modal de criação aberto |
| `editing` | Modal de edição aberto |

### Componentes Utilizados

- `Table` (shadcn/ui) - Lista de categorias (desktop ≥1024px)
- `Cards` (shadcn/ui) - Lista de categorias (mobile <1024px)
- `Button` (shadcn/ui) - Ações com touch-target 44x44px
- `Dialog` (shadcn/ui) - Modais de criação/ediçao
- `Input` (shadcn/ui) - Campos de formulário
- `Badge` (shadcn/ui) - Status/indicadores

### Layout Adaptativo (Table ↔ Cards)

| Breakpoint | Visualização | Componente |
|------------|--------------|------------|
| Mobile (<768px) | Cards empilhados | `Card` com ações |
| Tablet (768-1023px) | Cards ou Table | Adapta conforme espaço |
| Desktop (≥1024px) | Tabela completa | `Table` com colunas |

**Implementação**:
```tsx
{/* Desktop: Table */}
<Table className="hidden lg:block">
  {/* ... */}
</Table>

{/* Mobile: Cards */}
<div className="grid gap-4 lg:hidden">
  {/* ... */}
</div>
```

### Dialog Fullscreen Mobile

Em mobile (<768px), o Dialog de criar/editar abre em tela cheia para melhor usabilidade:
- `className="max-w-none h-screen rounded-none"`
- Scroll vertical para acessar todos os campos
- Botão fechar visível no header

### Touch Targets

Todos os botões de ação (editar, excluir, adicionar) têm:
- `min-height: 44px`
- `min-width: 44px`
- Espaço de 8px ao redor

---

## Validações

| Campo | Regra |
|-------|-------|
| Nome | Obrigatório, não vazio, máx 50 caracteres |
| Display Order | Número inteiro ≥ 0 |

---

## Regras de Negócio

1. **DEVE** manter `restaurant_id` do admin logado
2. **NÃO DEVE** permitir excluir categoria com produtos associados
3. **DEVE** reordenar automaticamente ao excluir

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/products/page.tsx` | Produtos pertencem a categorias |
| `lib/supabase/client.ts` | Cliente Supabase |
| `types/` | Definições de tipos |

---

## Cenários BDD

```gherkin
@integration-test="tests/integration/categories.test.ts"
Funcionalidade: Gestão de Categorias

Cenário: Admin cria categoria válida
Dado que o admin está na página de categorias
Quando preenche "Bebidas" no campo nome
E clica em "Salvar"
Então a categoria "Bebidas" deve aparecer na lista

Cenário: Admin tenta criar categoria sem nome
Dado que o admin está na página de categorias
Quando deixa o campo nome vazio
E clica em "Salvar"
Então deve aparecer mensagem de erro "Nome é obrigatório"

Cenário: Categorias exibidas em cards em mobile
Dado que o admin está logado
E a janela do navegador está abaixo de 768px
Quando acessa a página de categorias
Então as categorias devem ser exibidas em cards
E cada card deve ter ações (editar/excluir) acessíveis

Cenário: Categorias exibidas em tabela em desktop
Dado que o admin está logado
E a janela do navegador está em 1024px ou mais
Quando acessa a página de categorias
Então as categorias devem ser exibidas em tabela
```

---

## Responsividade

### Requisitos de Responsividade

| Requisito | Descrição | Ref |
|-----------|-----------|-----|
| REQ-RESP-04 | Categories com Table→Cards adaptativo | spec.md |
| REQ-RESP-08 | Touch targets mínimo 44x44px | spec.md |
| REQ-RESP-09 | Nenhum overflow horizontal | spec.md |
| REQ-RESP-10 | Texto legível sem zoom (16px mínimo) | spec.md |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes de integração | Cenários BDD cobertos | Alta |
| Responsividade | Todos breakpoints | Alta |

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent