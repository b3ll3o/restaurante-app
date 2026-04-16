# UI Components - MenuLink

## Visão Geral

O módulo **UI Components** (`components/ui/`) contém componentes de interface de usuário baseados no shadcn/ui e Radix UI primitives. Estes componentes são reutilizáveis em toda a aplicação.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4 + Radix UI

---

## Estrutura de Diretórios

```
components/ui/
├── avatar.tsx       # Avatar com imagem e fallback
├── badge.tsx        # Tag/label colorido
├── button.tsx       # Botão com variants
├── card.tsx         # Container card
├── dialog.tsx       # Modal/dialog
├── dropdown-menu.tsx # Menu dropdown
├── input.tsx        # Campo de texto
├── label.tsx        # Rótulo para campos
├── select.tsx       # Campo de seleção
├── separator.tsx    # Linha separadora
├── sheet.tsx        # Painel lateral
├── switch.tsx       # Toggle switch
├── table.tsx        # Tabela de dados
├── tabs.tsx         # Abas navegáveis
└── textarea.tsx     # Campo de texto multilinha
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

## Componentes

### Button (`button.tsx`)

**Descrição**: Botão interativo com múltiplas variantes.

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

**Variantes**:

| Variante | Uso |
|----------|-----|
| `default` | Ações primárias |
| `destructive` | Ações de perigo/exclusão |
| `outline` | Ações secundárias |
| `secondary` | Ações menos importantes |
| `ghost` | Ações sutis |
| `link` | Links inline |

**Tamanhos**:

| Tamanho | Uso |
|---------|-----|
| `default` | Uso geral |
| `sm` | Botões menores |
| `lg` | Botões de destaque |
| `icon` | Botões de ícone |

**Uso**:
```tsx
import { Button } from '@/components/ui/button';

// Variantes
<Button variant="default">Confirmar</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
<Button size="icon"><Icon /></Button>
```

---

### Input (`input.tsx`)

**Descrição**: Campo de entrada de texto padrão.

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

**Uso**:
```tsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Nome do restaurante" />
<Input type="number" placeholder="Preço" />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Senha" />
<Input type="tel" placeholder="WhatsApp" />
```

---

### Textarea (`textarea.tsx`)

**Descrição**: Campo de texto multilinha.

**Props**:
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
```

**Uso**:
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Descrição do produto..." rows={3} />
```

---

### Label (`label.tsx`)

**Descrição**: Rótulo para campos de formulário.

**Props**:
```typescript
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
```

**Uso**:
```tsx
import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

### Card (`card.tsx`)

**Descrição**: Container card com seções opcionais.

**Componentes**:
- `Card` - Container principal
- `CardHeader` - Cabeçalho
- `CardTitle` - Título
- `CardDescription` - Descrição
- `CardContent` - Conteúdo
- `CardFooter` - Rodapé

**Uso**:
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Pedido #1234</CardTitle>
    <CardDescription>Realizado em 15/04/2026</CardDescription>
  </CardHeader>
  <CardContent>
    <p>3 itens • Total: R$ 45,00</p>
  </CardContent>
  <CardFooter>
    <Button>Confirmar</Button>
  </CardFooter>
</Card>
```

---

### Dialog (`dialog.tsx`)

**Descrição**: Modal/dialog construídos sobre Radix UI Dialog.

**Componentes**:
- `Dialog` - Container
- `DialogTrigger` - Gatilho para abrir
- `DialogContent` - Conteúdo do modal
- `DialogHeader` - Cabeçalho
- `DialogTitle` - Título
- `DialogDescription` - Descrição
- `DialogFooter` - Rodapé
- `DialogClose` - Botão fechar

**Uso**:
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
    </DialogHeader>
    <div className="py-4">Conteúdo...</div>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Sheet (`sheet.tsx`)

**Descrição**: Painel lateral (sheet) construídos sobre Radix UI Dialog.

**Componentes**:
- `Sheet` - Container
- `SheetTrigger` - Gatilho
- `SheetContent` - Conteúdo (painel lateral)
- `SheetHeader` - Cabeçalho
- `SheetTitle` - Título
- `SheetDescription` - Descrição
- `SheetClose` - Botão fechar
- `SheetFooter` - Rodapé

**Uso**:
```tsx
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button>Abrir Carrinho</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Carrinho</SheetTitle>
      <SheetDescription>3 itens no carrinho</SheetDescription>
    </SheetHeader>
    <div className="py-4">Conteúdo...</div>
  </SheetContent>
