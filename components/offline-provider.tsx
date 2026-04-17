"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

/**
 * Provider de funcionalidades offline
 * - Registra Service Worker
 * - Renderiza indicador de status online/offline
 * - Configura Toaster para notificações
 * Conforme regra Offline-First em .openspec/specs/menulink-rules.md
 */
export function OfflineProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Registra Service Worker após hidratação
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration.scope);
        })
        .catch((error) => {
          console.warn("Erro ao registrar Service Worker:", error);
        });
    }
  }, []);

  return (
    <>
      {children}
      <OfflineIndicator />
      <Toaster
        position="bottom-center"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </>
  );
}
