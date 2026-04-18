/**
 * Schema Zod para validação de Product
 *
 * Valida dados de produto coming from API responses ou form inputs.
 *
 * @module lib/schemas/product
 */

import { z } from 'zod';

/**
 * Schema de validação para Product
 *
 * Campos:
 * - id: UUID do produto
 * - category_id: UUID da categoria dona
 * - name: Nome do produto (1-100 caracteres)
 * - description: Descrição opcional (max 500 caracteres)
 * - price: Preço (número >= 0)
 * - image_url: URL da imagem (opcional, deve ser URL válida se fornecida)
 * - is_available: Se produto está disponível para venda
 * - display_order: Ordem de exibição (número >= 0)
 * - created_at: Timestamp ISO (opcional)
 */
export const productSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser UUID válido' }),
  category_id: z.string().uuid({ message: 'ID da categoria deve ser UUID válido' }),
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  description: z
    .string()
    .max(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
    .nullable()
    .optional(),
  price: z
    .number()
    .min(0, { message: 'Preço deve ser >= 0' }),
  image_url: z
    .string()
    .url({ message: 'URL da imagem inválida' })
    .nullable()
    .optional()
    .or(z.literal('').transform(() => null)),
  is_available: z.boolean().default(true),
  display_order: z
    .number()
    .int({ message: 'Ordem deve ser número inteiro' })
    .min(0, { message: 'Ordem deve ser >= 0' }),
  created_at: z.string().datetime().optional(),
});

/**
 * Schema para criação de produto (sem id gerado pelo banco)
 */
export const createProductSchema = productSchema.omit({
  id: true,
  created_at: true,
});

/**
 * Schema para atualização de produto
 */
export const updateProductSchema = productSchema
  .partial()
  .omit({ created_at: true });

/**
 * Tipo inferido do schema
 */
export type ProductInput = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

/**
 * Valida dados de produto
 *
 * @param data - Dados a serem validados
 * @returns Result com ProductInput ou ZodError
 */
export function validateProduct(data: unknown) {
  return productSchema.safeParse(data);
}

/**
 * Valida dados para criação de produto
 *
 * @param data - Dados a serem validados
 * @returns Result com CreateProductInput ou ZodError
 */
export function validateCreateProduct(data: unknown) {
  return createProductSchema.safeParse(data);
}

/**
 * Valida dados para atualização de produto
 *
 * @param data - Dados a serem validados
 * @returns Result com UpdateProductInput ou ZodError
 */
export function validateUpdateProduct(data: unknown) {
  return updateProductSchema.safeParse(data);
}
