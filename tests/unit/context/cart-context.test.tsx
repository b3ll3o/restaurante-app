import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/context/cart-context';
import { Product } from '@/types';

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
  describe('addItem', () => {
    it('should add item to empty cart', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add Pizza'));

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('45.9');
    });

    it('should increment quantity for existing item', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add Pizza'));
      await user.click(screen.getByText('Add Pizza'));

      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('91.8');
    });

    it('should add different products', async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Add Pizza'));
      await user.click(screen.getByText('Add Refrigerante'));

      expect(screen.getByTestId('items-count')).toHaveTextContent('2');
      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('53.9');
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
      await user.click(screen.getByText('Add Pizza'));
      await user.click(screen.getByText('Remove Pizza'));

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
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
      await user.click(screen.getByText('Add Pizza'));
      await user.click(screen.getByText('Update Pizza to 2'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('91.8');
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
      await user.click(screen.getByText('Add Pizza'));
      await user.click(screen.getByText('Add Refrigerante'));
      await user.click(screen.getByText('Clear'));

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    });
  });

  describe('useCart', () => {
    it('should throw error when used outside CartProvider', () => {
      // Suprimir erro do console para este teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });
  });
});