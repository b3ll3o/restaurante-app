"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * Indicador visual de status offline
 * Mostra ícone WiFi-off quando desconectado
 * Conforme regra Offline-First em opencode/openspec/specs/pediai-rules.md
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-destructive-foreground shadow-lg animate-in fade-in slide-in-from-bottom-4"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline</span>
    </div>
  );
}
