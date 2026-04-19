import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

describe('OrdersPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de pedidos', () => {
    it('deve renderizar sem erros', async () => {
      const { default: Page } = await import('@/app/admin/orders/page');
      const { container } = render(<Page />);
      expect(container).toBeTruthy();
    });
  });
});
