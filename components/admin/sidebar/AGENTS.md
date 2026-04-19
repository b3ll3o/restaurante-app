# Sidebar - PediAi

## Visão Geral

**Componente**: `components/admin/sidebar.tsx`
**Responsabilidade**: Menu lateral de navegação do painel administrativo
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4

---

## Estrutura de Diretórios

```
components/admin/
├── sidebar.tsx # Componente Sidebar
└── sidebar/AGENTS.md # Esta documentação
```

---

## Responsabilidade

Componente de navegação que exibe o menu lateral do painel administrativo. Permite ao usuário navegar entre as diferentes seções do admin (Dashboard, Categorias, Produtos, Pedidos, Configurações).

### Arquitetura Responsiva

O sidebar possui dois comportamentos:
- **Desktop (≥1024px)**: Sidebar fixo visível na lateral esquerda
- **Mobile/Tablet (<1024px)**: Drawer lateral (Sheet) que abre ao clicar no hamburger do Header

### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `className` | `string` | Classes CSS opcionais para o container |
| `onClick` | `() => void` | Callback opcional executado ao clicar em um item de navegação |

### Exports

| Export | Tipo | Descrição |
|--------|------|-----------|
| `Sidebar` | Componente | Sidebar completo para desktop |
| `SidebarContent` | Componente | Conteúdo do sidebar (nav items + ajuda) |

### Itens de Navegação

| href | label | ícone | Descrição |
|------|-------|-------|-----------|
| `/admin/dashboard` | Dashboard | `LayoutDashboard` | Visão geral do restaurante |
| `/admin/categories` | Categorias | `Utensils` | Gestão de categorias do cardápio |
| `/admin/products` | Produtos | `Package` | Gestão de produtos |
| `/admin/orders` | Pedidos | `ShoppingCart` | Lista e gestão de pedidos |
| `/admin/settings` | Configurações | `Settings` | Configurações do restaurante |

### Comportamento

1. Renderiza logo PediAi no topo
2. Lista itens de navegação com ícone e label
3. Destaca item ativo baseado na URL atual
4. Seção de ajuda no rodapé com informações de suporte

---

## Arquitetura

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
        <span className="font-semibold text-lg">PediAi</span>
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

---

## Uso

### Sidebar para Desktop

```tsx
import { Sidebar } from "@/components/admin/sidebar";

// Sidebar fixo visível em desktop (≥1024px)
<div className="hidden lg:block">
  <Sidebar />
</div>
```

### SidebarContent para Drawer Mobile

```tsx
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/admin/sidebar";

// Drawer lateral em mobile (<1024px)
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left" className="p-0 w-64">
    <SidebarContent onClick={() => setSidebarOpen(false)} />
  </SheetContent>
</Sheet>
```

### Comportamento Responsivo

| Breakpoint | Comportamento | Implementação |
|------------|---------------|--------------|
| Mobile (<768px) | Drawer lateral | Sheet com side="left" |
| Tablet (768-1023px) | Drawer lateral | Sheet com side="left" |
| Desktop (≥1024px) | Sidebar fixo | aside w-64 visível |

### Touch Targets

Todos os itens de navegação têm `touch-target` (min 44x44px) para acessibilidade mobile.

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| `next/link` | 16.2.3 | Navegação entre páginas |
| `next/navigation` | 16.2.3 | Hook usePathname |
| `lucide-react` | ^1.8.0 | Ícones de navegação |
| `clsx` / `cn` | - | Utilitário de concatenação de classes |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Acessibilidade | WCAG 2.1 AA | Alta |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/layout.tsx` | Usa este componente |
| `components/admin/header.tsx` | Componente irmão de cabeçalho |

---

## Regras de Implementação

1. **Client Component**: Usa `"use client"` porque utiliza hooks do Next.js (`usePathname`)
2. **Navegação ativa**: O item é destacado quando `pathname === item.href`
3. **Estilização**: Usa classes Tailwind com `cn()` para concatenar classes condicionais
4. **Ícones**: Importa ícones individualmente de `lucide-react` para tree-shaking

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agentnt