</Sheet>
```

---

### Table (`table.tsx`)

**Descrição**: Tabela de dados.

**Componentes**:
- `Table` - Container
- `TableHeader` - Cabeçalho
- `TableBody` - Corpo
- `TableFooter` - Rodapé
- `TableRow` - Linha
- `TableHead` - Célula de cabeçalho
- `TableCell` - Célula de dados

**Uso**:
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Produto</TableHead>
      <TableHead>Preço</TableHead>
      <TableHead className="text-right">Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map(product => (
      <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{formatPrice(product.price)}</TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="ghost">Editar</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Badge (`badge.tsx`)

**Descrição**: Tag/label colorido.

**Props**:
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}
```

**Variantes**:

| Variante | Uso |
|----------|-----|
| `default` | Label padrão |
| `secondary` | Label secundário |
| `destructive` | Label de erro/perigo |
| `outline` | Label outline |

**Uso**:
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Pendente</Badge>
<Badge variant="secondary">Confirmado</Badge>
<Badge variant="destructive">Cancelado</Badge>
<Badge variant="outline">Em preparo</Badge>
```

---

### Tabs (`tabs.tsx`)

**Descrição**: Abas navegáveis.

**Componentes**:
- `Tabs` - Container
- `TabsList` - Lista de tabs
- `TabsTrigger` - Tab individual
- `TabsContent` - Conteúdo do tab

**Uso**:
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Conta</TabsTrigger>
    <TabsTrigger value="password">Senha</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Conteúdo da conta</TabsContent>
  <TabsContent value="password">Conteúdo de senha</TabsContent>
</Tabs>
```

---

### Select (`select.tsx`)

**Descrição**: Campo de seleção construídos sobre Radix UI Select.

**Componentes**:
- `Select` - Container
- `SelectTrigger` - Gatilho
- `SelectValue` - Valor selecionado
- `SelectContent` - Lista de opções
- `SelectItem` - Opção individual
- `SelectLabel` - Label do grupo
- `SelectSeparator` - Separador

**Uso**:
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pix">PIX</SelectItem>
    <SelectItem value="dinheiro">Dinheiro</SelectItem>
    <SelectItem value="cartao">Cartão</SelectItem>
  </SelectContent>
</Select>
```

---

### Switch (`switch.tsx`)

**Descrição**: Toggle switch.

**Props**:
```typescript
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}
```

**Uso**:
```tsx
import { Switch } from '@/components/ui/switch';

<Switch checked={enabled} onCheckedChange={setEnabled} />
```

---

### Avatar (`avatar.tsx`)

**Descrição**: Avatar com imagem e fallback.

**Componentes**:
- `Avatar` - Container
- `AvatarImage` - Imagem
- `AvatarFallback` - Fallback (iniciais)

**Uso**:
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="João" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

### Separator (`separator.tsx`)

**Descrição**: Linha separadora.

**Props**:
```typescript
interface SeparatorProps extends React.HrHTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}
```

**Uso**:
```tsx
import { Separator } from '@/components/ui/separator';

<Separator />
<Separator orientation="vertical" className="h-4" />
```

---

### Dropdown Menu (`dropdown-menu.tsx`)

**Descrição**: Menu dropdown construídos sobre Radix UI Dropdown Menu.

**Componentes**:
- `DropdownMenu` - Container
- `DropdownMenuTrigger` - Gatilho
- `DropdownMenuContent` - Menu
- `DropdownMenuItem` - Item
- `DropdownMenuLabel` - Label
- `DropdownMenuSeparator` - Separador
- `DropdownMenuGroup` - Grupo
- `DropdownMenuSub` - Submenu
- `DropdownMenuCheckboxItem` - Checkbox item

**Uso**:
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Abrir Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Perfil</DropdownMenuItem>
    <DropdownMenuItem>Configurações</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

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

```tsx
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

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent