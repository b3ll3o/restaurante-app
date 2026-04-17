/**
 * Analytics - Módulo de analytics para tracking de eventos
 * Usado para tracking de page views em landing pages segmentadas
 */

export type SegmentType = 'pizzaria' | 'hamburgueria' | 'bar' | 'restaurante';

export interface PageViewEvent {
  segment: SegmentType;
  url: string;
  timestamp?: number;
}

/**
 * Emite evento de page view para analytics
 * Por enquanto faz console.log; pode ser扩展 para GA4/GTM posteriormente
 */
export function page_view(event: PageViewEvent): void {
  const eventWithTimestamp: PageViewEvent = {
    ...event,
    timestamp: event.timestamp ?? Date.now(),
  };

  console.log('[Analytics] Page View:', JSON.stringify(eventWithTimestamp));
}
