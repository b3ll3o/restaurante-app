"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar, SidebarContent } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // ✅ useMemo para referência estável
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // ✅ Verificação NO INÍCIO para evitar redirect loop
    if (typeof window !== "undefined" && window.location.pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise<{ data: { session: null }, error: Error }>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
          ),
        ]).catch(() => ({ data: { session: null }, error: null }));

        if (!session) {
          router.push("/admin/login");
          return;
        }

        setUserEmail(session.user.email);
      } catch {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
    // ✅ REMOVIDO: supabase.auth da dependency array
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar - visible on lg+ (≥1024px) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile/tablet drawer - visible on < 1024px */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent onClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          userEmail={userEmail}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}