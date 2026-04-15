import { formatPrice, generateSlug, isValidWhatsApp, isValidPrice, isValidName } from '@/lib/utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price in BRL', () => {
      expect(formatPrice(10)).toBe('R$ 10,00');
      expect(formatPrice(10.5)).toBe('R$ 10,50');
      expect(formatPrice(1000)).toBe('R$ 1.000,00');
      expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('R$ 0,00');
    });
  });

  describe('generateSlug', () => {
    it('should convert text to slug', () => {
      expect(generateSlug('Bar do João')).toBe('bar-do-joao');
      expect(generateSlug('Restaurante São Paulo')).toBe('restaurante-sao-paulo');
      expect(generateSlug('Pizza & Pasta')).toBe('pizza-pasta');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Café com Açúcar')).toBe('cafe-com-acucar');
      expect(generateSlug('Restaurante!!!')).toBe('restaurante');
    });

    it('should handle multiple spaces and hyphens', () => {
      expect(generateSlug('  Bar   do   João  ')).toBe('bar-do-joao');
      expect(generateSlug('---test---')).toBe('test');
    });
  });

  describe('isValidWhatsApp', () => {
    it('should validate Brazilian WhatsApp numbers', () => {
      expect(isValidWhatsApp('5511999999999')).toBe(true); // Com DDI
      expect(isValidWhatsApp('11999999999')).toBe(true); // Sem DDI
      expect(isValidWhatsApp('999999999')).toBe(false); // Muito curto
      expect(isValidWhatsApp('abc')).toBe(false); // Não numérico
      expect(isValidWhatsApp('')).toBe(false); // Vazio
    });
  });

  describe('isValidPrice', () => {
    it('should validate prices', () => {
      expect(isValidPrice(10.00)).toBe(true);
      expect(isValidPrice(0.01)).toBe(true);
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-5)).toBe(false);
      expect(isValidPrice(1000000)).toBe(true);
    });
  });

  describe('isValidName', () => {
    it('should validate names', () => {
      expect(isValidName('João')).toBe(true);
      expect(isValidName('Jo')).toBe(true); // 2 caracteres
      expect(isValidName('J')).toBe(false); // 1 caractere
      expect(isValidName('')).toBe(false); // Vazio
      expect(isValidName('  ')).toBe(false); // Apenas espaços
      expect(isValidName('  João  ')).toBe(true); // Com espaços
    });
  });
});