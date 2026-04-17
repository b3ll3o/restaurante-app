"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; restaurantId: string }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_FROM_STORAGE"; payload: CartState };

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (product: Product, restaurantId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Chave para localStorage - conforme regra Offline-First
const CART_STORAGE_KEY = "menulink_cart";

interface StoredCart {
  items: CartItem[];
  restaurantId: string | null;
  updatedAt: number;
}

/**
 * Carrega carrinho do localStorage
 * Retorna estado vazio se não houver dados ou se estiver no servidor
 */
function loadFromStorage(): CartState {
  if (typeof window === "undefined") {
    return { items: [], restaurantId: null };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed: StoredCart = JSON.parse(stored);
      return {
        items: parsed.items || [],
        restaurantId: parsed.restaurantId || null,
      };
    }
  } catch (error) {
    console.warn("Erro ao carregar carrinho do localStorage:", error);
  }

  return { items: [], restaurantId: null };
}

/**
 * Salva carrinho no localStorage
 * Não faz nada se estiver no servidor
 */
function saveToStorage(state: CartState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const stored: StoredCart = {
      items: state.items,
      restaurantId: state.restaurantId,
      updatedAt: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.warn("Erro ao salvar carrinho no localStorage:", error);
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return action.payload;

    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        restaurantId: action.restaurantId,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId
        ),
      };

    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { items: [], restaurantId: null };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializa com estado vazio (será substituído pelo localStorage após hydrate)
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurantId: null,
  });

  // Carrega do localStorage após montagem (cliente)
  useEffect(() => {
    const stored = loadFromStorage();
    dispatch({ type: "LOAD_FROM_STORAGE", payload: stored });
  }, []);

  // Salva no localStorage a cada mudança de estado
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addItem = (product: Product, restaurantId: string) => {
    dispatch({ type: "ADD_ITEM", product, restaurantId });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        restaurantId: state.restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
