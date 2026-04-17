/**
 * Constantes centralizadas do MenuLink
 * Substitui strings literais repetidas pelo codebase
 */

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
  cart: "menulink_cart",
} as const;
