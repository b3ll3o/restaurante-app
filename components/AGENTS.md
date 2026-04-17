# Components - MenuLink

## Visão Geral

O módulo **Components** contém todos os componentes React reutilizáveis da aplicação MenuLink. O módulo é dividido em dois sub-módulos principais: `ui/` (componentes de interface baseados em shadcn/ui) e `admin/` (componentes específicos do painel administrativo).

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4 + Radix UI

---

## Estrutura de Diretórios

```
components/
├── ui/                          # Componentes base (shadcn/ui)
│   ├── AGENTS.md               # Documentação detalhada dos componentes UI
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   └── textarea.tsx
└── admin/                       # Componentes do admin
    ├── AGENTS.md               # Documentação detalhada dos componentes admin
    ├── header.tsx
    └── sidebar.tsx
```

---

## Sub-módulo: UI Components (`components/ui/`)

Fornece componentes de interface de usuário reutilizáveis, acessíveis e estilizáveis baseados no shadcn/ui e Radix UI primitives.

### Componentes Disponíveis

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

### Filosofia

1. **Acessibilidade**: Todos os componentes seguem WAI-ARIA guidelines
2. **Customização**: Estilos via Tailwind CSS, sem CSS fixo
3. **Type Safety**: Props tipadas com TypeScript strict
4. **Composição**: Componentes são composáveis e extensíveis

### Documentação Detalhada

Cada componente UI possui seu próprio `AGENTS.md` em `components/ui/` com:
- Props e tipos completos
- Exemplos de uso
- Implementação técnica
- Testes unitários

---

## Sub-módulo: Admin Components (`components/admin/`)

Componentes específicos para o painel administrativo.

### Componentes Disponíveis

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Header | `header.tsx` | Cabeçalho com menu mobile e logout |
| Sidebar | `sidebar.tsx` | Menu lateral de navegação |

### Documentação Detalhada

Cada componente admin possui seu próprio `AGENTS.md` em `components/admin/` com:
- Props e tipos completos
- Exemplos de uso
- Implementação técnica
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

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| @radix-ui/* | ^1.1.x | Primitives de UI |
| class-variance-authority | ^0.7.1 | Variants |
| clsx | ^2.1.1 | Concatenação de classes |
| tailwind-merge | ^3.5.0 | Merge de classes |
| lucide-react | ^1.8.0 | Ícones |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Acessibilidade (axe-core) | 0 violações | Crítica |
| Bundle size | <50KB gzipped | Média |

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