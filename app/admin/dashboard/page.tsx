"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/context/RestaurantContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Package,
  TrendingUp,
  Clock,
  Plus,
  AlertCircle,
} from "lucide-react";

interface Stats {
  categories: number;
  products: number;
  pendingOrders: number;
  todayOrders: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { activeRestaurant, restaurants, isLoading: restaurantLoading } = useRestaurant();
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    products: 0,
    pendingOrders: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Don't fetch if no restaurant selected
    if (!activeRestaurant) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split("T")[0];
      const restaurantId = activeRestaurant.id;

      try {
        // Fetch categories for this restaurant
        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
          .select("id")
          .eq("restaurant_id", restaurantId);

        if (catError) throw catError;

        const categoryIds = categoriesData?.map((c: { id: string }) => c.id) || [];

        // Fetch products for these categories
        let productsCount = 0;
        if (categoryIds.length > 0) {
          const { count } = await supabase
            .from("products")
            .select("id", { count: "exact" })
            .in("category_id", categoryIds);
          productsCount = count || 0;
        }

        // Fetch pending orders
        const { count: pendingCount } = await supabase
          .from("orders")
          .select("id", { count: "exact" })
          .eq("restaurant_id", restaurantId)
          .eq("status", "pending");

        // Fetch today's orders
        const { count: todayCount } = await supabase
          .from("orders")
          .select("id", { count: "exact" })
          .eq("restaurant_id", restaurantId)
          .gte("created_at", today);

        // Fetch recent orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          categories: categoriesData?.length || 0,
          products: productsCount,
          pendingOrders: pendingCount || 0,
          todayOrders: todayCount || 0,
        });

        if (ordersData) {
          setRecentOrders(ordersData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeRestaurant, supabase]);

  // No restaurant created yet
  if (!restaurantLoading && restaurants.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu restaurante
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Nenhum restaurante cadastrado</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Para acessar o dashboard, você precisa primeiro cadastrar um restaurante.
            </p>
            <Button asChild>
              <a href="/admin/settings">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Restaurante
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No restaurant selected (user has multiple)
  if (!restaurantLoading && !activeRestaurant && restaurants.length > 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selecione um restaurante para visualizar o dashboard
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Use o seletor de restaurante na barra lateral para escolher um restaurante.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-4" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      cancelled: "destructive",
    };
    const labels: Record<string, string> = {
      pending: "Pendente",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
    };
    return (
      <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu restaurante
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">
              Cardápio cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">
              Itens no cardápio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total de pedidos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos pedidos recebidos</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum pedido ainda
            </p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(order.created_at)} • {formatPrice(order.total)}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}