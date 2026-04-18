/**
 * Schema Zod para validação de Restaurant
 *
 * Valida dados de restaurante coming from API responses ou form inputs.
 *
 * @module lib/schemas/restaurant
 */

import { z } from 'zod';

/**
 * Schema de validação para Restaurant
 *
 * Campos:
 * - id: UUID do restaurante
 * - name: Nome (1-100 caracteres)
 * - slug: URL slug (lowercase, alphanumeric com hífens)
 * - owner_whatsapp: WhatsApp brasileiro (10-15 dígitos)
 * - created_at: Timestamp ISO (opcional na criação)
 */
export const restaurantSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser UUID válido' }),
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug deve conter apenas letras minúsculas, números e hífens',
    })
    .min(1, { message: 'Slug é obrigatório' }),
  owner_whatsapp: z
    .string()
    .regex(/^\d{10,15}$/, {
      message: 'WhatsApp deve ter 10-15 dígitos (apenas números, com DDD)',
    }),
  created_at: z.string().datetime().optional(),
});

/**
 * Schema para criação de restaurante (sem id gerado pelo banco)
 */
export const createRestaurantSchema = restaurantSchema.omit({
  id: true,
  created_at: true,
});

/**
 * Schema para atualização de restaurante
 */
export const updateRestaurantSchema = restaurantSchema.partial().omit({
  created_at: true,
});

/**
 * Tipo inferido do schema
 */
export type RestaurantInput = z.infer<typeof restaurantSchema>;
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

/**
 * Valida dados de restaurante
 *
 * @param data - Dados a serem validados
 * @returns Result com RestaurantInput ou ZodError
 *
 * @example
 * ```typescript
 * const result = validateRestaurant({
 *   id: 'uuid-valido',
 *   name: 'Bar do João',
 *   slug: 'bar-do-joao',
 *   owner_whatsapp: '5511999999999',
 * });
 * ```
 */
export function validateRestaurant(data: unknown) {
  return restaurantSchema.safeParse(data);
}

/**
 * Valida dados para criação de restaurante
 *
 * @param data - Dados a serem validados
 * @returns Result com CreateRestaurantInput ou ZodError
 */
export function validateCreateRestaurant(data: unknown) {
  return createRestaurantSchema.safeParse(data);
}

/**
 * Valida dados para atualização de restaurante
 *
 * @param data - Dados a serem validados
 * @returns Result com UpdateRestaurantInput ou ZodError
 */
export function validateUpdateRestaurant(data: unknown) {
  return updateRestaurantSchema.safeParse(data);
}
