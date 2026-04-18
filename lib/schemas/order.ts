/**
 * Schema Zod para validação de Order
 *
 * Valida dados de pedido coming from API responses ou form inputs.
 *
 * @module lib/schemas/order
 */

import { z } from 'zod';

/**
 * Status possíveis de um pedido
 */
export const orderStatusSchema = z.enum(['pending', 'confirmed', 'cancelled'], {
  message: 'Status deve ser: pending, confirmed ou cancelled',
});

/**
 * Métodos de pagamento válidos
 */
export const paymentMethodSchema = z.enum(['pix', 'cash', 'card'], {
  message: 'Forma de pagamento deve ser: pix, cash ou card',
});

/**
 * Schema de validação para Order
 *
 * Campos:
 * - id: UUID do pedido
 * - restaurant_id: UUID do restaurante
 * - customer_name: Nome do cliente (1-100 caracteres)
 * - customer_whatsapp: WhatsApp brasileiro (10-15 dígitos)
 * - total: Valor total (número >= 0)
 * - status: Status do pedido (pending, confirmed, cancelled)
 * - payment_method: Forma de pagamento (pix, cash, card)
 * - created_at: Timestamp ISO (opcional)
 */
export const orderSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser UUID válido' }),
  restaurant_id: z.string().uuid({ message: 'ID do restaurante deve ser UUID válido' }),
  customer_name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  customer_whatsapp: z
    .string()
    .regex(/^\d{10,15}$/, {
      message: 'WhatsApp deve ter 10-15 dígitos (apenas números, com DDD)',
    }),
  total: z
    .number()
    .min(0, { message: 'Total deve ser >= 0' }),
  status: orderStatusSchema,
  payment_method: paymentMethodSchema.nullable(),
  created_at: z.string().datetime().optional(),
});

/**
 * Schema para criação de pedido (sem id gerado pelo banco, sem total calculado)
 */
export const createOrderSchema = orderSchema.omit({
  id: true,
  total: true,
  status: true,
  created_at: true,
});

/**
 * Schema para atualização de pedido (status)
 */
export const updateOrderSchema = z.object({
  status: orderStatusSchema,
});

/**
 * Tipo inferido do schema
 */
export type OrderInput = z.infer<typeof orderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

/**
 * Valida dados de pedido
 *
 * @param data - Dados a serem validados
 * @returns Result com OrderInput ou ZodError
 */
export function validateOrder(data: unknown) {
  return orderSchema.safeParse(data);
}

/**
 * Valida dados para criação de pedido
 *
 * @param data - Dados a serem validados
 * @returns Result com CreateOrderInput ou ZodError
 */
export function validateCreateOrder(data: unknown) {
  return createOrderSchema.safeParse(data);
}

/**
 * Valida dados para atualização de pedido
 *
 * @param data - Dados a serem validados
 * @returns Result com UpdateOrderInput ou ZodError
 */
export function validateUpdateOrder(data: unknown) {
  return updateOrderSchema.safeParse(data);
}
