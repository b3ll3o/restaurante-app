"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Restaurant } from "@/types";

interface RestaurantContextValue {
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  setActiveRestaurant: (restaurant: Restaurant) => void;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "PediAi_activeRestaurantId";

function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveActiveId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeRestaurant, setActiveRestaurantState] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);

  const supabase = useMemo(() => createClient(), []);

  const refresh = useCallback(async () => {
    if (!mountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use getSession first which is more reliable for current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[RestaurantContext] Session error:", sessionError);
        setError(sessionError.message);
        setIsLoading(false);
        return;
      }

      if (!mountedRef.current) return;

      if (!session || !session.user) {
        console.log("[RestaurantContext] No active session");
        setRestaurants([]);
        setActiveRestaurantState(null);
        setIsLoading(false);
        return;
      }

      const userId = session.user.id;
      console.log("[RestaurantContext] Fetching restaurants for user:", userId);

      // Simple fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const { data: restaurantsData, error: fetchError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_id", userId)
          .order("created_at", { ascending: true })
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (!mountedRef.current) return;

        console.log("[RestaurantContext] Query result:", { 
          count: restaurantsData?.length || 0, 
          fetchError,
          firstRestaurant: restaurantsData?.[0]?.name 
        });

        if (fetchError) {
          console.error("[RestaurantContext] Fetch error:", fetchError);
          setError(fetchError.message);
          setRestaurants([]);
          setActiveRestaurantState(null);
        } else if (restaurantsData && restaurantsData.length > 0) {
          console.log("[RestaurantContext] Found restaurants:", restaurantsData.length);
          setRestaurants(restaurantsData);

          const savedId = loadActiveId();
          if (savedId) {
            const found = restaurantsData.find((r: Restaurant) => r.id === savedId);
            if (found) {
              console.log("[RestaurantContext] Using saved restaurant:", found.name);
              setActiveRestaurantState(found);
            } else {
              console.log("[RestaurantContext] Saved not found, using first:", restaurantsData[0].name);
              setActiveRestaurantState(restaurantsData[0]);
              saveActiveId(restaurantsData[0].id);
            }
          } else {
            console.log("[RestaurantContext] Using first restaurant:", restaurantsData[0].name);
            setActiveRestaurantState(restaurantsData[0]);
            saveActiveId(restaurantsData[0].id);
          }
        } else {
          console.log("[RestaurantContext] No restaurants found");
          setRestaurants([]);
          setActiveRestaurantState(null);
        }
      } catch (fetchErr: unknown) {
        clearTimeout(timeoutId);
        if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
          console.log("[RestaurantContext] Fetch timed out");
          setRestaurants([]);
          setActiveRestaurantState(null);
        } else {
          throw fetchErr;
        }
      }
    } catch (err) {
      console.error("[RestaurantContext] Unexpected error:", err);
      setError("Erro ao carregar restaurantes");
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [supabase]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    mountedRef.current = true;

    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mountedRef.current) {
        refresh();
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - refresh is stable via useCallback

  const setActiveRestaurant = useCallback((restaurant: Restaurant) => {
    setActiveRestaurantState(restaurant);
    saveActiveId(restaurant.id);
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        activeRestaurant,
        setActiveRestaurant,
        isLoading,
        error,
        refresh,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantContextValue {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
