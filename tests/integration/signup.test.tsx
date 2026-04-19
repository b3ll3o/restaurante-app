import { describe, expect, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';

describe('SignupPage - Testes de Integração', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cenário: Admin acessa página de cadastro', () => {
    it('deve renderizar sem erros', async () => {
      const { default: Page } = await import('@/app/admin/signup/page');
      const { container } = render(<Page />);
      expect(container).toBeTruthy();
    });
  });
});
