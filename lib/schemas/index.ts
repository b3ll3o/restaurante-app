/**
 * Barrel export para schemas Zod de validação
 *
 * Este módulo exports todos os schemas de validação do domínio,
 * facilitando importações em qualquer parte da aplicação.
 *
 * @module lib/schemas
 */

// Restaurant schemas
export {
  restaurantSchema,
  createRestaurantSchema,
  updateRestaurantSchema,
  validateRestaurant,
  validateCreateRestaurant,
  validateUpdateRestaurant,
  type RestaurantInput,
  type CreateRestaurantInput,
  type UpdateRestaurantInput,
} from './restaurant';

// Category schemas
export {
  categorySchema,
  createCategorySchema,
  updateCategorySchema,
  validateCategory,
  validateCreateCategory,
  validateUpdateCategory,
  type CategoryInput,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from './category';

// Product schemas
export {
  productSchema,
  createProductSchema,
  updateProductSchema,
  validateProduct,
  validateCreateProduct,
  validateUpdateProduct,
  type ProductInput,
  type CreateProductInput,
  type UpdateProductInput,
} from './product';

// Order schemas
export {
  orderSchema,
  createOrderSchema,
  updateOrderSchema,
  orderStatusSchema,
  paymentMethodSchema,
  validateOrder,
  validateCreateOrder,
  validateUpdateOrder,
  type OrderInput,
  type CreateOrderInput,
  type UpdateOrderInput,
  type OrderStatus,
  type PaymentMethod,
} from './order';

// OrderItem schemas
export {
  orderItemSchema,
  createOrderItemSchema,
  createOrderItemWithTotalSchema,
  validateOrderItem,
  validateCreateOrderItem,
  validateCreateOrderItemWithTotal,
  type OrderItemInput,
  type CreateOrderItemInput,
  type CreateOrderItemWithTotalInput,
} from './order-item';
