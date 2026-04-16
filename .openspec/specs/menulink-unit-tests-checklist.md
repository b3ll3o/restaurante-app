# MenuLink - Unit Tests Checklist (TDD)

## Fonte da Verdade

Este documento contém o checklist de testes unitários para a lógica mínima necessária, derivados da `menulink-specification.md` e `menulink-technical-plan.md`.

---

## 1. Domain Layer (Types & Utils)

### 1.1 Tipos TypeScript

- [ ] `Restaurant` - validar campos obrigatórios (id, slug, name, owner_whatsapp, owner_id)
- [ ] `Category` - validar campos (id, restaurant_id, name, display_order)
- [ ] `Product` - validar campos (id, category_id, name, price, is_available, display_order)
- [ ] `Order` - validar status (pending, confirmed, cancelled)
- [ ] `OrderItem` - validar cálculo de total_price (unit_price * quantity)
- [ ] `CartItem` - validar que quantity > 0

### 1.2 Utils

- [ ] `cn()` - testar concatenação de classes com valores falsy
- [ ] `cn()` - testar sobrescrita de classes duplicates
- [ ] `formatPrice()` - testar formatação em BRL (R$ 1.234,56)
- [ ] `formatWhatsApp()` - testar validação de formato brasileiro
- [ ] `generateSlug()` - testar conversão de "Bar do João" → "bar-do-joao"
- [ ] `generateSlug()` - testar remoção de caracteres especiais
- [ ] `generateSlug()` - testar slug único (não vazio)

---

## 2. Cart Context (`context/cart-context.tsx`)

### 2.1 Adicionar ao Carrinho

- [ ] `addItem(product)` - adicionar produto novo ao carrinho vazio
- [ ] `addItem(product)` - adicionar produto já existente (incrementa quantidade)
- [ ] `addItem(product)` - adicionar produto com quantity específica
- [ ] `addItem(product)` - validar que produto tem id, name e price

### 2.2 Remover do Carrinho

- [ ] `removeItem(productId)` - remover item decrementando quantidade
- [ ] `removeItem(productId)` - remover completamente se quantity = 1
- [ ] `removeItem(productId)` - não fazer nada se item não existe

### 2.3 Atualizar Quantidade

- [ ] `updateQuantity(productId, quantity)` - atualizar quantidade válida
- [ ] `updateQuantity(productId, 0)` - remover item se quantity = 0
- [ ] `updateQuantity(productId, -1)` - não aceitar quantidade negativa

### 2.4 Limpar Carrinho

- [ ] `clearCart()` - remover todos os itens
- [ ] `clearCart()` - funcionar mesmo com carrinho vazio

### 2.5 Cálculo de Total

- [ ] `total` - calcular soma correta de (price * quantity) para cada item
- [ ] `total` - retornar 0 para carrinho vazio
- [ ] `itemCount` - retornar número total de itens (soma das quantities)

---

## 3. API Routes

### 3.1 `POST /api/orders`

#### Mocks e Stubs Necessários

```typescript
// Mock do Supabase Client
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

// Mock do WhatsApp Service
const mockWhatsAppService = {
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
};
```

#### Casos de Teste

- [ ] `POST /api/orders` - criar pedido com dados válidos
  - **Given**: customerName, customerWhatsapp, paymentMethod, items[], restaurantId válidos
  - **When**: POST request
  - **Then**: insert order + order_items, return 201
  - **Stub**: mockSupabase.insert → success

- [ ] `POST /api/orders` - falha ao não informar customerName
  - **Given**: customerName vazio
  - **When**: POST request
  - **Then**: return 400 com mensagem "Nome é obrigatório"

- [ ] `POST /api/orders` - falha ao não informar customerWhatsapp
  - **Given**: customerWhatsapp vazio
  - **When**: POST request
  - **Then**: return 400 com mensagem "WhatsApp é obrigatório"

- [ ] `POST /api/orders` - falha ao não informar paymentMethod
  - **Given**: paymentMethod vazio
  - **When**: POST request
  - **Then**: return 400 com mensagem "Forma de pagamento é obrigatória"

- [ ] `POST /api/orders` - falha com lista de items vazia
  - **Given**: items = []
  - **When**: POST request
  - **Then**: return 400 com mensagem "Pedido deve ter itens"

- [ ] `POST /api/orders` - falha se restaurant não existe
  - **Given**: restaurantId inválido
  - **When**: POST request
  - **Then**: return 404 com mensagem "Restaurante não encontrado"
  - **Stub**: mockSupabase.from('restaurants').select().single() → null

- [ ] `POST /api/orders` - cálculo correto do total
  - **Given**: items com product.price de 10.00 e 20.00, quantities 2 e 1
  - **When**: POST request
  - **Then**: total deve ser 40.00

- [ ] `POST /api/orders` - criação de OrderItems com dados denormalizados
  - **Given**: product com id, name, price
  - **When**: criar order
  - **Then**: OrderItem deve ter product_name (não só product_id) para histórico

- [ ] `POST /api/orders` - fallback se WhatsApp API falha
  - **Given**: WHATSAPP_TOKEN não configurado
  - **When**: POST request
  - **Then**: criar pedido mesmo sem enviar notificação WhatsApp
  - **Stub**: mockWhatsAppService.sendMessage → reject

### 3.2 `GET /api/orders` (futuro)

- [ ] listar pedidos do restaurante autenticado
- [ ] filtrar por restaurant_id do owner
- [ ] ordenar por created_at desc

### 3.3 `PATCH /api/orders/[id]`

- [ ] atualizar status para "confirmed"
- [ ] atualizar status para "cancelled"
- [ ] não permitir transição de "confirmed" para "cancelled"
- [ ] não permitir transição de "cancelled" para "confirmed"
- [ ] não permitir transição de "confirmed" para "pending"

