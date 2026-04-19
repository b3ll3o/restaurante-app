"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar, SidebarContent } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RestaurantProvider } from "@/context/RestaurantContext";

const PUBLIC_PATHS = ["/admin/login", "/admin/signup"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mountedRef = useRef(true);
  const authCheckedRef = useRef(false);

  const supabase = useMemo(() => createClient(), []);

  const isPublicPath = PUBLIC_PATHS.includes(pathname || "");

  useEffect(() => {
    if (!mountedRef.current) return;

    // For public paths, just set loading false immediately
    if (isPublicPath) {
      setIsAuthLoading(false);
      authCheckedRef.current = true;
      return;
    }

    // For protected paths, check auth
    if (authCheckedRef.current) return;
    authCheckedRef.current = true;
    setIsAuthLoading(true);

    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        setIsAuthLoading(false);
        router.push("/admin/login");
      }
    }, 10000);

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mountedRef.current) return;

        if (error || !session) {
          clearTimeout(timeoutId);
          router.push("/admin/login");
          return;
        }

        clearTimeout(timeoutId);
        setUserEmail(session.user.email);
      } catch (err) {
        console.error("Auth check failed:", err);
        clearTimeout(timeoutId);
        if (mountedRef.current) {
          router.push("/admin/login");
        }
      } finally {
        if (mountedRef.current) {
          setIsAuthLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && mountedRef.current) {
        router.push("/admin/login");
      }
    });

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
      authCheckedRef.current = false;
    };
  }, [router, supabase, isPublicPath]);

  // For public paths, render directly without auth check or RestaurantProvider
  if (isPublicPath) {
    return <>{children}</>;
  }

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <RestaurantProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 sm:w-80">
            <SidebarContent onClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header
            userEmail={userEmail}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </RestaurantProvider>
  );
}