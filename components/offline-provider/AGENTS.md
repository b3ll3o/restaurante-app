# Offline Provider - PediAi

## Visão Geral

**Arquivo**: `components/offline-provider.tsx`
**Responsabilidade**: Provider que gerencia funcionalidades offline (Service Worker e indicador visual)
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: Next.js 16.2.3 + React 19

---

## Responsabilidade

Este componente é o provider raiz para funcionalidades offline:
1. **Registro do Service Worker** (`/sw.js`)
2. **Renderização do OfflineIndicator** (mostra quando desconectado)
3. **Configuração do Toaster** (notificações suaves)

---

## Interface Pública

```typescript
interface OfflineProviderProps {
  children: React.ReactNode;
}
```

---

## Arquitetura

```
app/layout.tsx
    │
    └── <OfflineProvider>
            │
            ├── Service Worker (/sw.js)
            │       │
            │       ├── Cache de assets estáticos
            │       ├── Cache de imagens (7 dias)
            │       └── Fallback offline para API
            │
            ├── <OfflineIndicator />
            │       │
            │       └── Mostra ícone WiFi-off quando offline
            │
            └── <Toaster />
                    │
                    └── Notificações (Conexão restaurada, Você está offline)
```

---

## Regras de Implementação

1. Service Worker **DEVE** ser registrado após hidratação (useEffect)
2. OfflineIndicator **DEVE** ser renderizado sempre (visível apenas quando offline)
3. Toaster **DEVE** usar `position="bottom-center"` para mobile
4. Notificações **DEVEM** ser suaves (não bloqueantes)

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `public/sw.js` | Service Worker para cache offline |
| `public/manifest.json` | PWA manifest |
| `components/ui/offline-indicator.tsx` | Indicador visual |
| `hooks/useOnlineStatus.ts` | Hook de status de conexão |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Service Worker registrado | 100% | Crítica |
| Notificações suaves | 100% | Alta |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
