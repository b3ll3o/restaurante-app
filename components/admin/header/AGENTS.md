# Header - MenuLink

## Visão Geral

**Componente**: `components/admin/header/Header`
**Responsabilidade**: Cabeçalho do painel administrativo com informações do usuário e botão de logout
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4

---

## Estrutura de Diretórios

```
components/admin/header/
├── Header.tsx       # Componente Header
└── AGENTS.md        # Esta documentação
```

---

## Responsabilidade

Componente de apresentação que exibe o cabeçalho do painel administrativo. Mostra o email do usuário autenticado e fornece botão para logout.

### Props

```typescript
interface HeaderProps {
  userEmail?: string;
}
```

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `userEmail` | `string` | Não | Email do usuário autenticado. Exibe "Administrador" se não fornecido |

### Estados

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `isLoading` | `boolean` | Indica se logout está em processamento |

### Comportamento

1. Exibe avatar com ícone de usuário
2. Exibe email do usuário ou "Administrador" como fallback
3. Botão "Sair" com ícone LogOut
4. Durante logout: desabilita botão e mostra estado de loading

---

## Arquitetura

```typescript
// components/admin/header/Header.tsx
export function Header({ userEmail }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-card">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm font-medium">
          {userEmail || "Administrador"}
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isLoading}>
        <LogOut className="h-4 w-4" />
        {isLoading ? "Saindo..." : "Sair"}
      </Button>
    </header>
  );
}
```

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| `lucide-react` | ^1.8.0 | Ícones User, LogOut |
| `@/components/ui/button` | - | Componente Button |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Acessibilidade | WCAG 2.1 AA | Alta |

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `app/admin/layout.tsx` | Usa este componente |
| `components/admin/sidebar/Sidebar.tsx` | Componente irmão de navegação |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-16
**Autor**: AI Agent