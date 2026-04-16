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

- `Table` (shadcn/ui) - Lista de categorias
- `Button` (shadcn/ui) - Ações
- `Dialog` (shadcn/ui) - Modais de criação/ediçao
- `Input` (shadcn/ui) - Campos de formulário
- `Badge` (shadcn/ui) - Status/indicadores

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