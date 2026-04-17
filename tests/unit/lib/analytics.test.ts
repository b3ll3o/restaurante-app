import { describe, it, expect, vi } from 'vitest';
import { page_view, SegmentType, PageViewEvent } from '@/lib/analytics';

describe('Analytics', () => {
  describe('page_view', () => {
    it('deve aceitar objeto com segment válido', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const segments: SegmentType[] = ['pizzaria', 'hamburgueria', 'bar', 'restaurante'];

      segments.forEach((segment) => {
        page_view({ segment, url: `/landing/${segment}` });
        expect(consoleSpy).toHaveBeenLastCalledWith(
          '[Analytics] Page View:',
          expect.stringContaining(`"segment":"${segment}"`)
        );
      });

      consoleSpy.mockRestore();
    });

    it('deve incluir timestamp automaticamente quando não fornecido', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const beforeTimestamp = Date.now();

      page_view({ segment: 'pizzaria', url: '/landing/pizzaria' });

      const callArg = consoleSpy.mock.calls[0][1] as string;
      const event = JSON.parse(callArg) as PageViewEvent;

      expect(event.timestamp).toBeDefined();
      expect(event.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(event.timestamp).toBeLessThanOrEqual(Date.now());

      consoleSpy.mockRestore();
    });

    it('deve usar timestamp fornecido quando disponível', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const customTimestamp = 1704067200000; // 2024-01-01 00:00:00 UTC

      page_view({ segment: 'hamburgueria', url: '/landing/hamburgueria', timestamp: customTimestamp });

      const callArg = consoleSpy.mock.calls[0][1] as string;
      const event = JSON.parse(callArg) as PageViewEvent;

      expect(event.timestamp).toBe(customTimestamp);

      consoleSpy.mockRestore();
    });

    it('deve fazer console.log do evento completo', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      page_view({ segment: 'bar', url: '/landing/bar' });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] Page View:',
        expect.stringContaining('"segment":"bar"')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] Page View:',
        expect.stringContaining('"url":"/landing/bar"')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] Page View:',
        expect.stringContaining('"timestamp":')
      );

      consoleSpy.mockRestore();
    });
  });
});
