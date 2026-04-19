import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React, { createContext, useContext, useReducer } from 'react';

interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; restaurantId: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, restaurantId } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex !== -1) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        restaurantId,
        items: [...state.items, { product, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.productId),
      };
    }
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }
    case 'CLEAR_CART': {
      return { items: [], restaurantId: null };
    }
    default:
      return state;
  }
}

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

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurantId: null,
  });

  const addItem = (product: Product, restaurantId: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, restaurantId } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

describe('CartContext', () => {
  describe('initial state', () => {
    it('should start with empty cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      expect(result.current.items.length).toBe(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
      expect(result.current.restaurantId).toBeNull();
    });
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const product = {
        id: 'prod-1',
        category_id: 'cat-1',
        name: 'Pizza',
        description: 'Pizza de mussarela',
        price: 45.9,
        image_url: null,
        is_available: true,
        display_order: 1,
        created_at: '2026-04-15',
      };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product, 'rest-1');
      });

      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].product.id).toBe('prod-1');
      expect(result.current.items[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      const product = {
        id: 'prod-2',
        category_id: 'cat-1',
        name: 'Test',
        description: null,
        price: 10,
        image_url: null,
        is_available: true,
        display_order: 1,
        created_at: '2026-04-15',
      };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product, 'rest-1');
        result.current.addItem(product, 'rest-1');
      });

      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].quantity).toBe(2);
      expect(result.current.totalItems).toBe(2);
    });

    it('should add different products', () => {
      const product1 = { id: 'prod-a', category_id: 'cat-1', name: 'A', description: null, price: 10, image_url: null, is_available: true, display_order: 1, created_at: '2026-04-15' };
      const product2 = { id: 'prod-b', category_id: 'cat-1', name: 'B', description: null, price: 20, image_url: null, is_available: true, display_order: 2, created_at: '2026-04-15' };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product1, 'rest-1');
        result.current.addItem(product2, 'rest-1');
      });

      expect(result.current.items.length).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const product = { id: 'prod-remove', category_id: 'cat-1', name: 'Remove', description: null, price: 15, image_url: null, is_available: true, display_order: 1, created_at: '2026-04-15' };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product, 'rest-1');
      });

      expect(result.current.items.length).toBe(1);

      act(() => {
        result.current.removeItem('prod-remove');
      });

      expect(result.current.items.length).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity to specific value', () => {
      const product = { id: 'prod-update', category_id: 'cat-1', name: 'Update', description: null, price: 10, image_url: null, is_available: true, display_order: 1, created_at: '2026-04-15' };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product, 'rest-1');
      });

      expect(result.current.totalItems).toBe(1);

      act(() => {
        result.current.updateQuantity('prod-update', 5);
      });

      expect(result.current.totalItems).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const product = { id: 'prod-zero', category_id: 'cat-1', name: 'Zero', description: null, price: 10, image_url: null, is_available: true, display_order: 1, created_at: '2026-04-15' };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product, 'rest-1');
      });

      expect(result.current.items.length).toBe(1);

      act(() => {
        result.current.updateQuantity('prod-zero', 0);
      });

      expect(result.current.items.length).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items', () => {
      const product1 = { id: 'prod-c1', category_id: 'cat-1', name: 'C1', description: null, price: 10, image_url: null, is_available: true, display_order: 1, created_at: '2026-04-15' };
      const product2 = { id: 'prod-c2', category_id: 'cat-1', name: 'C2', description: null, price: 20, image_url: null, is_available: true, display_order: 2, created_at: '2026-04-15' };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product1, 'rest-1');
        result.current.addItem(product2, 'rest-1');
      });

      expect(result.current.items.length).toBe(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items.length).toBe(0);
      expect(result.current.restaurantId).toBeNull();
    });
  });

  describe('totalPrice', () => {
    it('should calculate total price correctly', () => {
      const product1 = { id: 'prod-p1', category_id: 'cat-1', name: 'P1', description: null, price: 10, image_url: null, is_available: true, display_order: 1, created_at: '2026-04-15' };
      const product2 = { id: 'prod-p2', category_id: 'cat-1', name: 'P2', description: null, price: 20, image_url: null, is_available: true, display_order: 2, created_at: '2026-04-15' };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      act(() => {
        result.current.addItem(product1, 'rest-1');
        result.current.addItem(product2, 'rest-1');
      });

      expect(result.current.totalPrice).toBe(30);
    });
  });
});
