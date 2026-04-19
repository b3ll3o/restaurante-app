# Spec: Documentation Proximity - AGENTS.md com Proximidade

## Fonte da Verdade

Este documento é parte das especificações do MenuLink e define os requisitos para reorganização de documentação.

---

## ADDED Requirements

### REQ-DP-001: AGENTS.md de Components

O sistema DEVE criar AGENTS.md no nível de cada componente que documenta.

#### Cenário: AGENTS.md de Header
- **GIVEN** o componente `components/admin/header/Header.tsx`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `components/admin/header/AGENTS.md` com: responsabilidade, props, estados, arquitetura, métricas de qualidade

#### Cenário: AGENTS.md de Sidebar
- **GIVEN** o componente `components/admin/sidebar/Sidebar.tsx`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `components/admin/sidebar/AGENTS.md`

#### Cenário: AGENTS.md de Button
- **GIVEN** o componente `components/ui/button/Button.tsx`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `components/ui/button/AGENTS.md` com: props, variantes, tamanhos, estados

#### Cenário: AGENTS.md de Input
- **GIVEN** o componente `components/ui/input/Input.tsx`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `components/ui/input/AGENTS.md`

#### Cenário: AGENTS.md de Card
- **GIVEN** o componente `components/ui/card/Card.tsx`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `components/ui/card/AGENTS.md` com: composição (Card, CardHeader, CardContent, CardFooter)

---

### REQ-DP-002: AGENTS.md de Context

O sistema DEVE criar AGENTS.md no nível do contexto que documenta.

#### Cenário: AGENTS.md de CartContext
- **GIVEN** o contexto `context/cart-context.tsx`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `context/cart-context/AGENTS.md` com: responsabilidade, interface pública (addItem, removeItem, updateQuantity, clearCart, getTotal), persistência localStorage

---

### REQ-DP-003: AGENTS.md de Lib

O sistema DEVE criar AGENTS.md no nível de cada utilitário que documenta.

#### Cenário: AGENTS.md de Supabase Client
- **GIVEN** `lib/supabase/client.ts`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `lib/supabase/client/AGENTS.md` com: createBrowserClient, uso em componentes client

#### Cenário: AGENTS.md de Supabase Server
- **GIVEN** `lib/supabase/server.ts`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `lib/supabase/server/AGENTS.md` com: createServerClient, uso em Server Components e API routes

#### Cenário: AGENTS.md de WhatsApp
- **GIVEN** `lib/whatsapp.ts`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `lib/whatsapp/AGENTS.md` com: formatOrderMessage, generateWhatsAppUrl

#### Cenário: AGENTS.md de Utils
- **GIVEN** `lib/utils.ts`
- **WHEN** a documentação é criada
- **THEN** o sistema DEVE criar `lib/utils/AGENTS.md` com: cn(), funções utilitárias

---

### REQ-DP-004: settings.feature BDD

O sistema DEVE criar arquivo BDD para configurações do admin.

#### Cenário: Cenários BDD de Settings
- **GIVEN** a funcionalidade de configurações
- **WHEN** os cenários são documentados
- **THEN** o sistema DEVE criar `app/admin/settings/settings.feature` com: visualização de dados, edição, validação, cópia de link

---

### REQ-DP-005: Tags @integration-test

O sistema DEVE garantir que todos os arquivos .feature tenham tag @integration-test.

#### Cenário: Tag em settings.feature
- **GIVEN** `app/admin/settings/settings.feature`
- **WHEN** o arquivo é criado
- **THEN** o sistema DEVE incluir `@integration-test="tests/integration/settings.test.ts"`

---

## Critérios de Aceitação

### CA-DP-001: AGENTS.md de Components
Todos os AGENTS.md de components DEVEM estar criados em:
- `components/admin/header/AGENTS.md`
- `components/admin/sidebar/AGENTS.md`
- `components/ui/button/AGENTS.md`
- `components/ui/input/AGENTS.md`
- `components/ui/card/AGENTS.md`

### CA-DP-002: AGENTS.md de Context
`context/cart-context/AGENTS.md` DEVE estar criado.

### CA-DP-003: AGENTS.md de Lib
Todos os AGENTS.md de lib DEVEM estar criados em:
- `lib/supabase/client/AGENTS.md`
- `lib/supabase/server/AGENTS.md`
- `lib/whatsapp/AGENTS.md`
- `lib/utils/AGENTS.md`

### CA-DP-004: settings.feature
`app/admin/settings/settings.feature` DEVE existir com tags @integration-test.

---

## Status Especificação

**Versão:** 1.0
**Data:** 2026-04-16
**Autor:** AI Agent
**Status:** Rascunho