---

## 4. WhatsApp Service

### 4.1 Message Formatting

- [ ] `formatOrderMessage(order)` - incluir nome do cliente
- [ ] `formatOrderMessage(order)` - listar todos os itens com quantity e preço
- [ ] `formatOrderMessage(order)` - incluir total do pedido
- [ ] `formatOrderMessage(order)` - incluir forma de pagamento

### 4.2 WhatsApp URL Generation

- [ ] `generateWhatsAppUrl(whatsapp, message)` - gerar URL correta wa.me
- [ ] `generateWhatsAppUrl(whatsapp, message)` - codificar mensagem para URL
- [ ] `generateWhatsAppUrl(whatsapp, message)` - remover caracteres não numéricos do telefone

### 4.3 WhatsApp API Integration

- [ ] `sendWhatsAppMessage(phoneNumberId, token, to, message)` - chamada correta à Graph API
- [ ] `sendWhatsAppMessage(...)` - usar Bearer token authentication
- [ ] `sendWhatsAppMessage(...)` - tratar erro 401 (token inválido)
- [ ] `sendWhatsAppMessage(...)` - tratar erro 400 (número inválido)
- [ ] `sendWhatsAppMessage(...)` - timeout após 10 segundos
- [ ] `sendWhatsAppMessage(...)` - fallback para redirect URL se API falhar

---

## 5. Supabase Storage (Upload de Imagens)

### 5.1 Image Upload

- [ ] `uploadProductImage(file, restaurantId)` - upload bem-sucedido
- [ ] `uploadProductImage(file, restaurantId)` - retornar URL pública
- [ ] `uploadProductImage(file, restaurantId)` - validar tipo (jpg, png, webp)
- [ ] `uploadProductImage(file, restaurantId)` - rejeitar arquivo > 5MB
- [ ] `uploadProductImage(file, restaurantId)` - rejeitar arquivo sem extensão de imagem

---

## 6. Auth/Authorization

### 6.1 Session Validation

- [ ] `getSession()` - retornar sessão válida
- [ ] `getSession()` - retornar null se não autenticado
- [ ] `getUser()` - retornar dados do usuário
- [ ] `getUser()` - throw error se token expirado

### 6.2 Route Protection

- [ ] `adminAuthMiddleware()` - redirecionar para /admin/login se não autenticado
- [ ] `adminAuthMiddleware()` - permitir acesso se autenticado

---

## 7. Slug Generation

### 7.1 Slug Utilities

- [ ] `generateSlug(name)` - converter para minúsculas
- [ ] `generateSlug(name)` - substituir espaços por hífens
- [ ] `generateSlug(name)` - remover acentos (ã → a)
- [ ] `generateSlug(name)` - remover caracteres especiais
- [ ] `generateSlug(name)` - remover múltiplos hífens consecutivos
- [ ] `generateSlug(name)` - remover hífens no início/fim

### 7.2 Slug Uniqueness

- [ ] `checkSlugUniqueness(slug)` - retornar true se slug disponível
- [ ] `checkSlugUniqueness(slug)` - retornar false se slug já existe
- [ ] `generateUniqueSlug(name)` - adicionar sufixo numérico se necessário (bar-do-joao-2)

---

## 8. Validação de Input

### 8.1 WhatsApp Validation

- [ ] `isValidWhatsApp("5511999999999")` - formato brasileiro com DDI/DDD
- [ ] `isValidWhatsApp("11999999999")` - formato brasileiro sem DDI
- [ ] `isValidWhatsApp("999999999")` - inválido (muito curto)
- [ ] `isValidWhatsApp("abc")` - inválido (não numérico)

### 8.2 Price Validation

- [ ] `isValidPrice(10.00)` - válido
- [ ] `isValidPrice(0)` - inválido (deve ser > 0)
- [ ] `isValidPrice(-5)` - inválido (negativo)
- [ ] `isValidPrice(1000000)` - válido (valor alto)

### 8.3 Name Validation

- [ ] `isValidName("João")` - válido (com acento)
- [ ] `isValidName("")` - inválido (vazio)
- [ ] `isValidName("a")` - inválido (muito curto, mínimo 2 caracteres)

---

## 9. Order Status State Machine

### 9.1 Valid Transitions

- [ ] `canTransitionTo("pending", "confirmed")` → true
- [ ] `canTransitionTo("pending", "cancelled")` → true
- [ ] `canTransitionTo("confirmed", "pending")` → false
- [ ] `canTransitionTo("confirmed", "cancelled")` → false
- [ ] `canTransitionTo("cancelled", "pending")` → false
- [ ] `canTransitionTo("cancelled", "confirmed")` → false

---

## 10. Carrinho (LocalStorage Persistence)

### 10.1 Persistence

- [ ] salvar carrinho no localStorage após cada modificação
- [ ] carregar carrinho do localStorage ao inicializar
- [ ] limpar carrinho do localStorage após pedido confirmado
- [ ] tratar erro se localStorage não disponível

---

## Executando os Testes

```bash
# Instalar dependências de teste
npm install --save-dev vitest @testing-library/react @vitest/jest-dom

# Executar todos os testes
npm run test

# Executar com coverage
npm run test:coverage

# Executar em watch mode
npm run test:watch
```

---

## Notas de Implementação

1. **Mocks para Supabase**: Usar `vi.mock('@/lib/supabase/client')` para isolar testes da dependência real do banco
2. **Mocks para WhatsApp API**: Isolar com `vi.mock('@/lib/whatsapp')`
3. **Mocks para localStorage**: Criar mock de `window.localStorage`
4. **Testes de API Routes**: Usar `fetch` direto em `/api/orders` ou supertest com Vitest

---

## Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-15 | AI Agent | Versão inicial |