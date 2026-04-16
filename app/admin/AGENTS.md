# Admin - MenuLink

## Visão Geral

O módulo **Admin** (`app/admin/`) é o painel administrativo completo para donos de restaurantes gerenciarem seus cardápios, produtos e pedidos. O módulo é protegido por autenticação Supabase e segue uma arquitetura multi-tenant onde cada restaurante é um tenant isolado.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript (strict) + Supabase + Tailwind CSS 4
**Autenticação**: Supabase Auth (email/password)

---

## Estrutura de Diretórios

```
app/admin/
├── layout.tsx                    # Layout principal com auth check (client-side)
├── auth/
│   └── callback/
│       └── route.ts              # Callback OAuth do Supabase
├── login/
│   └── page.tsx                  # Página de login
├── signup/
│   └── page.tsx                  # Página de cadastro
├── dashboard/
│   └── page.tsx                  # Dashboard principal
├── categories/
│   └── page.tsx                  # CRUD de categorias
├── products/
│   └── page.tsx                  # CRUD de produtos
├── orders/
│   └── page.tsx                  # Gestão de pedidos
└── settings/
    └── page.tsx                  # Configurações do restaurante
```

---

## Arquitetura

### Autenticação

O admin utiliza **client-side auth check** através do `layout.tsx`. Todas as rotas exceto `/login` e `/signup` requerem autenticação.

```typescript
// app/admin/layout.tsx
"use client";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      // Ignora auth check na página de login
      if (window.location.pathname === "/admin/login") {
        setIsLoading(false);
        return;
      }

      // Verifica sessão com timeout de 5s
      const { data: { session } } = await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        )
      ]).catch(() => ({ data: { session: null } }));

      if (!session) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(session.user.email);
    };

    checkAuth();

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);
}
```

### Callback de Autenticação

```typescript
// app/admin/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_callback_failed`);
}
```

---

## Rotas

### Login (`/admin/login`)

**Arquivo**: `app/admin/login/page.tsx`
**Responsabilidade**: Autenticar o proprietário do restaurante.

**Funcionalidades**:
- Formulário com email e senha
- Autenticação via Supabase `signInWithPassword`
- Redirecionamento para dashboard em caso de sucesso
- Exibição de erros de autenticação

**Fluxo**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    setError(error.message);
    return;
  }

  router.push("/admin/dashboard");
  router.refresh();
};
```

### Cadastro (`/admin/signup`)

**Arquivo**: `app/admin/signup/page.tsx`
**Responsabilidade**: Criar nova conta e restaurante.

**Campos do formulário**:
- `email` - Email do administrador
- `password` - Senha (mínimo 6 caracteres)
- `restaurantName` - Nome do restaurante
- `whatsappNumber` - WhatsApp para receber pedidos

**Fluxo**:
```typescript
const { data, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      restaurant_name: restaurantName,
      whatsapp_number: whatsappNumber,
    },
  },
});
```

**Nota**: O signup cria o usuário no Supabase Auth. A criação do restaurante no banco `restaurants` deve ser feita via trigger ou em uma API route separada.

### Dashboard (`/admin/dashboard`)

**Arquivo**: `app/admin/dashboard/page.tsx`
**Responsabilidade**: Visão geral do restaurante com estatísticas.

**Cards de Estatísticas**:
| Card | Ícone | Descrição |
|------|-------|-----------|
| Categorias | `Utensils` | Total de categorias cadastradas |
| Produtos | `Package` | Total de produtos no cardápio |
| Pedidos Pendentes | `Clock` | Pedidos com status "pending" |
| Pedidos Hoje | `TrendingUp` | Pedidos criados hoje |

**Pedidos Recentes**: Lista os últimos 5 pedidos com nome do cliente, hora e status.

**Implementação**:
```typescript
const [stats, setStats] = useState<Stats>({
  categories: 0,
  products: 0,
  pendingOrders: 0,
  todayOrders: 0,
});

// Busca dados em paralelo
const [categoriesRes, productsRes, ordersRes] = await Promise.all([
  supabase.from("categories").select("id", { count: "exact" }),
  supabase.from("products").select("id", { count: "exact" }),
  supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
]);
```

### Categorias (`/admin/categories`)

**Arquivo**: `app/admin/categories/page.tsx`
**Responsabilidade**: CRUD completo de categorias do cardápio.

**Tabela de Categorias**:
| Coluna | Descrição |
|--------|-----------|
| Ordem | Número de ordenação (badge) |
| Nome | Nome da categoria |
| Ações | Botões editar e deletar |

**Dialog de Criação/Edição**:
- `name` - Nome da categoria
- `display_order` - Ordem de exibição

**Operações**:
```typescript
// Criar
supabase.from("categories").insert({ name, display_order });

// Atualizar
supabase.from("categories").update({ name, display_order }).eq("id", id);

// Deletar
supabase.from("categories").delete().eq("id", id);
```

### Produtos (`/admin/products`)

**Arquivo**: `app/admin/products/page.tsx`
**Responsabilidade**: CRUD completo de produtos com upload de imagens.

**Tabela de Produtos**:
| Coluna | Descrição |
|--------|-----------|
| Imagem | Thumbnail do produto ou placeholder |
| Nome | Nome do produto |
| Categoria | Categoria associada |
| Preço | Preço formatado em BRL |
| Status | Badge "Disponível" ou "Indisponível" |
| Ações | Botões editar e deletar |

**Dialog de Criação/Edição**:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | text | Nome do produto |
| Descrição | textarea | Descrição opcional |
| Preço | number | Preço em reais |
| Ordem | number | Ordem de exibição |
| Categoria | select | Categoria do produto |
| Imagem | file | Upload de imagem (opcional) |
| Disponível | switch | Se está disponível para venda |

