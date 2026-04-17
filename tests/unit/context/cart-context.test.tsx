import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/context/cart-context';
import { Product } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Componente de teste para acessar o contexto
const TestComponent = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, restaurantId } =
    useCart();

  const mockProduct: Product = {
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

  const mockProduct2: Product = {
    id: 'prod-2',
    category_id: 'cat-1',
    name: 'Refrigerante',
    description: null,
    price: 8.0,
    image_url: null,
    is_available: true,
    display_order: 2,
    created_at: '2026-04-15',
  };

  return (
    <div>
      <span data-testid="items-count">{items.length}</span>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice}</span>
      <span data-testid="restaurant-id">{restaurantId || 'null'}</span>
      <button onClick={() => addItem(mockProduct, 'rest-1')}>Add Pizza</button>
      <button onClick={() => addItem(mockProduct2, 'rest-1')}>Add Refrigerante</button>
      <button onClick={() => removeItem('prod-1')}>Remove Pizza</button>
      <button onClick={() => updateQuantity('prod-1', 2)}>Update Pizza to 2</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addItem', () => {
    it('should add item to empty cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getAllByText('Add Pizza')[0]);

      expect(screen.getAllByTestId('items-count')[0].textContent).toContain('1');
      expect(screen.getAllByTestId('total-items')[0].textContent).toContain('1');
      expect(screen.getAllByTestId('total-price')[0].textContent).toContain('45.9');
    });

    it('should increment quantity for existing item', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getAllByText('Add Pizza')[0]);
      await user.click(screen.getAllByText('Add Pizza')[0]);

      expect(screen.getAllByTestId('items-count')[0].textContent).toContain('1');
      expect(screen.getAllByTestId('total-items')[0].textContent).toContain('2');
      expect(screen.getAllByTestId('total-price')[0].textContent).toContain('91.8');
    });

    it('should add different products', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getAllByText('Add Pizza')[0]);
      await user.click(screen.getAllByText('Add Refrigerante')[0]);

      expect(screen.getAllByTestId('items-count')[0].textContent).toContain('2');
      expect(screen.getAllByTestId('total-items')[0].textContent).toContain('2');
      expect(screen.getAllByTestId('total-price')[0].textContent).toContain('53.9');
    });
  });

  describe('removeItem', () => {
    it('should remove item completely', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getAllByText('Add Pizza')[0]);
      await user.click(screen.getAllByText('Remove Pizza')[0]);

      expect(screen.getAllByTestId('items-count')[0].textContent).toContain('0');
      expect(screen.getAllByTestId('total-items')[0].textContent).toContain('0');
      expect(screen.getAllByTestId('total-price')[0].textContent).toContain('0');
    });

    it('should handle removing non-existent item gracefully', async () => {
      const NonExistentRemoveComponent = () => {
        const { removeItem, items } = useCart();
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <button onClick={() => removeItem('non-existent-id')}>Remove Non-Existent</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <NonExistentRemoveComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Remove Non-Existent'));

      expect(screen.getByTestId('items-count').textContent).toContain('0');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity to specific value', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getAllByText('Add Pizza')[0]);
      await user.click(screen.getAllByText('Update Pizza to 2')[0]);

      expect(screen.getAllByTestId('total-items')[0].textContent).toContain('2');
      expect(screen.getAllByTestId('total-price')[0].textContent).toContain('91.8');
    });

    it('should remove item when quantity is 0', async () => {
      const UpdateToZeroComponent = () => {
        const { updateQuantity, items, addItem } = useCart();
        const product: Product = {
          id: 'prod-zero',
          category_id: 'cat-1',
          name: 'Test Product',
          description: 'Test',
          price: 10,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
            <button onClick={() => updateQuantity('prod-zero', 0)}>Update to 0</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <UpdateToZeroComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      expect(screen.getByTestId('items-count').textContent).toContain('1');

      await user.click(screen.getByText('Update to 0'));
      expect(screen.getByTestId('items-count').textContent).toContain('0');
    });

    it('should remove item when quantity is negative', async () => {
      const UpdateToNegativeComponent = () => {
        const { updateQuantity, items, addItem } = useCart();
        const product: Product = {
          id: 'prod-neg',
          category_id: 'cat-1',
          name: 'Negative Test',
          description: 'Test',
          price: 15,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
            <button onClick={() => updateQuantity('prod-neg', -5)}>Update Negative</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <UpdateToNegativeComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      expect(screen.getByTestId('items-count').textContent).toContain('1');

      await user.click(screen.getByText('Update Negative'));
      expect(screen.getByTestId('items-count').textContent).toContain('0');
    });

    it('should update quantity for non-existent item without error', async () => {
      const UpdateNonExistentComponent = () => {
        const { updateQuantity, items } = useCart();
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <button onClick={() => updateQuantity('non-existent', 5)}>Update Non-Existent</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <UpdateNonExistentComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Update Non-Existent'));

      expect(screen.getByTestId('items-count').textContent).toContain('0');
    });
  });

  describe('clearCart', () => {
    it('should remove all items', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getAllByText('Add Pizza')[0]);
      await user.click(screen.getAllByText('Add Refrigerante')[0]);
      await user.click(screen.getAllByText('Clear')[0]);

      expect(screen.getAllByTestId('items-count')[0].textContent).toContain('0');
      expect(screen.getAllByTestId('total-items')[0].textContent).toContain('0');
      expect(screen.getAllByTestId('total-price')[0].textContent).toContain('0');
    });
  });

  describe('useCart', () => {
    it('should throw error when used outside CartProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('loadFromStorage', () => {
    it('should return empty state when localStorage returns null', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const EmptyCartComponent = () => {
        const { items } = useCart();
        return <span data-testid="items-count">{items.length}</span>;
      };

      render(
        <CartProvider>
          <EmptyCartComponent />
        </CartProvider>
      );

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(screen.getByTestId('items-count').textContent).toContain('0');
    });

    it('should load items from localStorage when data is valid', async () => {
      const storedData = {
        items: [
          {
            product: {
              id: 'prod-loaded',
              category_id: 'cat-1',
              name: 'Loaded Pizza',
              description: 'Loaded desc',
              price: 50,
              image_url: null,
              is_available: true,
              display_order: 1,
              created_at: '2026-04-15',
            },
            quantity: 3,
          },
        ],
        restaurantId: 'rest-loaded',
        updatedAt: Date.now(),
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));

      const LoadedCartComponent = () => {
        const { items, restaurantId, totalItems } = useCart();
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <span data-testid="restaurant-id">{restaurantId || 'null'}</span>
            <span data-testid="total-items">{totalItems}</span>
          </div>
        );
      };

      render(
        <CartProvider>
          <LoadedCartComponent />
        </CartProvider>
      );

      // The provider loads from storage on mount, but due to async nature
      // we need to wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(screen.getByTestId('items-count').textContent).toContain('1');
    });

    it('should handle JSON parse error gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json{');

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const ParseErrorComponent = () => {
        const { items } = useCart();
        return <span data-testid="items-count">{items.length}</span>;
      };

      render(
        <CartProvider>
          <ParseErrorComponent />
        </CartProvider>
      );

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao carregar carrinho do localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('saveToStorage', () => {
    it('should save state to localStorage when items change', async () => {
      const user = userEvent.setup();

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await user.click(screen.getAllByText('Add Pizza')[0]);

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle localStorage setItem error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      const user = userEvent.setup();

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Should not throw even with localStorage error
      await user.click(screen.getAllByText('Add Pizza')[0]);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao salvar carrinho no localStorage:',
        expect.any(Error)
      );

      localStorageMock.setItem.mockReset();
      consoleSpy.mockRestore();
    });
  });

  describe('reducer branches', () => {
    it('should handle ADD_ITEM when item already exists (update quantity path)', async () => {
      const AddTwiceComponent = () => {
        const { addItem, items } = useCart();
        const product: Product = {
          id: 'prod-dup',
          category_id: 'cat-1',
          name: 'Duplicate Test',
          description: 'Test',
          price: 20,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <span data-testid="total-items">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <AddTwiceComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Add'));

      expect(screen.getByTestId('items-count').textContent).toContain('1');
      expect(screen.getByTestId('total-items').textContent).toContain('2');
    });

    it('should handle ADD_ITEM with new item (add to array path)', async () => {
      const AddNewComponent = () => {
        const { addItem, items } = useCart();
        const product1: Product = {
          id: 'prod-new-1',
          category_id: 'cat-1',
          name: 'New Product 1',
          description: 'Test',
          price: 25,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        const product2: Product = {
          id: 'prod-new-2',
          category_id: 'cat-1',
          name: 'New Product 2',
          description: 'Test',
          price: 30,
          image_url: null,
          is_available: true,
          display_order: 2,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <button onClick={() => addItem(product1, 'rest-1')}>Add 1</button>
            <button onClick={() => addItem(product2, 'rest-1')}>Add 2</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <AddNewComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add 1'));
      await user.click(screen.getByText('Add 2'));

      expect(screen.getByTestId('items-count').textContent).toContain('2');
    });

    it('should handle UPDATE_QUANTITY with quantity > 0 (map path)', async () => {
      const MapPathComponent = () => {
        const { updateQuantity, items, addItem } = useCart();
        const product: Product = {
          id: 'prod-map',
          category_id: 'cat-1',
          name: 'Map Path Test',
          description: 'Test',
          price: 35,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <span data-testid="quantity">{items.find(i => i.product.id === 'prod-map')?.quantity || 0}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
            <button onClick={() => updateQuantity('prod-map', 5)}>Update to 5</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <MapPathComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Update to 5'));

      expect(screen.getByTestId('quantity').textContent).toContain('5');
    });

    it('should handle REMOVE_ITEM (filter path)', async () => {
      const FilterComponent = () => {
        const { removeItem, items, addItem } = useCart();
        const product: Product = {
          id: 'prod-filter',
          category_id: 'cat-1',
          name: 'Filter Test',
          description: 'Test',
          price: 40,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="items-count">{items.length}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
            <button onClick={() => removeItem('prod-filter')}>Remove</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <FilterComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      expect(screen.getByTestId('items-count').textContent).toContain('1');

      await user.click(screen.getByText('Remove'));
      expect(screen.getByTestId('items-count').textContent).toContain('0');
    });
  });

  describe('total calculations', () => {
    it('should calculate totalItems correctly', async () => {
      const TotalItemsComponent = () => {
        const { addItem, totalItems } = useCart();
        const product: Product = {
          id: 'prod-total',
          category_id: 'cat-1',
          name: 'Total Test',
          description: 'Test',
          price: 50,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="total-items">{totalItems}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <TotalItemsComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Add'));

      expect(screen.getByTestId('total-items').textContent).toContain('2');
    });

    it('should calculate totalPrice correctly', async () => {
      const TotalPriceComponent = () => {
        const { addItem, totalPrice } = useCart();
        const product: Product = {
          id: 'prod-price',
          category_id: 'cat-1',
          name: 'Price Test',
          description: 'Test',
          price: 25.5,
          image_url: null,
          is_available: true,
          display_order: 1,
          created_at: '2026-04-15',
        };
        return (
          <div>
            <span data-testid="total-price">{totalPrice}</span>
            <button onClick={() => addItem(product, 'rest-1')}>Add</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <TotalPriceComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Add'));

      expect(screen.getByTestId('total-price').textContent).toContain('51');
    });
  });
});