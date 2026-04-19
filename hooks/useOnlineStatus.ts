"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/constants";

/**
 * Hook para monitorar status de conexão online/offline
 * Conforme regra Offline-First em .openspec/specs/pediai-rules.md
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true);
      // Toast suave quando reconecta - não bloqueia UI
      toast.success(TOAST_MESSAGES.online, {
        duration: 3000,
        position: "bottom-center",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Toast informativo - não bloqueia UI
      toast.warning(TOAST_MESSAGES.offline, {
        duration: 5000,
        position: "bottom-center",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
