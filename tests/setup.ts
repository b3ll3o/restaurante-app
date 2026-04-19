import '@testing-library/jest-dom';
import { vi, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpar DOM após cada teste para evitar estado acumulado
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock do Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Dados mockados compartilhados
export const mockRestaurant = {
  id: 'restaurant-1',
  name: 'Restaurante Teste',
  slug: 'restaurante-teste',
  owner_whatsapp: '5511999999999',
  owner_id: 'user-1',
};

export const mockSession = {
  user: { id: 'user-1', email: 'admin@teste.com' },
};

// Mock do RestaurantContext
vi.mock('@/context/RestaurantContext', () => ({
  RestaurantProvider: ({ children }: { children: React.ReactNode }) => children,
  useRestaurant: () => ({
    restaurants: [mockRestaurant],
    activeRestaurant: mockRestaurant,
    setActiveRestaurant: vi.fn(),
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  }),
}));

// Mock do CartContext
vi.mock('@/context/cart-context', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
  useCart: () => ({
    items: [],
    restaurantId: 'restaurant-1',
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
  }),
}));

// Helper para criar mock do Supabase
export function createMockSupabaseClient(overrides = {}) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: mockSession },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: mockSession.user },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn((table: string) => {
      const tableHandlers: Record<string, object> = {
        categories: {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        },
        products: {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        },
        orders: {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
          limit: vi.fn().mockReturnThis(),
        },
        restaurants: {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockRestaurant, error: null }),
        },
        order_items: {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        },
      };
      return tableHandlers[table] || {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      }),
    },
    ...overrides,
  };
}

// Mock do Supabase com configuração padrão
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => createMockSupabaseClient()),
}));

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock do fetch
global.fetch = vi.fn();

// Mock do clipboard API para userEvent
const clipboard = {
  readText: vi.fn().mockResolvedValue(''),
  writeText: vi.fn().mockResolvedValue(undefined),
};
Object.defineProperty(navigator, 'clipboard', {
  value: clipboard,
  writable: true,
  configurable: true,
});

// Mock do window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Mock do window.open
window.open = vi.fn();
