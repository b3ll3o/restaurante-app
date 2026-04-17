# Input - MenuLink

## Visão Geral

**Componente**: `components/ui/input/Input`
**Responsabilidade**: Componente base de campo de entrada de texto seguindo o design system shadcn/ui
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui

---

## Estrutura de Diretórios

```
components/ui/input/
├── Input.tsx        # Componente Input
└── AGENTS.md        # Esta documentação
```

---

## Responsabilidade

Componente de campo de entrada de texto reutilizável que segue o design system do projeto. Suporta todos os tipos nativos de input HTML.

### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

Herda todas as props do `HTMLInputElement`, incluindo:

| Prop | Tipo | Descrição |
|------|------|-----------|
| `type` | `string` | Tipo do input (text, email, password, number, etc.) |
| `placeholder` | `string` | Texto placeholder |
| `value` | `string` | Valor controlado |
| `onChange` | `function` | Handler de mudança |
| `disabled` | `boolean` | Desabilita o campo |
| `required` | `boolean` | Campo obrigatório |
| `id` | `string` | ID para label association |
| `name` | `string` | Nome do campo para form |

### Estados

| Estado | Comportamento visual |
|--------|---------------------|
| `default` | Borda cinza, fundo transparente |
| `focus` | Borda primária, ring de foco |
| `disabled` | Background muted, cursor not-allowed |
| `error` | Borda vermelha (via className externo) |
| `valid` | Borda verde (via className externo) |

---

## Arquitetura

```typescript
// components/ui/input/Input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| `react` | 19.2.4 | Biblioteca React |
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

1. **Label**: Sempre usar `<label>` associado com `htmlFor`
2. **Placeholder**: Não usar como substituto de label
3. **Validação**: Mostrar mensagens de erro abaixo do campo
4. **Tipo correto**: Usar `type="email"`, `type="tel"`, etc. para mobile keyboard

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `components/ui/label/Label.tsx` | Label associado |
| `components/ui/form/Form.tsx` | Formulários com validação |
| `lib/utils.ts` | Função cn() |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent