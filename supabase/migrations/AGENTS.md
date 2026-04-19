# Migrations - PediAi

## Visão Geral

Módulo responsável pelo versionamento e aplicação de alterações no schema do banco de dados PostgreSQL do PediAi.

**Idioma**: Português Brasileiro (pt-BR)

**Stack**: PostgreSQL + Supabase

**Responsabilidade**: Controlar alterações incrementais do schema, permitir reversões e manter histórico de mudanças.

---

## Estrutura de Diretórios

```
supabase/
├── schema.sql          # Schema completo (estado atual)
└── migrations/         # Migrations versionadas (futuro)
    └── AGENTS.md       # Este arquivo
```

---

## Estado Atual do Projeto

O projeto atualmente utiliza **schema.sql** (único arquivo com todo o schema) em vez de migrations versionadas. O diretório `migrations/` está preparado para receber versionamento incremental quando necessário.

### Schema Atual

O `schema.sql` contém:
- Extensão UUID
- Tabelas: `restaurants`, `categories`, `products`, `orders`, `order_items`
- Row Level Security (RLS)
- Índices de performance
- Triggers e funções
- Storage bucket para imagens

---

## Padrões de Migration

### Formato de Nome

```
{versão}_{descricao_curta}.sql
YYYYMMDD_HHMMSS_descricao.sql
```

Exemplos:
- `20260417_120000_create_restaurants.sql`
- `20260417_130000_add_products_image_url.sql`

### Estrutura de Uma Migration

```sql
-- Migration: {descrição}
-- Aplicada em: {data}
-- Autor: {autor}

BEGIN;

-- Criar tabela
CREATE TABLE exemplo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar políticas RLS
ALTER TABLE exemplo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view exemplo" ON exemplo FOR SELECT USING (true);

-- Criar índices
CREATE INDEX idx_exemplo_nome ON exemplo(nome);

COMMIT;
```

### Operações Comuns

#### Criar Tabela

```sql
-- Migration: criar tabela categorias
BEGIN;

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view categories" ON categories
    FOR SELECT USING (true);

CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);

COMMIT;
```

#### Adicionar Coluna

```sql
-- Migration: adicionar coluna image_url em products
BEGIN;

ALTER TABLE products ADD COLUMN image_url TEXT;

COMMIT;
```

#### Adicionar Índice

```sql
-- Migration: criar índice para busca por slug
BEGIN;

CREATE UNIQUE INDEX idx_restaurants_slug ON restaurants(slug);

COMMIT;
```

#### Adicionar Política RLS

```sql
-- Migration: adicionar política para orders
BEGIN;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = orders.restaurant_id
            AND restaurants.owner_id = auth.uid()
        )
    );

COMMIT;
```

---

## Como Criar Nova Migration

1. **Identificar necessidade**: Nova feature ou correção que requer mudança de schema

2. **Criar arquivo**: Em `supabase/migrations/` com formato `YYYYMMDD_HHMMSS_descricao.sql`

3. **Escrever migration**:
   - Usar `BEGIN;` no início
   - Usar `COMMIT;` no final (ou `ROLLBACK;` em caso de erro)
   - Incluir comentários com descrição e data

4. **Exemplo**:
```sql
-- Migration: adicionar coluna phone em restaurants
-- Aplicada em: 2026-04-17
-- Autor: Sistema

BEGIN;

ALTER TABLE restaurants ADD COLUMN phone TEXT;

COMMIT;
```

---

## Como Aplicar Migrations

### Supabase SQL Editor

1. Acessar Supabase Dashboard
2. Abrir SQL Editor
3. Copiar conteúdo da migration
4. Executar

### Linha de Comando (CLI Supabase)

```bash
supabase db push
```

### Via pgSQL (Produção)

```bash
psql -h db.supabase.co -U postgres -d postgres -f migration.sql
```

---

## Como Reverter Migration

### Se Não Houver Rollback

```sql
-- Reverter manualmente (exemplo para DROP COLUMN)
BEGIN;

ALTER TABLE restaurants DROP COLUMN phone;

COMMIT;
```

### Criar Migration de Rollback

```sql
-- Rollback: remover coluna phone
BEGIN;

ALTER TABLE restaurants DROP COLUMN IF EXISTS phone;

COMMIT;
```

---

## Boas Práticas

1. **Sempre usar transactions**: `BEGIN` + `COMMIT`
2. **Testar localmente**: Antes de aplicar em produção
3. **Verificar RLS**: Toda nova tabela deve ter políticas
4. **Criar índices**: Para colunas com foreign keys e frequent queries
5. **Documentar**: Comentários explicando propósito
6. **Ordem**: Aplicar dependências antes das dependentes

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Migrations versionadas | 100% | Alta |
| Teste de rollback | A cada migration | Alta |
| Cobertura RLS | 100% | Crítica |
| Índices por FK | 100% | Alta |

---

## Referências

- [Supabase Migrations](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent