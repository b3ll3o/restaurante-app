# Button - MenuLink

## Visão Geral

**Componente**: `components/ui/button/Button`
**Responsabilidade**: Componente base de botão seguindo o design system shadcn/ui
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui

---

## Estrutura de Diretórios

```
components/ui/button/
├── Button.tsx       # Componente Button
└── AGENTS.md        # Esta documentação
```

---

## Responsabilidade

Componente de botão reutilizável que segue o design system do projeto. Suporta múltiplas variantes, tamanhos e estados.

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `string` | `"default"` | Variante visual do botão |
| `size` | `string` | `"default"` | Tamanho do botão |
| `asChild` | `boolean` | `false` | Usar como wrapper de outro elemento |
| `disabled` | `boolean` | `false` | Desabilita o botão |

### Variantes

| Variante | Descrição | Uso típico |
|----------|-----------|------------|
| `default` | Fundo primário, texto branco | Ações principais |
| `destructive` | Fundo vermelho | Ações destrutivas (deletar) |
| `outline` | Borda, fundo transparente | Ações secundárias |
| `secondary` | Fundo cinza | Ações menos importantes |
| `ghost` | Fundo transparente, hover cinza | Ações sutis |
| `link` | Sem fundo, texto com underline | Links dentro de textos |

### Tamanhos

| Tamanho | Descrição |
|---------|-----------|
| `default` | Tamanho padrão (h-10 px-4) |
| `sm` | Tamanho pequeno (h-9 px-3) |
| `lg` | Tamanho grande (h-11 px-8) |
| `icon` | Tamanho quadrado para ícones (h-10 w-10) |

### Estados

| Estado | Comportamento |
|--------|---------------|
| `default` | Estado normal |
| `hover` | Opacidade reduzida (opacity-90) |
| `active` | Escala reduzida (scale-95) |
| `disabled` | Cursor not-allowed, opacidade 50% |
| `loading` | O componente pai gerencia (spinner) |

---

## Arquitetura

```typescript
// components/ui/button/Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:opacity-80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| `react` | 19.2.4 | Biblioteca React |
| `@radix-ui/react-slot` | ^1.0.0 | Composição de componentes |
| `class-variance-authority` | ^0.7.0 | CVA para variantes |
| `clsx` | - | Utilitário de classes |
| `tailwind-merge` | - | Merge de classes Tailwind |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Acessibilidade | WCAG 2.1 AA | Alta |

---

## Boas Práticas

1. **Semântica**: Usar `<button>` para ações, não `<div>`
2. **Feedback**: Sempre mostrar estado de loading durante operações assíncronas
3. **Acessibilidade**: Incluir `aria-label` quando ícone sem texto
4. **Tamanho mínimo**: Toque em mobile mínimo 44x44px

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent