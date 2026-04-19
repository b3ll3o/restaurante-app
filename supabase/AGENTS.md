# Database (supabase/) - PediAi

## Visão Geral

Módulo **Database/Supabase** contém o schema SQL do PostgreSQL e as configurações de autenticação do sistema PediAi.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: PostgreSQL + Supabase (Database + Auth + Storage)

---

## Estrutura de Diretórios

```
supabase/
├── AGENTS.md           # Este arquivo - visão geral do módulo
├── schema.sql          # Schema completo do banco (tabelas, RLS, triggers)
├── migrations/         # Migrations versionadas (preparado, usar quando necessário)
│   └── AGENTS.md       # Documentação de migrations
└── schema/            # Documentação detalhada do schema
    └── AGENTS.md       # Referência completa das tabelas
```

---

## Referências

- **Regras globais**: `opencode/rules/AGENTS.md` (seção 2.3 para auth, seção 2.4 para env)
- **Schema detalhado**: `supabase/schema/AGENTS.md`
- **Migrations**: `supabase/migrations/AGENTS.md`

---

## 1. Configurações de Autenticação

### 1.1 Email Confirmation (CRÍTICO)

| Ambiente | Email Confirmation | Como Configurar |
|----------|-------------------|-----------------|
| **DEV** | **DESABILITADO** ❌ | Supabase Dashboard → Authentication → Settings → Disable "Enable email confirmations" |
| **PROD** | HABILITADO com SMTP customizado | Supabase Dashboard → Authentication → SMTP Settings |

**REGRA (2.3.2)**: Configurações de auth **DEVEM** estar documentadas neste arquivo.

### 1.2 Como Verificar Configuração Atual

**Via Dashboard (Manual)**:
1. Acessar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecionar projeto
3. Ir em **Authentication** → **Settings**
4. Verificar campo "Enable email confirmations"

**Via Código (grep)**:
```bash
# Procurar configurações de auth no projeto
grep -r "email.*confirm\|confirm.*email" --include="*.ts" --include="*.tsx"

# Verificar se há custom SMTP configurado
grep -r "smtp\|SMTP" --include="*.ts" --include="*.env*"
```

### 1.3 Provider Auth Configurado

| Provider | Status | Uso |
|----------|--------|-----|
| Email/Password | ✅ Ativo | Login principal do admin |
| Google OAuth | Opcional | Futuro |
| WhatsApp OTP | Futuro | Login via WhatsApp |

### 1.4 Redirect URLs

```
# DEV
http://localhost:3000/admin/login

# PROD
https://seu-dominio.com/admin/login
```

Configurar em: **Authentication** → **URL Configuration** → **Site URL** e **Redirect URLs**

---

## 2. Variáveis de Ambiente

### 2.1 Obrigatórias

```bash
# Supabase ( pública - exposta ao cliente )
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx

# WhatsApp API ( servidor )
WHATSAPP_TOKEN=EAANpZBLUF11s...
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

### 2.2 Opcionais (Produção)

```bash
# SMTP Customizado (para confirmação de email em PROD)
SMTP_HOST=smtp.seu-email.com
SMTP_PORT=587
SMTP_USER=seu-email@dominio.com
SMTP_PASS=sua-senha
SMTP_FROM=noreply@pediai.com.br
```

### 2.3 Onde Encontrar no Supabase

| Variável | Localização |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` public key |

---

## 3. Checklist de Configuração para Novos Ambientes

### 3.1 Setup Completo

