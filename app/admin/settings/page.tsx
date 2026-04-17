"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Link as LinkIcon } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  owner_whatsapp: string;
  slug: string;
}

interface AlertMessage {
  type: "success" | "error";
  message: string;
}

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    owner_whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: restaurantData, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_id", user.id)
          .single();

        if (!error && restaurantData) {
          setRestaurant(restaurantData);
          setFormData({
            name: restaurantData.name,
            owner_whatsapp: restaurantData.owner_whatsapp,
          });
        }
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, [supabase]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSave = async () => {
    if (!restaurant) return;

    setSaving(true);

    const { error } = await supabase
      .from("restaurants")
      .update({
        name: formData.name,
        owner_whatsapp: formData.owner_whatsapp,
      })
      .eq("id", restaurant.id);

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({ type: "success", message: "Configurações salvas" });
    }

    setSaving(false);
  };

  const menuUrl = restaurant
    ? `${window.location.origin}/menu/${restaurant.slug}`
    : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alert && (
        <div
          className={`p-4 rounded-md ${
            alert.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as informações do seu restaurante
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações do Restaurante
          </CardTitle>
          <CardDescription>
            Atualize os dados do seu restaurante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Restaurante</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nome do restaurante"
              className="min-h-[44px] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp para Pedidos</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.owner_whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, owner_whatsapp: e.target.value })
              }
              placeholder="+5511999999999"
              className="min-h-[44px] text-base"
            />
            <p className="text-sm text-muted-foreground">
              Número do WhatsApp que receberá as notificações de pedido
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="min-h-[44px]">
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Link do Cardápio
          </CardTitle>
          <CardDescription>
            Compartilhe este link com seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={menuUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(menuUrl);
                setAlert({ type: "success", message: "Link copiado!" });
              }}
            >
              Copiar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Acesse para visualizar como seus clientes veem o cardápio
          </p>
        </CardContent>
      </Card>
    </div>
  );
}