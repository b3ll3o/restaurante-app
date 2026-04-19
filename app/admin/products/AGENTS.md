# Products - PediAi

## Visão Geral

**Rota**: `app/admin/products/page.tsx`
**Responsabilidade**: Gestão de produtos do cardápio (CRUD)
**Idioma**: Português Brasileiro (pt-BR)

---

## Estrutura de Diretórios

```
app/admin/products/
├── page.tsx    # Página de produtos
└── AGENTS.md   # Esta documentação
```

---

## Funcionalidade

### Propósito

Interface para criar, editar, visualizar e excluir produtos do cardápio.

### Campos do Produto

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | Identificador único |
| `category_id` | `uuid` | FK para categoria |
| `name` | `string` | Nome do produto |
| `description` | `string` | Descrição (opcional) |
| `price` | `number` | Preço em centavos |
| `image_url` | `string` | URL da imagem (opcional) |
| `is_available` | `boolean` | Disponibilidade |
| `display_order` | `integer` | Ordem na categoria |

### Operações CRUD

| Operação | Descrição |
|----------|-----------|
| Listar | Exibe todos os produtos do restaurante |
| Criar | Adiciona novo produto |
| Editar | Modifica produto existente |
| Excluir | Remove produto (com confirmação) |
| Toggle disponibilidade | Ativa/desativa produto |

### Fluxo de Usuário

1. Admin acessa `/admin/products`
2. Sistema carrega produtos (agrupados por categoria)
3. Admin pode:
   - Ver lista de produtos
   - Filtrar por categoria
   - Criar novo produto
   - Editar produto existente
   - Ativar/desativar disponibilidade
   - Excluir produto

---

## Interface Pública

### Estados da Página

| Estado | Descrição |
|--------|-----------|
| `loading` | Carregando produtos |
| `success` | Lista exibida |
| `error` | Erro ao carregar |
| `creating` | Modal de criação |
| `editing` | Modal de edição |

### Componentes Utilizados

- `Table` (shadcn/ui) - Lista de produtos (desktop ≥1024px)
- `Cards` (shadcn/ui) - Lista de produtos (mobile <1024px)
- `Button` (shadcn/ui) - Ações com touch-target 44x44px
- `Dialog` (shadcn/ui) - Modais de criação/ediçao
- `Input` (shadcn/ui) - Campos de formulário
- `NumberInput` (shadcn/ui)
- `Select` (shadcn/ui)
- `Switch` (shadcn/ui) - Toggle disponibilidade
- `Badge` (shadcn/ui)

### Layout Adaptativo (Grid 1→2 colunas)

| Breakpoint | Visualização | Grid |
|------------|--------------|------|
| Mobile (<768px) | Cards empilhados | `grid-cols-1` |
| Tablet (768-1023px) | Cards em 2 colunas | `grid-cols-2` |
| Desktop (≥1024px) | Table ou Grid | `lg:grid-cols-3` |

**Implementação**:
```tsx
{/* Mobile: 1 coluna, Tablet: 2 colunas */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{/* Desktop: Table */}
<Table className="hidden lg:block">
  {/* ... */}
</Table>

{/* Desktop: Cards (alternativo) */}
<div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
  {/* ... */}
</div>
```

### Dialog Fullscreen Mobile

Em mobile (<768px), o Dialog de criar/editar produto abre em tela cheia:
- `className="max-w-none h-screen rounded-none"`
- Scroll vertical para todos os campos
- Campo de imagem com aspect-ratio 4:3

### Imagens Responsivas

- Usam `aspect-video` e `object-cover`
- `max-width: 100%` para não causar overflow
- Lazy loading nativo

### Touch Targets

Todos os botões de ação têm `min-height: 44px` e `min-width: 44px`.

---

## Validações

| Campo | Regra |
|-------|-------|
| Nome | Obrigatório, máx 100 caracteres |
| Descrição | Opcional, máx 500 caracteres |
| Preço | Obrigatório, ≥ 0 |
| Categoria | Obrigatório, deve existir |
| URL Imagem | Opcional, formato URL válido |

---

## Regras de Negócio

1. **DEVE** associar produto a uma categoria
2. **DEVE** validar que categoria pertence ao restaurante
3. **PODE** ter produto sem imagem (exibe placeholder)
4. **PODE** ter produto indisponível (não aparece no menu público)

---

## Upload de Imagem

- **Método**: Upload para Supabase Storage ou URL externa
- **Formatos**: JPG, PNG, WebP
- **Tamanho máximo**: 5MB
- **Dimensões recomendadas**: 800x600px

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/categories/page.tsx` | Categorias para seleção |
| `app/menu/[slug]/page.tsx` | Exibição pública |
| `lib/supabase/client.ts` | Cliente Supabase |
| `lib/supabase/storage.ts` | Upload de imagens |

---

## Cenários BDD

```gherkin
@integration-test="tests/integration/products.test.ts"
Funcionalidade: Gestão de Produtos

Cenário: Admin cria produto válido
Dado que o admin está na página de produtos
E existe categoria "Bebidas"
Quando preenche "Suco de Laranja" no nome
E preenche "12.90" no preço
E seleciona categoria "Bebidas"
E clica em "Salvar"
Então o produto "Suco de Laranja" deve aparecer na lista

Cenário: Admin desativa produto
Dado que o admin está na página de produtos
E existe produto "Coca-Cola"
Quando clica no toggle de disponibilidade
Então o produto deve aparecer como indisponível
```

## Responsividade

### Requisitos de Responsividade

| Requisito | Descrição | Ref |
|-----------|-----------|-----|
| REQ-RESP-05 | Products com grid responsivo + modal mobile | spec.md |
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