- [ ] **Criar projeto Supabase** em [supabase.com](https://supabase.com)
- [ ] **Configurar auth** (desabilitar email confirmation em DEV)
  - [ ] Authentication → Settings → Disable "Enable email confirmations"
  - [ ] Authentication → URL Configuration → Configurar Site URL e Redirect URLs
- [ ] **Criar database com schema**
  - [ ] Executar `supabase/schema.sql` no SQL Editor
  - [ ] Verificar: 5 tabelas, RLS habilitado, 15+ políticas
- [ ] **Configurar RLS policies**
  - [ ] Verificar `restaurants` com 3 políticas (SELECT, INSERT, UPDATE)
  - [ ] Verificar `categories` com 4 políticas (SELECT, INSERT, UPDATE, DELETE)
  - [ ] Verificar `products` com 4 políticas
  - [ ] Verificar `orders` com 2 políticas (SELECT via função, UPDATE)
  - [ ] Verificar `order_items` com políticas públicas para INSERT
- [ ] **Configurar Storage** (se necessário)
  - [ ] Bucket `product-images` criado
  - [ ] Policies: Anyone can upload, view, delete
- [ ] **Adicionar variáveis ao .env.local**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `WHATSAPP_TOKEN`
  - [ ] `WHATSAPP_PHONE_NUMBER_ID`

### 3.2 Verificação Pós-Setup

```bash
# Verificar conexão
npm run build

# Verificar Typescript
npx tsc --noEmit

# Verificar lint
npm run lint
```

---

## 4. Row Level Security (RLS) - Resumo

### 4.1 Tabelas e Políticas

| Tabela | SELECT | INSERT | UPDATE | DELETE | Notes |
|--------|--------|--------|--------|--------|-------|
| `restaurants` | owner only | owner only | owner only | ❌ | |
| `categories` | owner via restaurant | owner via restaurant | owner via restaurant | owner via restaurant | |
| `products` | owner via category | owner via category | owner via category | owner via category | |
| `orders` | owner via function | public (anyone) | owner via function | ❌ | |
| `order_items` | owner via order | public (anyone) | owner via order | ❌ | |

### 4.2 Políticas Públicas (Cardápio sem Login)

```sql
-- Qualquer um pode ver restaurants, categories, products (menu público)
CREATE POLICY "Anyone can view published restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Qualquer um pode criar orders e order_items (checkout)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
```

### 4.3 Função de Helper

```sql
-- Para buscar owner_id de um pedido (usado nas policies de orders)
CREATE OR REPLACE FUNCTION get_order_owner_id(order_id UUID)
RETURNS UUID AS $$
  SELECT owner_id FROM restaurants WHERE id = (
    SELECT restaurant_id FROM orders WHERE id = order_id
  );
$$ LANGUAGE SQL SECURITY DEFINER;
```

### 4.4 Storage Bucket

```sql
-- Bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Policies públicas para upload/view/delete
CREATE POLICY "Anyone can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
```

---

## 5. Schema do Banco de Dados

> **Nota**: A documentação detalhada das tabelas, campos, relacionamentos e índices está em `supabase/schema/AGENTS.md` e `supabase/schema.sql`.

### 5.1 Diagrama de Entidades

```
restaurants (1) ──── (N) categories (1) ──── (N) products (1) ──── (N) order_items (N) ──── (1) orders (N) ──── (1) restaurants
```

### 5.2 Tabelas

| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `restaurants` | Restaurantes/tenants | ✅ owner only |
| `categories` | Categorias de produtos | ✅ owner via restaurant |
| `products` | Produtos/itens do cardápio | ✅ owner via category |
| `orders` | Pedidos de clientes | ✅ owner + public INSERT |
| `order_items` | Itens do pedido | ✅ owner + public INSERT |

---

## 6. Fluxo de Autenticação

```
Usuário acessa /admin/login
        │
        ▼
Supabase Auth (email/password)
        │
    ┌───┴───┐
    │       │
  Sucesso  Falha
    │       │
    ▼       ▼
Redirect  Mensagem
/admin/   de erro
        │
        ▼
Cria/associa restaurant ao user_id (via owner_id)
```

---

## 7. Multi-Tenant

### 7.1 Isolamento

- Cada restaurante = 1 tenant
- `restaurant_id` é a chave de isolamento
- RLS garante que queries só veem dados do tenant do owner autenticado

### 7.2 Consultas Seguras

```sql
-- ✅ CORRETO: filtra por restaurant_id
SELECT * FROM products WHERE restaurant_id = $1;

-- ❌ INCORRETO: vazaria dados entre tenants
SELECT * FROM products;
```

---

## 8. Storage (Imagens)

### 8.1 Bucket Configurado

| Bucket | Público | Uso |
|--------|---------|-----|
| `product-images` | ✅ Sim | Imagens dos produtos do cardápio |

### 8.2 URL Pública

```
https://{PROJECT_REF}.supabase.co/storage/v1/object/public/product-images/{filename}
```

---

## 9. Backup e Restore

### 9.1 Backup

```bash
# Completo
pg_dump -h db.supabase.co -U postgres -d postgres > backup.sql

# Apenas estrutura
pg_dump -h db.supabase.co -U postgres -d postgres --schema-only > schema.sql
```

### 9.2 Restore

```bash
psql -h db.supabase.co -U postgres -d postgres < backup.sql
```

---

## 10. Métricas de Qualidade

| Métrica | Target | Status |
|---------|--------|--------|
| Tabelas com RLS | 5/5 (100%) | ✅ |
| Políticas públicas (menu) | 3 tabelas | ✅ |
| Storage bucket configurado | 1 bucket | ✅ |
| Email confirmation DEV desabilitado | Verificar manualmente | ⚠️ |
| Variáveis de ambiente documentadas | 100% | ✅ |

---

## 11. Referências

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Versão**: 2.0
**Última Atualização**: 2026-04-19
**Autor**: AI Agent
