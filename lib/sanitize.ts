/**
 * Sanitização de dados sensíveis para logs e exposição
 * Proteger dados como WhatsApp, nome e campos sensíveis em logs e URLs
 */

// Mascarar WhatsApp: 5511999999999 → ****9999
export function maskWhatsApp(whatsapp: string): string {
  if (!whatsapp || whatsapp.length < 4) return '****';
  return '****' + whatsapp.slice(-4);
}

// Mascarar nome: Maria Silva → M****
export function maskName(name: string): string {
  if (!name || name.length < 2) return '****';
  return name[0] + '****';
}

// Sanitizar objeto para log (remove campos sensíveis)
export function sanitizeForLog<T extends Record<string, unknown>>(
  obj: T,
  fieldsToRemove: string[] = ['whatsapp', 'customer_whatsapp', 'password']
): Partial<T> {
  const sanitized = { ...obj };
  fieldsToRemove.forEach(field => delete sanitized[field]);
  return sanitized;
}

// Sanitizar URL (remove query params sensíveis)
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = ['whatsapp', 'phone', 'tel'];
    sensitiveParams.forEach(param => urlObj.searchParams.delete(param));
    return urlObj.toString();
  } catch {
    return url;
  }
}