/**
 * Schema Zod para validação de Category
 *
 * Valida dados de categoria de produtos coming from API responses ou form inputs.
 *
 * @module lib/schemas/category
 */

import { z } from 'zod';

/**
 * Schema de validação para Category
 *
 * Campos:
 * - id: UUID da categoria
 * - restaurant_id: UUID do restaurante dono
 * - name: Nome da categoria (1-50 caracteres)
 * - display_order: Ordem de exibição (número >= 0)
 * - created_at: Timestamp ISO (opcional)
 */
export const categorySchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser UUID válido' }),
  restaurant_id: z.string().uuid({ message: 'ID do restaurante deve ser UUID válido' }),
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  display_order: z
    .number()
    .int({ message: 'Ordem deve ser número inteiro' })
    .min(0, { message: 'Ordem deve ser >= 0' }),
  created_at: z.string().datetime().optional(),
});

/**
 * Schema para criação de categoria (sem id gerado pelo banco)
 */
export const createCategorySchema = categorySchema.omit({
  id: true,
  created_at: true,
});

/**
 * Schema para atualização de categoria
 */
export const updateCategorySchema = categorySchema
  .partial()
  .omit({ created_at: true })
  .extend({
    // restaurant_id não pode ser alterado em update
    restaurant_id: categorySchema.shape.restaurant_id.optional(),
  });

/**
 * Tipo inferido do schema
 */
export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

/**
 * Valida dados de categoria
 *
 * @param data - Dados a serem validados
 * @returns Result com CategoryInput ou ZodError
 */
export function validateCategory(data: unknown) {
  return categorySchema.safeParse(data);
}

/**
 * Valida dados para criação de categoria
 *
 * @param data - Dados a serem validados
 * @returns Result com CreateCategoryInput ou ZodError
 */
export function validateCreateCategory(data: unknown) {
  return createCategorySchema.safeParse(data);
}

/**
 * Valida dados para atualização de categoria
 *
 * @param data - Dados a serem validados
 * @returns Result com UpdateCategoryInput ou ZodError
 */
export function validateUpdateCategory(data: unknown) {
  return updateCategorySchema.safeParse(data);
}
