import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

describe('CategoriesPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de categorias', () => {
    it('deve renderizar sem erros', async () => {
      const { default: Page } = await import('@/app/admin/categories/page');
      const { container } = render(<Page />);
      expect(container).toBeTruthy();
    });
  });
});
