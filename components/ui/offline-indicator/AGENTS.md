# OfflineIndicator - MenuLink

## Visão Geral

**Arquivo**: `components/ui/offline-indicator.tsx`
**Responsabilidade**: Indicador visual que mostra quando o usuário está offline
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript + Tailwind CSS 4

---

## Responsabilidade

Renderiza um indicador visual fixo na parte inferior da tela quando o dispositivo está offline. Usa o hook `useOnlineStatus` para detectar o estado de conexão.

---

## Interface Pública

```typescript
// Não possui props - usa useOnlineStatus internamente
// Retorna null se online, div fixa se offline
```

---

## Arquitetura

```
OfflineIndicator
    │
    └── useOnlineStatus() → boolean
            │
            ├── true (online) → retorna null (não renderiza)
            │
            └── false (offline) → renderiza indicador
                    │
                    └── <div> WiFi-off + "Offline"
```

---

## Visual

```
┌─────────────────────────────────┐
│                                 │
│         Conteúdo da página       │
│                                 │
│                                 │
├─────────────────────────────────┤
│      🔴 Offline (fixo embaixo)   │
└─────────────────────────────────┘
```

---

## Regras de Implementação

1. **DEVE** usar `useOnlineStatus` para detectar estado
2. **DEVE** retornar `null` quando online (não renderizar nada)
3. **DEVE** usar `position: fixed` e `z-50`
4. **DEVE** ter `role="status"` e `aria-live="polite"` para acessibilidade
5. **DEVE** usar animações suaves (animate-in)

---

## Props/Estados

| Estado | Renderização |
|--------|--------------|
| Online | `null` (não renderiza) |
| Offline | Indicador fixo com ícone e texto |

---

## Uso

```typescript
// Já incluso no OfflineProvider (components/offline-provider.tsx)
// Não precisa usar manualmente

import { OfflineIndicator } from "@/components/ui/offline-indicator";

// Em um componente qualquer
<OfflineIndicator />
```

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `hooks/useOnlineStatus.ts` | Hook que detecta online/offline |
| `components/offline-provider.tsx` | Provider que renderiza este componente |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Acessibilidade (ARIA) | 100% | Crítica |
| Animação suave | 100% | Média |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
