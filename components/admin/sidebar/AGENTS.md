# Sidebar - MenuLink

## Visão Geral

**Componente**: `components/admin/sidebar/Sidebar`
**Responsabilidade**: Menu lateral de navegação do painel administrativo
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4

---

## Estrutura de Diretórios

```
components/admin/sidebar/
├── Sidebar.tsx      # Componente Sidebar
└── AGENTS.md        # Esta documentação
```

---

## Responsabilidade

Componente de navegação que exibe o menu lateral do painel administrativo. Permite ao usuário navegar entre as diferentes secciones do admin (Dashboard, Categorias, Produtos, Pedidos, Configurações).

### Props

Não possui props externas. Utiliza `usePathname()` do Next.js para determinar rota ativa.

### Itens de Navegação

| href | label | ícone | Descrição |
|------|-------|-------|-----------|
| `/admin/dashboard` | Dashboard | `LayoutDashboard` | Visão geral do restaurante |
| `/admin/categories` | Categorias | `Utensils` | Gestão de categorias do cardápio |
| `/admin/products` | Produtos | `Package` | Gestão de produtos |
| `/admin/orders` | Pedidos | `ShoppingCart` | Lista e gestão de pedidos |
| `/admin/settings` | Configurações | `Settings` | Configurações do restaurante |

### Comportamento

1. Renderiza logo MenuLink no topo
2. Lista itens de navegação com ícone e label
3. Destaca item ativo baseado na URL atual
4. Seção de ajuda no rodapé com informações de suporte

---

## Arquitetura

```typescript
// components/admin/sidebar/Sidebar.tsx
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
| `components/admin/header/Header.tsx` | Componente irmão de cabeçalho |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent