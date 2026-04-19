"use client";

import { useState, useMemo } from "react";
import { useRestaurant } from "@/context/RestaurantContext";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Link as LinkIcon,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface RestaurantFormData {
  name: string;
  owner_whatsapp: string;
}

interface AlertMessage {
  type: "success" | "error";
  message: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { restaurants, activeRestaurant, setActiveRestaurant, refresh } = useRestaurant();
  const [loading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createForm, setCreateForm] = useState<RestaurantFormData>({
    name: "",
    owner_whatsapp: "",
  });

  const [editForm, setEditForm] = useState<RestaurantFormData>({
    name: "",
    owner_whatsapp: "",
  });

  const supabase = useMemo(() => createClient(), []);

  const showAlert = (alert: AlertMessage) => {
    setAlert(alert);
    setTimeout(() => setAlert(null), 4000);
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      showAlert({ type: "error", message: "Nome do restaurante é obrigatório" });
      return;
    }

    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showAlert({ type: "error", message: "Usuário não autenticado" });
      setCreating(false);
      return;
    }

    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        name: createForm.name.trim(),
        owner_whatsapp: createForm.owner_whatsapp.trim(),
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      showAlert({ type: "error", message: error.message });
    } else {
      showAlert({ type: "success", message: "Restaurante criado com sucesso!" });
      setShowCreateDialog(false);
      setCreateForm({ name: "", owner_whatsapp: "" });
      await refresh();
      if (data) {
        setActiveRestaurant(data);
        router.refresh();
      }
    }

    setCreating(false);
  };

  const startEditing = (restaurant: { id: string; name: string; owner_whatsapp: string }) => {
    setEditingId(restaurant.id);
    setEditForm({ name: restaurant.name, owner_whatsapp: restaurant.owner_whatsapp });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: "", owner_whatsapp: "" });
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) {
      showAlert({ type: "error", message: "Nome do restaurante é obrigatório" });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("restaurants")
      .update({
        name: editForm.name.trim(),
        owner_whatsapp: editForm.owner_whatsapp.trim(),
      })
      .eq("id", id);

    if (error) {
      showAlert({ type: "error", message: error.message });
    } else {
      showAlert({ type: "success", message: "Restaurante atualizado!" });
      setEditingId(null);
      await refresh();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);

    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);

    if (error) {
      showAlert({ type: "error", message: error.message });
    } else {
      showAlert({ type: "success", message: "Restaurante excluído" });
      setDeleteConfirmId(null);
      if (activeRestaurant?.id === id) {
        const remaining = restaurants.filter((r) => r.id !== id);
        if (remaining.length > 0) {
          setActiveRestaurant(remaining[0]);
        }
      }
      await refresh();
      router.refresh();
    }

    setDeleting(false);
  };

  const handleSelectRestaurant = (restaurant: typeof activeRestaurant) => {
    if (restaurant) {
      setActiveRestaurant(restaurant);
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {alert && (
        <div
          className={`p-3 sm:p-4 rounded-md text-sm sm:text-base ${
            alert.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Gerencie seus restaurantes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="touch-target w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Novo Restaurante</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Restaurant List */}
      <div className="grid gap-4">
        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum restaurante encontrado. Crie seu primeiro restaurante.
            </CardContent>
          </Card>
        ) : (
          restaurants.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {editingId === restaurant.id ? (
                    <div className="flex-1 space-y-3">
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Nome do restaurante"
                        className="min-h-[44px] text-base"
                      />
                      <Input
                        value={editForm.owner_whatsapp}
                        onChange={(e) =>
                          setEditForm({ ...editForm, owner_whatsapp: e.target.value })
                        }
                        placeholder="+5511999999999"
                        className="min-h-[44px] text-base"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(restaurant.id)}
                          disabled={saving}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={saving}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {restaurant.name}
                          {activeRestaurant?.id === restaurant.id && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Ativo
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {restaurant.owner_whatsapp || "Sem WhatsApp"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {activeRestaurant?.id !== restaurant.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectRestaurant(restaurant)}
                          >
                            Selecionar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(restaurant)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(restaurant.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              {editingId !== restaurant.id && (
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    <code className="text-xs">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/menu/${restaurant.slug}`
                        : `/menu/${restaurant.slug}`}
                    </code>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Create Restaurant Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Restaurante</DialogTitle>
            <DialogDescription>
              Preencha os dados do seu novo restaurante.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nome do Restaurante</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                placeholder="Nome do restaurante"
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-whatsapp">WhatsApp para Pedidos</Label>
              <Input
                id="create-whatsapp"
                type="tel"
                value={createForm.owner_whatsapp}
                onChange={(e) =>
                  setCreateForm({ ...createForm, owner_whatsapp: e.target.value })
                }
                placeholder="+5511999999999"
                className="min-h-[44px] text-base"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setCreateForm({ name: "", owner_whatsapp: "" });
              }}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Criando..." : "Criar Restaurante"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Restaurante</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este restaurante? Esta ação não pode
              ser desfeita e todos os dados asociados (categorias, produtos, pedidos)
              serão excluídos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              variant="destructive"
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}