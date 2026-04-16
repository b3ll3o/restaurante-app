import { formatOrderMessage, generateWhatsAppUrl, sendWhatsAppMessage } from '@/lib/whatsapp';

// Mock global fetch
global.fetch = jest.fn();

describe('WhatsApp Service', () => {
  describe('formatOrderMessage', () => {
    it('should format order message correctly with PIX', () => {
      const order = {
        id: '12345678-abcd',
        customer_name: 'Maria Silva',
        customer_whatsapp: '11999999999',
        total: 68.0,
        payment_method: 'pix',
      };
      const items = [
        { quantity: 2, product_name: 'Pizza', total_price: 60.0 },
        { quantity: 1, product_name: 'Refrigerante', total_price: 8.0 },
      ];

      const message = formatOrderMessage(order, items);

      expect(message).toContain('12345678');
      expect(message).toContain('Maria Silva');
      expect(message).toContain('11999999999');
      expect(message).toContain('PIX');
      expect(message).toContain('2x Pizza - R$ 60.00');
      expect(message).toContain('1x Refrigerante - R$ 8.00');
      expect(message).toContain('R$ 68.00');
    });

    it('should format order message correctly with cash', () => {
      const order = {
        id: '87654321-wxyz',
        customer_name: 'João Santos',
        customer_whatsapp: '5511888888888',
        total: 45.9,
        payment_method: 'cash',
      };
      const items = [
        { quantity: 1, product_name: 'Esfiha', total_price: 45.9 },
      ];

      const message = formatOrderMessage(order, items);

      expect(message).toContain('87654321');
      expect(message).toContain('João Santos');
      expect(message).toContain('Dinheiro');
      expect(message).toContain('1x Esfiha - R$ 45.90');
    });

    it('should handle empty items list', () => {
      const order = {
        id: '11111111-aaaa',
        customer_name: 'Cliente Teste',
        customer_whatsapp: '11999999999',
        total: 0,
        payment_method: 'pix',
      };
      const items: { quantity: number; product_name: string; total_price: number }[] = [];

      const message = formatOrderMessage(order, items);

      expect(message).toContain('11111111');
      expect(message).toContain('Cliente Teste');
      expect(message).toContain('R$ 0.00');
    });
  });

  describe('generateWhatsAppUrl', () => {
    it('should generate correct wa.me URL with simple message', () => {
      const url = generateWhatsAppUrl('5511999999999', 'Olá!');
      expect(url).toContain('https://wa.me/5511999999999?text=');
      expect(url).toContain('Ol%C3%A1');
    });

    it('should generate correct URL with complex message', () => {
      const message = 'Pedido #123\nTotal: R$ 50,00';
      const url = generateWhatsAppUrl('11999999999', message);
      expect(url).toContain('https://wa.me/11999999999?text=');
      expect(url).toContain('Pedido%20%23123');
    });

    it('should clean non-numeric characters from phone', () => {
      const url = generateWhatsAppUrl('+55 (11) 9999-9999', 'Teste');
      // +55 (11) 9999-9999 → 55119999999 (12 dígitos)
      expect(url).toContain('55119999999');
    });

    it('should handle phone with spaces', () => {
      const url = generateWhatsAppUrl('55 11 99999 9999', 'Mensagem');
      expect(url).toContain('5511999999999');
    });

it('should encode special characters', () => {
    const url = generateWhatsAppUrl('5511999999999', 'Teste com & e =');
    expect(url).toContain('Teste%20com%20%26%20e%20%3D');
  });
});

describe('sendWhatsAppMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error when token is not configured', async () => {
    const result = await sendWhatsAppMessage('', 'token', '5511999999999', 'Mensagem');
    expect(result.success).toBe(false);
    expect(result.error).toBe('WhatsApp não configurado');
  });

  it('should return error when phoneNumberId is not configured', async () => {
    const result = await sendWhatsAppMessage('phoneId', '', '5511999999999', 'Mensagem');
    expect(result.success).toBe(false);
    expect(result.error).toBe('WhatsApp não configurado');
  });

  it('should return success when API call succeeds', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ messages: [{ id: 'msg-123' }] }),
    });

    const result = await sendWhatsAppMessage('phoneId', 'token', '5511999999999', 'Mensagem');

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('msg-123');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://graph.facebook.com/v18.0/phoneId/messages',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('should return error when API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Error message'),
    });

    const result = await sendWhatsAppMessage('phoneId', 'token', '5511999999999', 'Mensagem');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Erro ao enviar mensagem');
  });

  it('should return error when fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await sendWhatsAppMessage('phoneId', 'token', '5511999999999', 'Mensagem');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Falha ao enviar mensagem');
  });

  it('should clean phone number before sending', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ messages: [{ id: 'msg-123' }] }),
    });

    await sendWhatsAppMessage('phoneId', 'token', '+55 (11) 9999-9999', 'Mensagem');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('55119999999'),
      })
    );
  });
});
});