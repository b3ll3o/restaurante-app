"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { maskWhatsApp } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart, CartItem } from "@/context/cart-context";
import { LOCALE } from "@/lib/constants";
import {
  Menu,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  Phone,
  Check,
  Loader2,
} from "lucide-react";
import { Category, Product, Restaurant } from "@/types";

interface MenuData {
  restaurant: Restaurant;
  categories: (Category & { products: Product[] })[];
}

type CheckoutStep = "cart" | "checkout" | "success";

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cash">("pix");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const { items, addItem, removeItem, totalItems, totalPrice, clearCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single();

      if (restaurantError || !restaurant) {
        setLoading(false);
        return;
      }

      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .order("display_order", { ascending: true });

      if (!categories) {
        setMenuData({ restaurant, categories: [] });
        setLoading(false);
        return;
      }

      const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const { data: products } = await supabase
            .from("products")
            .select("*")
            .eq("category_id", category.id)
            .eq("is_available", true)
            .order("display_order", { ascending: true });

          return {
            ...category,
            products: products || [],
          };
        })
      );

      setMenuData({ restaurant, categories: categoriesWithProducts });

      if (categoriesWithProducts.length > 0) {
        setExpandedCategory(categoriesWithProducts[0].id);
      }

      setLoading(false);
    };

    fetchMenu();
  }, [slug, supabase]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(LOCALE.ptBR, {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const validateWhatsApp = (whatsapp: string): boolean => {
    const cleaned = whatsapp.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 13;
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    return item?.quantity || 0;
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setCheckoutStep("checkout");
    setOrderError(null);
    setWhatsappError(null);
  };

  const handleBackToCart = () => {
    setCheckoutStep("cart");
    setOrderError(null);
    setWhatsappError(null);
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerWhatsapp || !menuData) return;

    // Validar WhatsApp
    if (!validateWhatsApp(customerWhatsapp)) {
      setWhatsappError("Digite um WhatsApp válido (ex: 11999999999)");
      return;
    }

    setPlacingOrder(true);
    setOrderError(null);
    setWhatsappError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerWhatsapp,
          paymentMethod,
          items,
          total: totalPrice,
          restaurantId: menuData.restaurant.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setOrderError(result.error || "Erro ao fazer pedido");
        setPlacingOrder(false);
        return;
      }

      setCheckoutStep("success");
      clearCart();

      setTimeout(() => {
        const restaurantWhatsApp = maskWhatsApp(menuData.restaurant.owner_whatsapp).replace(/\D/g, "");
        const itemsList = items
          .map(
            (item) =>
              `${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}`
          )
          .join("\n");
        const paymentLabel = paymentMethod === "pix" ? "Pix" : "Dinheiro";
        const message = encodeURIComponent(
          `*Pedido #${result.order.id.slice(0, 8)}*\n\n*Cliente:* ${customerName}\n*Pagamento:* ${paymentLabel}\n\n${itemsList}\n\n*Total: ${formatPrice(totalPrice)}*\n\nPedido feito pelo cardápio digital.`
        );
        window.open(
          `https://wa.me/${restaurantWhatsApp.replace(/\D/g, "")}?text=${message}`,
          "_blank"
        );
        setCartOpen(false);
        setCheckoutStep("cart");
        setCustomerName("");
        setCustomerWhatsapp("");
        setPaymentMethod("pix");
      }, 2000);
    } catch {
      setOrderError("Erro de conexão. Tente novamente.");
    }

    setPlacingOrder(false);
  };

  const resetCartState = () => {
    setCheckoutStep("cart");
    setCustomerName("");
    setCustomerWhatsapp("");
    setPaymentMethod("pix");
    setOrderError(null);
    setWhatsappError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <h1 className="text-2xl font-bold mb-2">Cardápio não encontrado</h1>
        <p className="text-muted-foreground text-center">
          Este cardápio pode ter sido removido ou ainda não está disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">{menuData.restaurant.name}</h1>
            </div>
          </div>

          <Sheet open={cartOpen} onOpenChange={(open) => { setCartOpen(open); if (!open) resetCartState(); }}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>
                  {checkoutStep === "cart" && "Seu Pedido"}
                  {checkoutStep === "checkout" && "Finalizar Pedido"}
                  {checkoutStep === "success" && "Pedido Enviado!"}
                </SheetTitle>
              </SheetHeader>

              {checkoutStep === "cart" && (
                <>
                  {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">Seu carrinho está vazio</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto py-4 space-y-4">
                        {items.map((item) => (
                          <CartItemCard
                            key={item.product.id}
                            item={item}
                            formatPrice={formatPrice}
                            addItem={addItem}
                            removeItem={removeItem}
                            restaurantId={menuData.restaurant.id}
                          />
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleProceedToCheckout}
                        >
                          Continuar
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={clearCart}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Limpar Carrinho
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {checkoutStep === "checkout" && (
                <>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <div className="bg-muted rounded-lg p-3 space-y-2">
                      <p className="font-medium text-sm">Resumo do Pedido</p>
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span>{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>

                    {orderError && (
                      <div className="bg-red-100 text-red-800 rounded-md p-3 text-sm">
                        {orderError}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Seu Nome</Label>
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ex: João Silva"
                        />
                      </div>

<div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={customerWhatsapp}
                onChange={(e) => {
                  setCustomerWhatsapp(e.target.value);
                  setWhatsappError(null);
                }}
                placeholder="+5511999999999"
                className={whatsappError ? "border-red-500 focus:border-red-500" : ""}
              />
              {whatsappError && (
                <p className="text-xs text-red-500 mt-1">{whatsappError}</p>
              )}
            </div>

                      <div className="space-y-2">
                        <Label>Forma de Pagamento</Label>
                        <div className="grid grid-cols-2 gap-2">
<Button
                          variant={paymentMethod === "pix" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("pix")}
                          className="h-20 flex flex-col gap-1 min-h-[80px]"
                        >
                          <span className="text-lg font-bold">PIX</span>
                          <span className="text-xs opacity-70">Transferência</span>
                        </Button>
                        <Button
                          variant={paymentMethod === "cash" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("cash")}
                          className="h-20 flex flex-col gap-1 min-h-[80px]"
                        >
                            <span className="text-lg font-bold">Dinheiro</span>
                            <span className="text-xs opacity-70">Na entrega</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder || !customerName || !customerWhatsapp}
                    >
                      {placingOrder ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Phone className="h-4 w-4 mr-2" />
                          Confirmar e Enviar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleBackToCart}
                      disabled={placingOrder}
                    >
                      Voltar
                    </Button>
                  </div>
                </>
              )}

              {checkoutStep === "success" && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Pedido Enviado!</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Seu pedido foi salvo e você será redirecionado para o WhatsApp.
                    </p>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="pb-24">
        {menuData.categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-muted-foreground text-center">
              Nenhum produto disponível no momento
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {menuData.categories.map((category) => (
              <div key={category.id}>
                <button
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.products.length}
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedCategory === category.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedCategory === category.id && (
                  <div className="px-4 pb-4 space-y-3">
                    {category.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        formatPrice={formatPrice}
                        quantity={getItemQuantity(product.id)}
                        onAdd={() => addItem(product, menuData.restaurant.id)}
                        onRemove={() => removeItem(product.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {totalItems > 0 && checkoutStep === "cart" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden">
          <Button
            className="w-full"
            size="lg"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ver Carrinho ({totalItems})
          </Button>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  formatPrice: (price: number) => string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function ProductCard({
  product,
  formatPrice,
  quantity,
  onAdd,
  onRemove,
}: ProductCardProps) {
  return (
    <div className="flex gap-3 bg-card rounded-lg p-3 shadow-sm">
      {product.image_url && (
        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{product.name}</h3>
            {product.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          <span className="font-bold text-sm ml-2">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center justify-end mt-2">
          {quantity === 0 ? (
            <Button size="sm" onClick={onAdd} className="h-8">
              <Plus className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onRemove}
              >
                {quantity === 1 ? (
                  <Trash2 className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
              <span className="font-medium w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onAdd}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  formatPrice: (price: number) => string;
  addItem: (product: Product, restaurantId: string) => void;
  removeItem: (productId: string) => void;
  restaurantId: string;
}

function CartItemCard({
  item,
  formatPrice,
  addItem,
  removeItem,
  restaurantId,
}: CartItemCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatPrice(item.product.price)} cada
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => removeItem(item.product.id)}
        >
          {item.quantity === 1 ? (
            <Trash2 className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
        </Button>
        <span className="font-medium w-6 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => addItem(item.product, restaurantId)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="w-20 text-right font-medium text-sm">
        {formatPrice(item.product.price * item.quantity)}
      </div>
    </div>
  );
}