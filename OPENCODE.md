# OPENCODE.md - MenuLink

## Visão Geral

Este arquivo configura o ambiente OpenCode para o projeto MenuLink.

**Idioma**: Português Brasileiro (pt-BR)  
**Stack**: Next.js 16.2.3 + React 19 + TypeScript + Tailwind CSS 4 + Supabase

---

## Configuração Principal

A configuração detalhada do projeto está em [AGENTS.md](./AGENTS.md) (raiz do projeto).

### Variáveis de Ambiente Obrigatórias

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

### Path Aliases

- `@/*` → `./` (raiz do projeto)

---

## Documentação de Referência

Toda a documentação do projeto está organizada com a **REGRA DE PROXIMIDADE** (documentação junto ao código).

### Documentação Central (Source of Truth)

| Documento | Descrição |
|-----------|-----------|
| [AGENTS.md](./AGENTS.md) | **PRINCIPAL** - Visão geral, regras, workflows SDD |
| [README.md](./README.md) | Visão geral do produto |
| [.openspec/AGENTS.md](./.openspec/AGENTS.md) | SDD workflow e especificações |
| [.openspec/specs/menulink-rules.md](./.openspec/specs/menulink-rules.md) | **FONTE CENTRALIZADA** de todas as regras |
| [.openspec/specs/menulink-specification.md](./.openspec/specs/menulink-specification.md) | Requisitos RFC 2119 |
| [.openspec/specs/menulink-technical-plan.md](./.openspec/specs/menulink-technical-plan.md) | Arquitetura técnica |

### Módulos (documentação junto ao código)

```
app/AGENTS.md                          # App Router
components/AGENTS.md                   # Componentes UI e Admin
lib/AGENTS.md                          # Utils, Supabase, WhatsApp
context/AGENTS.md                      # Carrinho (CartContext)
hooks/AGENTS.md                        # Custom hooks
types/AGENTS.md                        # Definições TypeScript
tests/AGENTS.md                        # Infraestrutura de testes
supabase/AGENTS.md                     # Schema e migrations
```

### Backlog e Changes

| Documento | Descrição |
|-----------|-----------|
| [.openspec/backlog/backlog.md](./.openspec/backlog/backlog.md) | Índice de PRDs e changes |
| [.openspec/backlog/AGENTS.md](./.openspec/backlog/AGENTS.md) | Regras do backlog |
| [.openspec/changes/AGENTS.md](./.openspec/changes/AGENTS.md) | Regras das changes |

---

## Padrões de Código

### Idioma

- **Documentação**: Português Brasileiro (pt-BR)
- **Código**: Inglês para identificadores
- **Comentários**: Português brasileiro para lógica complexa

### Convenções

1. Strict TypeScript (`strict: true`)
2. No `tailwind.config.js` (Tailwind 4 via CSS)
3. Server Components por padrão no admin
4. Client Components apenas quando necessário (`use client`)

---

## Referências

- [AGENTS.md](./AGENTS.md) - Visão geral do projeto (Source of Truth)
- [.openspec/specs/menulink-rules.md](./.openspec/specs/menulink-rules.md) - Regras centralizadas

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent