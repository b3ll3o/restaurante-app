# UI Components - MenuLink

## Visão Geral

O módulo **UI Components** (`components/ui/`) contém componentes de interface de usuário baseados no shadcn/ui e Radix UI primitives. Estes componentes são reutilizáveis em toda a aplicação MenuLink.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4 + Radix UI

---

## Estrutura de Diretórios

```
components/ui/
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── AGENTS.md
└── README.md
```

---

## Filosofia de Componentes

### 1. Acessibilidade

Todos os componentes seguem WAI-ARIA guidelines e são construídos sobre Radix UI primitives.

### 2. Customização via Tailwind

Estilos definidos via classes utilitárias do Tailwind, sem CSS fixo ou inline styles.

### 3. Type Safety

Props tipadas com TypeScript strict mode.

### 4. Composição

Componentes são composáveis e extensíveis via props como `asChild` e `className`.

---

## Componentes Disponíveis

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Avatar | `avatar.tsx` | Exibição de imagem com fallback |
| Badge | `badge.tsx` | Tags e status labels |
| Button | `button.tsx` | Botões com variants |
| Card | `card.tsx` | Container para cards |
| Dialog | `dialog.tsx` | Modais e popups |
| Dropdown Menu | `dropdown-menu.tsx` | Menus dropdown |
| Input | `input.tsx` | Campos de texto |
| Label | `label.tsx` | Rótulos para campos |
| Select | `select.tsx` | Seleções dropdown |
| Separator | `separator.tsx` | Linhas separadoras |
| Sheet | `sheet.tsx` | Painéis laterais |
| Switch | `switch.tsx` | Toggles |
| Table | `table.tsx` | Tabelas de dados |
| Tabs | `tabs.tsx` | Abas navegáveis |
| Textarea | `textarea.tsx` | Campos multilinha |

---

## Documentação por Componente

Cada componente possui sua própria documentação no nível de proximidade (`components/ui/{componente}/AGENTS.md`).

Exemplo de estrutura:

```
components/ui/button/
├── button.tsx
└── AGENTS.md  # Documentação detalhada do Button
```

Consulte a documentação individual de cada componente para:
- Props e tipos completos
- Variantes disponíveis
- Exemplos de uso
- Testes unitários

---

## Regras de Implementação

### 1. Composição sobre Herança

```tsx
// ✅ Bom: Composição com children
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>

// ❌ Ruim: Props excessivas
<Card title={title} content={content} footer={footer} />
```

### 2. Type Safety

```typescript
// ✅ Bom: Props tipadas
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
}

// ❌ Ruim: any
interface ButtonProps {
  variant: any;
}
```

### 3. Acessibilidade

```tsx
// ✅ Bom: aria labels
<Button aria-label="Fechar modal">
  <X className="h-4 w-4" />
</Button>

// ❌ Ruim: Sem suporte a screen reader
<Button onClick={handleClose}>
  <X className="h-4 w-4" />
</Button>
```

### 4. Estilização com Tailwind

```tsx
// ✅ Bom: Classes utilitárias
<div className="flex items-center justify-between p-4">

// ❌ Ruim: Estilos inline
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
```

### 5. Responsividade

```tsx
// ✅ Bom: Classes responsivas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Ruim: Sem responsividade
<div className="grid grid-cols-3 gap-4">
```

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Acessibilidade (axe-core) | 0 violações | Crítica |
| Bundle size | <50KB gzipped | Média |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @radix-ui/* | ^1.1.x | Primitives de UI |
| class-variance-authority | ^0.7.1 | Variants |
| clsx | ^2.1.1 | Concatenação de classes |
| tailwind-merge | ^3.5.0 | Merge de classes |
| lucide-react | ^1.8.0 | Ícones |

---

## Referências

- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Versão**: 1.1
**Última Atualização**: 2026-04-17
**Autor**: AI Agent