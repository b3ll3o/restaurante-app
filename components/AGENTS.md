# Components - MenuLink

## Visão Geral

O módulo **Components** contém todos os componentes React reutilizáveis da aplicação MenuLink. O módulo é dividido em dois sub-módulos principais: `ui/` (componentes de interface baseados em shadcn/ui) e `admin/` (componentes específicos do painel administrativo).

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: React 19 + TypeScript (strict) + Tailwind CSS 4 + Radix UI

---

## Estrutura de Diretórios

```
components/
├── ui/                         # Componentes base (shadcn/ui)
│   ├── avatar.tsx             # Componente de avatar
│   ├── badge.tsx              # Componente de badge/tag
│   ├── button.tsx             # Componente de botão
│   ├── card.tsx               # Componente de card
│   ├── dialog.tsx             # Componente de modal/dialog
│   ├── dropdown-menu.tsx      # Menu dropdown
│   ├── input.tsx              # Campo de entrada de texto
│   ├── label.tsx              # Rótulo para campos
│   ├── select.tsx             # Campo de seleção
│   ├── separator.tsx          # Linha separadora
│   ├── sheet.tsx              # Painel lateral (sheet)
│   ├── switch.tsx             # Toggle switch
│   ├── table.tsx              # Tabela de dados
│   ├── tabs.tsx               # Abas navegáveis
│   └── textarea.tsx           # Campo de texto multilinha
└── admin/                      # Componentes do admin
    ├── header.tsx             # Cabeçalho do admin
    └── sidebar.tsx            # Menu lateral do admin
```

---

## Sub-módulo: UI Components (`components/ui/`)

### Responsabilidade

Fornecer componentes de interface de usuário reutilizáveis, acessíveis e estilizáveis baseados no shadcn/ui e Radix UI primitives.

### Filosofia

1. **Acessibilidade**: Todos os componentes seguem WAI-ARIA guidelines
2. **Customização**: Estilos via Tailwind CSS, sem CSS fixo
3. **Type Safety**: Props tipadas com TypeScript strict
4. **Composição**: Componentes são composáveis e extensíveis

### Componentes Disponíveis

#### Button (`button.tsx`)

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean; // Usa Slot do Radix para composição
}
```

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
<Button size="icon">Ícone</Button>
```

**Implementação**:
```typescript
// CVA (Class Variance Authority) para variants
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

#### Input (`input.tsx`)

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
```

#### Card (`card.tsx`)

**Componentes**:
- `Card`: Container principal
- `CardHeader`: Cabeçalho do card
- `CardTitle`: Título
- `CardDescription`: Descrição
- `CardContent`: Conteúdo
- `CardFooter`: Rodapé

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

#### Dialog (`dialog.tsx`)

**Componentes**:
- `Dialog`: Container
- `DialogTrigger`: Gatilho para abrir
- `DialogContent`: Conteúdo do modal
- `DialogHeader`: Cabeçalho
- `DialogTitle`: Título
- `DialogDescription`: Descrição
- `DialogFooter`: Rodapé
- `DialogClose`: Botão de fechar

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
  </DialogContent>
</Dialog>
```

#### Table (`table.tsx`)

**Componentes**:
- `Table`: Container da tabela
- `TableHeader`: Cabeçalho
- `TableBody`: Corpo
- `TableFooter`: Rodapé
- `TableRow`: Linha
- `TableHead`: Célula de cabeçalho
- `TableCell`: Célula de dados

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

#### Badge (`badge.tsx`)

**Props**:
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

**Uso**:
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Pendente</Badge>
<Badge variant="secondary">Confirmado</Badge>
<Badge variant="destructive">Cancelado</Badge>
<Badge variant="outline">Em preparo</Badge>
```

#### Tabs (`tabs.tsx`)

**Componentes**:
- `Tabs`: Container
- `TabsList`: Lista de tabs
- `TabsTrigger`: Tab individual
- `TabsContent`: Conteúdo do tab

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

#### Select (`select.tsx`)

**Componentes**:
- `Select`: Container
- `SelectTrigger`: Gatilho
- `SelectValue`: Valor selecionado
- `SelectContent`: Lista de opções
- `SelectItem`: Opção individual
- `SelectLabel`: Label do grupo
- `SelectSeparator`: Separador

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

#### Sheet (`sheet.tsx`)

**Componentes** (similar a Dialog):
- `Sheet`: Container
- `SheetTrigger`: Gatilho
- `SheetContent`: Conteúdo (painel lateral)
- `SheetHeader`: Cabeçalho
- `SheetTitle`: Título
- `SheetDescription`: Descrição
- `SheetClose`: Botão fechar
- `SheetFooter`: Rodapé

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

#### Dropdown Menu (`dropdown-menu.tsx`)

**Componentes**:
- `DropdownMenu`: Container
- `DropdownMenuTrigger`: Gatilho
- `DropdownMenuContent`: Menu
- `DropdownMenuItem`: Item
- `DropdownMenuLabel`: Label
- `DropdownMenuSeparator`: Separador
- `DropdownMenuGroup`: Grupo de itens
- `DropdownMenuSub`: Submenu
- `DropdownMenuCheckboxItem`: Checkbox item

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

#### Switch (`switch.tsx`)

**Props**:
```typescript
interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

**Uso**:
```tsx
import { Switch } from '@/components/ui/switch';

<Switch checked={enabled} onCheckedChange={setEnabled} />
```

#### Separator (`separator.tsx`)

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

#### Label (`label.tsx`)

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

#### Textarea (`textarea.tsx`)

**Props**:
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
```

**Uso**:
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Descrição do produto..." />
```

#### Avatar (`avatar.tsx`)

**Componentes**:
- `Avatar`: Container
- `AvatarImage`: Imagem
- `AvatarFallback`: Fallback (iniciais)

**Uso**:
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="João" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Sub-módulo: Admin Components (`components/admin/`)

### Responsabilidade

Componentes específicos para o painel administrativo.

### Header (`header.tsx`)

**Responsabilidade**: Cabeçalho do painel admin com menu mobile e logout.

**Props**: Nenhuma (usa contexto de auth)

**Funcionalidades**:
- Logo/Nome do restaurante
- Menu hamburger para mobile
- Botão de logout
- Informações do usuário logado

**Implementação**:
```typescript
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">MenuLink</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/categories">Categorias</Link>
          <Link href="/admin/products">Produtos</Link>
          <Link href="/admin/orders">Pedidos</Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/admin/categories" onClick={() => setMobileMenuOpen(false)}>
              Categorias
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="justify-start">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
```

### Sidebar (`sidebar.tsx`)

**Responsabilidade**: Menu lateral de navegação do admin.

**Funcionalidades**:
- Navegação entre páginas
- Indicador de página ativa
- Links para todas as seções do admin

**Implementação**:
```typescript
export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categorias', icon: FolderTree },
    { href: '/admin/products', label: 'Produtos', icon: Package },
    { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
    { href: '/admin/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-background hidden md:block">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
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

## Testes

### Testes Unitários
- Renderização de cada componente
- Props e variants
- Interações (clicks, hovers)

### Testes de Componente
- Composição de componentes
- Estados (loading, disabled, error)
- Acessibilidade

### Testes E2E
- Fluxos de interação completos
- Responsividade em diferentes viewports

---

## Referências

- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Versão**: 1.0  
**Última Atualização**: 2026-04-15  
**Autor**: AI Agent