**Upload de Imagens**:
```typescript
const uploadImage = async (file: File): Promise<string | null> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) return null;

  const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
  return data.publicUrl;
};
```

### Pedidos (`/admin/orders`)

**Arquivo**: `app/admin/orders/page.tsx`
**Responsabilidade**: Visualizar e gerenciar pedidos recebidos.

**Tabela de Pedidos**:
| Coluna | Descrição |
|--------|-----------|
| Cliente | Nome do cliente |
| WhatsApp | Link para wa.me |
| Total | Valor formatado |
| Pagamento | Badge PIX/Dinheiro |
| Status | Badge colorido |
| Data/Hora | Data e hora formatadas |
| Ações | Ver detalhes, confirmar, cancelar |

**Status do Pedido**:
| Status | Badge | Ações Disponíveis |
|--------|-------|-------------------|
| `pending` | outline | Confirmar, Cancelar |
| `confirmed` | default | Nenhuma |
| `cancelled` | destructive | Nenhuma |

**Dialog de Detalhes**:
- Informações do cliente (nome, WhatsApp)
- Lista de itens do pedido
- Total do pedido
- Botões de ação (confirmar/cancelar)

**Atualização de Status**:
```typescript
const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (!error) {
    fetchOrders(); // Refresh lista
  }
};
```

### Configurações (`/admin/settings`)

**Arquivo**: `app/admin/settings/page.tsx`
**Responsabilidade**: Gerenciar informações do restaurante.

**Seções**:

1. **Informações do Restaurante**:
   - Nome do restaurante
   - WhatsApp para pedidos

2. **Link do Cardápio**:
   - URL pública do cardápio (`/menu/{slug}`)
   - Botão copiar link

**Busca Restaurant**:
```typescript
const { data: { user } } = await supabase.auth.getUser();

const { data: restaurantData } = await supabase
  .from("restaurants")
  .select("*")
  .eq("owner_id", user.id)
  .single();
```

---

## Componentes de Interface

### Header (`components/admin/header.tsx`)

**Responsabilidade**: Cabeçalho do painel com informações do usuário e logout.

**Props**:
```typescript
interface HeaderProps {
  userEmail?: string;
}
```

**Funcionalidades**:
- Exibição do email do usuário
- Botão de logout com feedback visual
- Ícone de usuário

**Implementação**:
```typescript
export function Header({ userEmail }: HeaderProps) {
  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-card">
      {/* Logo e usuário */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm font-medium">{userEmail || "Administrador"}</p>
      </div>

      {/* Botão sair */}
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </header>
  );
}
```

### Sidebar (`components/admin/sidebar.tsx`)

**Responsabilidade**: Menu lateral de navegação.

**Itens de Navegação**:
| href | label | ícone |
|------|-------|-------|
| `/admin/dashboard` | Dashboard | `LayoutDashboard` |
| `/admin/categories` | Categorias | `Utensils` |
| `/admin/products` | Produtos | `Package` |
| `/admin/orders` | Pedidos | `ShoppingCart` |
| `/admin/settings` | Configurações | `Settings` |

**Implementação**:
```typescript
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categorias", icon: Utensils },
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 border-r bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 p-6 border-b">
        <LinkIcon className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">MenuLink</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Ajuda */}
      <div className="p-4 border-t">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Precisa de ajuda?
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Acesse nossa documentação ou entre em contato com o suporte.
          </p>
        </div>
      </div>
    </aside>
  );
}
```

---

## Regras de Negócio

### 1. Proteção de Rotas

Todas as rotas exceto `/admin/login` e `/admin/signup` verificam autenticação. Usuários não autenticados são redirecionados para `/admin/login`.

### 2. Multi-Tenant

Os dados são filtrados por `restaurant_id` quando aplicável. O `restaurant_id` é obtido através do usuário autenticado:

```typescript
const { data: { user } } = await supabase.auth.getUser();
const { data: restaurant } = await supabase
  .from("restaurants")
  .select("*")
  .eq("owner_id", user.id)
  .single();
```

### 3. Validações

| Campo | Regra |
|-------|-------|
| Nome (categoria/produto) | Obrigatório, não vazio |
| Preço | Maior que 0 |
| Ordem de exibição | Inteiro não negativo |
| WhatsApp | Formato brasileiro (10-13 dígitos) |

### 4. Status de Pedido

```
pending → confirmed (confirmar)
pending → cancelled (cancelar)
confirmed → (terminal)
cancelled → (terminal)
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| `WHATSAPP_TOKEN` | Token da API WhatsApp Business |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número de telefone |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente Supabase com SSR |
| @supabase/supabase-js | ^2.103.0 | Cliente banco de dados |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Tempo de carregamento | <2s | Média |
| Complexidade ciclomática | ≤10 | Média |

---

## Boas Práticas

### 1. Client Components

Todas as páginas do admin usam `'use client'` porque dependem de:
- Estado local (`useState`)
- Efeitos colaterais (`useEffect`)
- Interação com Supabase (browser client)

### 2. Feedback Visual

- Loading spinners durante operações assíncronas
- Mensagens de sucesso/erro (alerts)
- Estados de disabled em botões durante salvamento

### 3. Cleanup

Sempre usar cleanup em `useEffect` para evitar memory leaks:

```typescript
useEffect(() => {
  const timer = setTimeout(() => setAlert(null), 3000);
  return () => clearTimeout(timer);
}, [alert]);
```

### 4. Type Safety

Todas as interfaces são definidas localmente nas páginas para garantir type safety:

```typescript
interface Category {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}
```

---

## Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent