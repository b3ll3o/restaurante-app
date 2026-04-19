# Utils - PediAi

## Visão Geral

**Módulo**: `lib/utils`
**Responsabilidade**: Funções utilitárias puras para formatação, validação e transformação de dados
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + TypeScript (strict) + Tailwind CSS 4

---

## Estrutura de Diretórios

```
lib/utils/
├── utils.ts  # Funções utilitárias exportadas
└── AGENTS.md # Esta documentação
```

---

## Interface Pública

| Função | Assinatura | Descrição |
|--------|------------|-----------|
| `cn` | `(...inputs: ClassValue[]) => string` | Merge de classes CSS Tailwind |
| `formatPrice` | `(price: number) => string` | Formata preço em BRL |
| `generateSlug` | `(text: string) => string` | Converte texto para slug URL-friendly |
| `isValidWhatsApp` | `(phone: string) => boolean` | Valida formato brasileiro (10-13 dígitos) |
| `isValidPrice` | `(price: number) => boolean` | Valida preço > 0 |
| `isValidName` | `(name: string) => boolean` | Valida nome com mínimo 2 caracteres |

---

## Funções Exportadas

### cn(...inputs: ClassValue[]) => string

Merge de classes CSS Tailwind com deduplicação.

**Dependências**: `clsx` + `tailwind-merge`

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

### formatPrice(price: number) => string

Formata número para padrão brasileiro (BRL).

```typescript
import { formatPrice } from "@/lib/utils";

formatPrice(29.90);
// → "R$ 29,90"

formatPrice(1000);
// → "R$ 1.000,00"
```

### generateSlug(text: string) => string

Converte texto para slug URL-friendly.

```typescript
import { generateSlug } from "@/lib/utils";

generateSlug("Picanha Frida's - Especial");
// → "picanha-frida-s-especial"

generateSlug("ação & café 100%!");
// → "acao-cafe-100"
```

### isValidWhatsApp(phone: string) => boolean

Valida número de WhatsApp brasileiro (10-13 dígitos após limpeza).

```typescript
import { isValidWhatsApp } from "@/lib/utils";

isValidWhatsApp("11999999999");      // → true (mínimo 11 dígitos)
isValidWhatsApp("5511999999999");    // → true (com DDI)
isValidWhatsApp("999999999");        // → false (9 dígitos)
isValidWhatsApp("(11) 99999-9999");  // → true (mascara ignorada)
```

### isValidPrice(price: number) => boolean

Valida que preço é maior que zero.

```typescript
import { isValidPrice } from "@/lib/utils";

isValidPrice(29.90);  // → true
isValidPrice(0);      // → false
isValidPrice(-5);     // → false
```

### isValidName(name: string) => boolean

Valida nome com mínimo de 2 caracteres (sem espaços).

```typescript
import { isValidName } from "@/lib/utils";

isValidName("Maria");     // → true
isValidName("Jo");        // → true (2 chars)
isValidName("J");         // → false (1 char)
isValidName("   ");       // → false (só espaços)
isValidName("");          // → false (vazio)
```

---

## Regras de Implementação

1. **Funções Puras**: Sem side effects, mesmo input = mesmo output
2. **Type Safety**: Tipos explícitos em todas as funções (strict mode)
3. **Validação no Domínio**: Regras de negócio ficam aqui, não em componentes
4. **Nomenclatura**: Funções de validação começam com `isValid`
5. **Sem Dependências de Estado**: Não acessam localStorage, cookies ou API

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Complexidade ciclomática | ≤3 | Alta |
| Linhas por função | ≤15 | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| `clsx` | ^2.1.1 | Concatenação condicional de classes |
| `tailwind-merge` | ^3.5.0 | Merge com deduplicação |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `components/ui/*` | Todos usam `cn()` |
| `components/admin/*` | Todos usam `cn()` |
| `context/cart-context.tsx` | Usa `formatPrice()` |
| `app/menu/[slug]/page.tsx` | Usa `generateSlug()` |

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent