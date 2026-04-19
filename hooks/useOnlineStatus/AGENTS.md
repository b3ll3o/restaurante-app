# useOnlineStatus - PediAi

## Visão Geral

**Arquivo**: `hooks/useOnlineStatus.ts`
**Responsabilidade**: Hook que monitora status de conexão online/offline
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript

---

## Responsabilidade

Monitora o estado de conexão do navegador usando `navigator.onLine` e eventos `online`/`offline`. Dispara notificações suaves quando o estado muda.

---

## Interface Pública

```typescript
function useOnlineStatus(): boolean
// Retorna true se online, false se offline
```

---

## Arquitetura

```typescript
// Estado interno
const [isOnline, setIsOnline] = useState(true);

// Eventos
window.addEventListener("online", handleOnline)  // setIsOnline(true) + toast
window.addEventListener("offline", handleOffline) // setIsOnline(false) + toast

// Cleanup no unmount
return () => {
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
};
```

---

## Regras de Implementação

1. **DEVE** verificar `typeof window` para SSR safety
2. **DEVE** inicializar com `navigator.onLine` atual
3. **DEVE** usar `toast.success` quando reconecta
4. **DEVE** usar `toast.warning` quando desconecta
5. **DEVE** fazer cleanup dos event listeners

---

## Uso

```typescript
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

function MyComponent() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {isOnline ? "Online" : "Offline"}
    </div>
  );
}
```

---

## Arquivos Relacionados

| Arquivo | Relação |
|---------|---------|
| `components/ui/offline-indicator.tsx` | Usa este hook |
| `components/offline-provider.tsx` | Provedor raiz |

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| SSR Safety | 100% | Crítica |
| Cleanup correto | 100% | Crítica |

---

**Versão**: 1.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent
