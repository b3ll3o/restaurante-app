/**
 * Schema Zod para validação de OrderItem
 *
 * Valida dados de item de pedido coming from API responses ou form inputs.
 *
 * @module lib/schemas/order-item
 */

import { z } from 'zod';

/**
 * Schema de validação para OrderItem
 *
 * Campos:
 * - id: UUID do item
 * - order_id: UUID do pedido dono
 * - product_id: UUID do produto
 * - product_name: Nome do produto (para histórico)
 * - unit_price: Preço unitário (número >= 0)
 * - quantity: Quantidade (número >= 1)
 * - total_price: Preço total (unit_price * quantity)
 */
export const orderItemSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser UUID válido' }),
  order_id: z.string().uuid({ message: 'ID do pedido deve ser UUID válido' }),
  product_id: z.string().uuid({ message: 'ID do produto deve ser UUID válido' }),
  product_name: z
    .string()
    .min(1, { message: 'Nome do produto é obrigatório' })
    .max(100, { message: 'Nome do produto deve ter no máximo 100 caracteres' }),
  unit_price: z
    .number()
    .min(0, { message: 'Preço unitário deve ser >= 0' }),
  quantity: z
    .number()
    .int({ message: 'Quantidade deve ser número inteiro' })
    .min(1, { message: 'Quantidade deve ser >= 1' }),
  total_price: z
    .number()
    .min(0, { message: 'Preço total deve ser >= 0' }),
});

/**
 * Schema para criação de item de pedido (sem id, sem total_price calculado)
 */
export const createOrderItemSchema = orderItemSchema.omit({
  id: true,
  total_price: true,
});

/**
 * Schema para criação de item de pedido com validação de total
 */
export const createOrderItemWithTotalSchema = orderItemSchema.omit({
  id: true,
}).refine(
  (data) => {
    // Valida que total_price = unit_price * quantity
    const calculatedTotal = data.unit_price * data.quantity;
    return Math.abs(calculatedTotal - data.total_price) < 0.01; // Tolerância para floating point
  },
  {
    message: 'Total price deve ser igual a unit_price * quantity',
    path: ['total_price'],
  }
);

/**
 * Tipo inferido do schema
 */
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateOrderItemWithTotalInput = z.infer<typeof createOrderItemWithTotalSchema>;

/**
 * Valida dados de item de pedido
 *
 * @param data - Dados a serem validados
 * @returns Result com OrderItemInput ou ZodError
 */
export function validateOrderItem(data: unknown) {
  return orderItemSchema.safeParse(data);
}

/**
 * Valida dados para criação de item de pedido
 *
 * @param data - Dados a serem validados
 * @returns Result com CreateOrderItemInput ou ZodError
 */
export function validateCreateOrderItem(data: unknown) {
  return createOrderItemSchema.safeParse(data);
}

/**
 * Valida dados para criação de item de pedido com total
 *
 * @param data - Dados a serem validados
 * @returns Result com CreateOrderItemWithTotalInput ou ZodError
 */
export function validateCreateOrderItemWithTotal(data: unknown) {
  return createOrderItemWithTotalSchema.safeParse(data);
}
