# Admin Components - MenuLink

## Visão Geral

O módulo **Admin Components** (`components/admin/`) contém componentes React específicos para o painel administrativo do MenuLink. Diferente dos componentes UI base, estes componentes encapsulam lógica de negócio do admin.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4

---

## Estrutura de Diretórios

```
components/admin/
├── header.tsx    # Cabeçalho do admin
└── sidebar.tsx   # Menu lateral de navegação
```

---

## Header (`header.tsx`)

### Responsabilidade

Cabeçalho do painel administrativo com informações do usuário logado e botão de logout.

### Props

```typescript
interface HeaderProps {
  userEmail?: string;
}
```

### Propriedades

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `userEmail` | `string` | Não | Email do usuário logado. Exibe "Administrador" se não fornecido. |

### Funcionalidades

1. **Exibição do usuário**: Mostra email ou "Administrador" como fallback
2. **Ícone de usuário**: Avatar circular com ícone de pessoa
3. **Botão de logout**: Encerra sessão e redireciona para login
4. **Feedback visual**: Indicador de loading durante logout

### Implementação

```typescript
// components/admin/header.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  userEmail?: string;
}

export function Header({ userEmail }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-card">
      {/* Logo e usuário */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{userEmail || "Administrador"}</p>
          </div>
        </div>
      </div>

      {/* Botão sair */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={isLoading}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </header>
  );
}
```

### Uso

```tsx
import { Header } from "@/components/admin/header";

// Uso básico
<Header />

// Com email do usuário
<Header userEmail="admin@restaurante.com" />
```

---

## Sidebar (`sidebar.tsx`)

### Responsabilidade

Menu lateral de navegação do painel administrativo com links para todas as seções.

### Itens de Navegação

| href | label | ícone | Descrição |
|------|-------|-------|-----------|
| `/admin/dashboard` | Dashboard | `LayoutDashboard` | Visão geral |
| `/admin/categories` | Categorias | `Utensils` | Gestão de categorias |
| `/admin/products` | Produtos | `Package` | Gestão de produtos |
| `/admin/orders` | Pedidos | `ShoppingCart` | Gestão de pedidos |
| `/admin/settings` | Configurações | `Settings` | Configurações do restaurante |

### Funcionalidades

1. **Navegação**: Links para todas as páginas do admin
2. **Indicador de página ativa**: Destaque visual na rota atual
3. **Logo**: Logo MenuLink no topo
4. **Seção de ajuda**: Texto de suporte no rodapé

### Implementação

```typescript
// components/admin/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  Package,
  ShoppingCart,
  Settings,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
          const Icon = item.icon;
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
              <Icon className="h-4 w-4" />
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

### Uso

```tsx
import { Sidebar } from "@/components/admin/sidebar";

<Sidebar />
```

---

## Layout do Admin

O Header e Sidebar são usados juntos no layout do admin:

```tsx
// app/admin/layout.tsx
"use client";

import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }) {
  const [userEmail, setUserEmail] = useState<string>();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## Regras de Implementação

### 1. Client Components

Ambos os componentes usam `"use client"` porque:
- Usam hooks do React (`useState`)
- Interagem com Supabase Auth
- Usam `usePathname` do Next.js

### 2. Type Safety

```tsx
// ✅ Bom: Props tipadas
interface HeaderProps {
  userEmail?: string;
}

// ❌ Ruim: any
interface HeaderProps {
  userEmail: any;
}
```

### 3. Estilização com Tailwind

```tsx
// ✅ Bom: Classes utilitárias responsivas
<div className="flex items-center gap-2 md:gap-4">

// ❌ Ruim: Estilos fixos
<div className="flex items-center gap-2">
```

### 4. Composição

```tsx
// ✅ Bom: Componentes separados e composáveis
<Sidebar />
<Header userEmail={email} />

// ❌ Ruim: Componentes acoplados
<AdminLayout>
  <Sidebar />
  <Header />
</AdminLayout>
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Acessibilidade | 0 violações | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @supabase/ssr | ^0.10.2 | Cliente Supabase |
| lucide-react | ^1.8.0 | Ícones |
| tailwindcss | ^4 | Estilização |

---

## Referências

- [Next.js Navigation](https://nextjs.org/docs/app/building-your-application/routing/navigation)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent