# Card - PediAi

## Visão Geral

**Componente**: `components/ui/card/Card`
**Responsabilidade**: Componente container em formato de card seguindo o design system shadcn/ui
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui

---

## Estrutura de Diretórios

```
components/ui/card/
├── Card.tsx         # Componente Card principal
├── CardHeader.tsx   # Cabeçalho do card
├── CardContent.tsx  # Conteúdo do card
├── CardFooter.tsx   # Rodapé do card
├── CardTitle.tsx    # Título do card
├── CardDescription.tsx # Descrição do card
└── AGENTS.md        # Esta documentação
```

---

## Responsabilidade

Componente container que agrupa conteúdo relacionado em uma superfície elevada. Segue o padrão de composição do shadcn/ui com sub-componentes.

### Composição

| Sub-componente | Responsabilidade |
|----------------|------------------|
| `Card` | Container principal com borda e background |
| `CardHeader` | Cabeçalho do card com padding extra |
| `CardTitle` | Título do card |
| `CardDescription` | Descrição/subtítulo do card |
| `CardContent` | Conteúdo principal do card |
| `CardFooter` | Rodapé do card para ações |

### Props - Card

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### Props - CardHeader

```typescript
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### Props - CardTitle

```typescript
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
```

### Props - CardDescription

```typescript
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
```

### Props - CardContent

```typescript
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### Props - CardFooter

```typescript
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

---

## Arquitetura

```typescript
// components/ui/card/Card.tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Sub-componentes seguem o mesmo padrão
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
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

1. **Composição**: Usar sub-componentes para estrutura consistente
2. **Hierarquia**: CardTitle dentro de CardHeader
3. **Ações**: Usar CardFooter para botões de ação
4. **Responsividade**: Cards em grid com gap adequado

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `components/ui/button/Button.tsx` | Botões dentro do card |
| `components/admin/dashboard/page.tsx` | Uso em dashboard |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent