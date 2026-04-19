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

interface SidebarContentProps {
  onClick?: () => void;
}

export function SidebarContent({ onClick }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-2 p-6 border-b">
        <LinkIcon className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">PediAi</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-target",
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
    </>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col w-64 border-r bg-card", className)}>
      <SidebarContent />
    </aside>
  );
}