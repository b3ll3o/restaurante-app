/**
 * Constantes centralizadas do PediAi
 * Substitui strings literais repetidas pelo codebase
 */

// App Identity
export const APP_NAME = "PediAi";
export const APP_TAGLINE = "Cardápio digital sem comissão";

// Locale
export const LOCALE = {
  ptBR: "pt-BR",
} as const;

// Order Status (valores do banco)
export const ORDER_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
} as const;

// Status Display (labels para UI)
export const STATUS_LABELS = {
  [ORDER_STATUS.pending]: "Pendente",
  [ORDER_STATUS.confirmed]: "Confirmado",
  [ORDER_STATUS.cancelled]: "Cancelado",
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  online: "Conexão restaurada",
  offline: "Você está offline",
} as const;

// Currency
export const CURRENCY = {
  prefix: "R$ ",
  locale: LOCALE.ptBR,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  cart: `${APP_NAME.toLowerCase()}_cart`,
} as const;
