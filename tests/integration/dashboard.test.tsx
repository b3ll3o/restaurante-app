import { afterEach, describe, expect, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';

describe('DashboardPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa dashboard', () => {
    it('deve renderizar sem erros', async () => {
      const { default: Page } = await import('@/app/admin/dashboard/page');
      const { container } = render(<Page />);
      expect(container).toBeTruthy();
    });
  });
});
