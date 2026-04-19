"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { useState, useMemo } from "react";

interface HeaderProps {
  userEmail?: string;
  onMenuClick?: () => void;
}

export function Header({ userEmail, onMenuClick }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between h-14 sm:h-16 px-2 sm:px-4 md:px-6 border-b bg-card shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden touch-target h-10 w-10"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium truncate">{userEmail || "Administrador"}</p>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={isLoading}
        className="gap-2 touch-target"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </header>
  );
}