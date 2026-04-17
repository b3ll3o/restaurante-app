# Utils - MenuLink

## Visão Geral

**Módulo**: `lib/utils`
**Responsabilidade**: Funções utilitárias reutilizáveis em todo o projeto
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + TypeScript + Tailwind CSS 4

---

## Estrutura de Diretórios

```
lib/utils/
├── utils.ts           # Funções utilitárias
└── AGENTS.md          # Esta documentação
```

---

## Responsabilidade

Fornece funções utilitárias para manipulação de classes CSS, formatação e validações.

### Interface Pública

```typescript
function cn(...classes: (string | undefined | null | false)[]): string;
```

---

## Arquitetura

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Dependências

| Função | Pacote | Uso |
|--------|--------|-----|
| `clsx` | clsx | Concatenação condicional de classes |
| `twMerge` | tailwind-merge | Merge de classes Tailwind |

---

## Uso

```typescript
import { cn } from "@/lib/utils";

// Uso básico
cn("px-2", "py-1", "bg-red", "hover:bg-dark-red");
// → "px-2 py-1 bg-red hover:bg-dark-red"

// Uso condicional
cn(
  "px-4 py-2",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
);
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `components/ui/*` | Todos usam cn() |
| `components/admin/*` | Todos usam cn() |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent