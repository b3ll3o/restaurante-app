# Products - MenuLink

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

- `Table` (shadcn/ui)
- `Button` (shadcn/ui)
- `Dialog` (shadcn/ui)
- `Input` (shadcn/ui)
- `NumberInput` (shadcn/ui)
- `Select` (shadcn/ui)
- `Switch` (shadcn/ui) - Toggle disponibilidade
- `Badge` (shadcn/ui)

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

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Testes de integração | Cenários BDD cobertos | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent