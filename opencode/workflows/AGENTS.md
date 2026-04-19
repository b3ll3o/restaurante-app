# Workflows - MenuLink

## Visão Geral

Este documento cataloga todos os fluxos (workflows) da aplicação MenuLink, organizados por categoria. Cada fluxo descreve etapas sequenciais, arquivos envolvidos, estados, decisões, API calls e interações de usuário.

**Idioma**: Português Brasileiro (pt-BR)
**Última Atualização**: 2026-04-19

---

## Índice

1. [Fluxos de Autenticação](#1-fluxos-de-autenticação) — 5 fluxos
2. [Fluxos de Carrinho](#2-fluxos-de-carrinho) — 3 fluxos
3. [Fluxos de Pedido (Checkout)](#3-fluxos-de-pedido-checkout) — 3 fluxos
4. [Fluxos Administrativos](#4-fluxos-administrativos) — 5 fluxos
5. [Fluxos de Integração Externa](#5-fluxos-de-integração-externa) — 1 fluxo

---

## 1. Fluxos de Autenticação

### 1.1 Login Admin

**Arquivo**: `app/admin/login/page.tsx`

**Descrição**: Fluxo de autenticação de administradores. Usuário insere credenciais email/senha para acessar o dashboard.

**Etapas**:
1. Usuário acessa `/admin/login`
2. Renderiza formulário com campos email e senha
3. Usuário preenche email e senha
4. Usuário clica em "Entrar"
5. `handleSubmit` captura evento `onSubmit`
6. Validação básica (campos não vazios)
7. `supabase.auth.signInWithPassword({ email, password })`
8. Se erro `email_not_confirmed`: exibe banner para reenvio de email
9. Se outro erro: exibe "Email ou senha incorretos"
10. Se sucesso: `router.push('/admin/dashboard')` e `router.refresh()`

**Estados**: `idle` → `loading` → `error` | `success`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `error.code === 'email_not_confirmed'` | Exibe banner com botão para reenviar email | Exibe mensagem genérica |
| Login bem-sucedido | Redirect `/admin/dashboard` | Permanece com mensagem |

**API Calls**:
- `supabase.auth.signInWithPassword({ email, password })` → `{ data: { user, session }, error }`
- `resendConfirmationEmail(email)` → `{ success, error? }`

**Arquivos**: `app/admin/login/page.tsx`, `lib/supabase/client.ts`, `lib/supabase/auth.ts`

---

### 1.2 Logout

**Arquivo**: `components/admin/header.tsx`

**Descrição**: Admin clica em "Sair" para encerrar sessão.

**Etapas**:
1. Admin está em qualquer página `/admin/*`
2. Header exibe botão "Sair" com ícone LogOut
3. Admin clica no botão "Sair"
4. `handleSignOut` é chamado
5. `setIsLoading(true)` — botão fica desabilitado
6. `await supabase.auth.signOut()`
7. `window.location.href = '/admin/login'` — redirect hard

**Estados**: `idle` | `loading`

**API Calls**:
- `supabase.auth.signOut()` → `{ error }`

**Arquivos**: `components/admin/header.tsx`, `lib/supabase/client.ts`

---

### 1.3 Signup Admin

**Arquivo**: `app/admin/signup/page.tsx`

**Descrição**: Cadastro de novo administrador. Cria conta no Supabase Auth e registra restaurante com dados iniciais.

**Etapas**:
1. Usuário acessa `/admin/signup`
2. Renderiza formulário: email, senha, nome restaurante, WhatsApp
3. Usuário preenche todos os campos
4. Usuário clica em "Create Account"
5. `handleSubmit` captura evento `onSubmit`
6. `setLoading(true)`
7. `supabase.auth.signUp` com `options.data` contendo `restaurant_name` e `whatsapp_number`
8. Se `signUpError`: exibe mensagem de erro
9. Se sucesso e `data.user` existe: `router.push('/admin/dashboard')`

**Estados**: `idle` → `loading` → `error` | `success`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `signUpError` existe | Exibe mensagem de erro | Prossegue |
| `data.user` existe após signup | Redirect `/admin/dashboard` | Permanece (precisa confirmar email) |

**API Calls**:
- `supabase.auth.signUp({ email, password, options: { data: { restaurant_name, whatsapp_number } } })` → `{ data: { user, session }, error }`

**Arquivos**: `app/admin/signup/page.tsx`, `lib/supabase/client.ts`

---

### 1.4 OAuth Callback

**Arquivo**: `app/admin/auth/callback/route.ts`

**Descrição**: Endpoint que processa callback após autenticação OAuth/Email link do Supabase. Troca código por sessão.

**Etapas**:
1. Supabase redireciona para `/admin/auth/callback?code=XXX&next=/admin/dashboard`
2. GET request recebe URL com `searchParams`
3. Extrai `code` dos `searchParams`
4. Extrai `next` (default: `/admin/dashboard`)
5. Se `code` existe: `createClient()` do servidor
6. `exchangeCodeForSession(code)` para trocar código por sessão
7. Se `!error`: `NextResponse.redirect(origin + next)`
8. Se `error`: `NextResponse.redirect(origin + /admin/login?error=auth_callback_failed)`

**Estados**: `processing` | `success` | `error`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `code` existe na URL | Prossegue com troca | Redirect `/admin/login?error=...` |
| `exchangeCodeForSession` sem erro | Redirect para `next` | Redirect `/admin/login?error=...` |

**API Calls**:
- `supabase.auth.exchangeCodeForSession(code)` → `{ data: { user, session }, error }`

**Arquivos**: `app/admin/auth/callback/route.ts`, `lib/supabase/server.ts`

---

### 1.5 Auth Check (Proteção de Rotas)

**Arquivo**: `app/admin/layout.tsx`

**Descrição**: Middleware client-side que verifica autenticação em todas as rotas admin. Redireciona para login se não autenticado.

**Etapas**:
1. Componente renderiza com `isLoading=true`
2. `useEffect` executa no mount
3. Verifica se pathname é `/admin/login` — se sim, `setIsLoading(false)` e retorna
4. `Promise.race` entre `getSession()` e timeout de 5s
5. Se session existe: `setUserEmail(session.user.email)`, `setIsLoading(false)`
6. Se session é null: `router.push('/admin/login')`
7. Listener `onAuthStateChange`: se session null, redirect para login
8. Cleanup: unsubscribe do listener
9. Se `isLoading`: renderiza Loader2 spinner centralizado
10. Se `!isLoading`: renderiza Sidebar (desktop) + Sheet (mobile) + Header + children

**Estados**: `loading` | `authenticated` | `unauthenticated`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `pathname === '/admin/login'` | Skip verificação | Prossegue com auth check |
| `getSession()` retorna sessão válida | Exibe conteúdo admin | Redirect `/admin/login` |
| `onAuthStateChange` detecta session null | Redirect `/admin/login` | Mantém sessão |

**API Calls**:
- `supabase.auth.getSession()` → `{ data: { session }, error }`
- `supabase.auth.onAuthStateChange` → `{ data: { subscription } }`

**Arquivos**: `app/admin/layout.tsx`, `components/admin/sidebar.tsx`, `components/admin/header.tsx`, `lib/supabase/client.ts`, `components/ui/sheet.tsx`

**Rotas Protegidas**: `/admin/*` (exceto `/admin/login` e `/admin/signup`)

---

## 2. Fluxos de Carrinho

### 2.1 Adicionar ao Carrinho

**Arquivo**: `context/cart-context.tsx` + `app/menu/[slug]/page.tsx`

**Descrição**: Cliente adiciona produto ao carrinho na página do cardápio público. Carrinho é isolado por `restaurantId`.

**Etapas**:
1. Cliente acessa `/menu/[slug]` — página carrega dados do restaurante
2. `useEffect` busca restaurante, categorias e produtos do Supabase
3. `CartProvider` inicializa estado do localStorage
4. Cliente visualiza categorias colapsáveis com produtos
5. Cliente clica em "+" (Adicionar) em um `ProductCard`
6. `onAdd(product)` é chamado
7. `addItem(product, restaurantId)` dispatch `ADD_ITEM`
8. Reducer verifica se item já existe no carrinho
9. Se existe: `quantity + 1`
10. Se não existe: adiciona novo item com `quantity=1`, define `restaurantId`
11. `useEffect` detecta mudança e `saveToStorage(localStorage)`
12. UI atualiza: badge do carrinho incrementa, controles `+/-` aparecem

**Estados**: `cart: empty` | `cart: has items` | `product: quantity 0` | `product: quantity > 0`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| Item já existe (`item.product.id === action.product.id`) | Incrementa `quantity` em 1 | Adiciona novo `CartItem` |
| `typeof window !== 'undefined'` (cliente) | Permite operações localStorage | Retorna estado vazio |

**API Calls**: Nenhuma (localStorage apenas)

**Arquivos**: `context/cart-context.tsx`, `app/menu/[slug]/page.tsx`, `types/index.ts`

---

### 2.2 Remover do Carrinho

**Arquivo**: `context/cart-context.tsx`

**Descrição**: Cliente remove produto do carrinho. Pode remover uma unidade (decrementa) ou remover completamente (quando `quantity=1`).

**Etapas**:
1. Cliente está no Sheet do carrinho (`checkoutStep='cart'`)
2. Cliente clica em "-" ou "lixeira" em `CartItemCard`
3. `onRemove(item.product.id)` é chamado
4. `removeItem(productId)` dispatch `REMOVE_ITEM`
5. Reducer filtra: `items.filter(item => item.product.id !== action.productId)`
6. `useEffect` detecta mudança e `saveToStorage()`
7. UI atualiza: item removido, total decrementa
8. Se último item, carrinho fica vazio

**Estados**: `cart: has items` | `cart: empty after removal`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `quantity === 1` ao clicar "-" | Item completamente removido (`REMOVE_ITEM`) | `UPDATE_QUANTITY` com `quantity-1` |

**Arquivos**: `context/cart-context.tsx`, `app/menu/[slug]/page.tsx`

---

### 2.3 Persistência do Carrinho

**Arquivo**: `context/cart-context.tsx`

**Descrição**: Carrinho persistido em localStorage com chave `menulink_cart`. Dados sobrevivem refresh mas são isolados por restaurante.

**Etapas**:
1. `CartProvider` inicializa `useReducer` com estado `{ items: [], restaurantId: null }`
2. `useEffect` no mount: `loadFromStorage()`
3. `loadFromStorage()`: verifica `typeof window`, tenta `localStorage.getItem('menulink_cart')`
4. Se existe: `JSON.parse()` e retorna `{ items, restaurantId }`
5. Se erro: `console.warn` e retorna estado vazio
6. `dispatch LOAD_FROM_STORAGE` com payload carregado
7. `useEffect` em `[state]`: `saveToStorage(state)`
8. `saveToStorage()`: cria objeto `{ items, restaurantId, updatedAt: Date.now() }`
9. `localStorage.setItem('menulink_cart', JSON.stringify(stored))`
10. Se erro: `console.warn`

**Estados**: `loading` (hydrate) | `loaded` | `saving`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `typeof window === 'undefined'` (SSR) | Retorna estado vazio | Prossegue com localStorage |
| `localStorage.getItem` não encontra dados | Retorna estado vazio | Parse e restaura dados |

**Arquivos**: `context/cart-context.tsx`

---

## 3. Fluxos de Pedido (Checkout)

### 3.1 Visualização do Cardápio

**Arquivo**: `app/menu/[slug]/page.tsx`

**Descrição**: Cliente acessa cardápio público via URL `/menu/[slug]`. Sistema busca restaurante, categorias e produtos disponíveis.

**Etapas**:
1. Cliente acessa `/menu/[slug]` onde `slug` identifica restaurante
2. `params.slug` extraído via `useParams()`
3. `useEffect` executa `fetchMenu()`
4. Supabase: busca restaurante `WHERE slug = slug`
5. Se restaurante não existe: renderiza "Cardápio não encontrado"
6. Supabase: busca categorias `WHERE restaurant_id = restaurant.id ORDER BY display_order`
7. Para cada categoria: Supabase busca produtos `WHERE category_id = category.id AND is_available = true`
8. `setMenuData({ restaurant, categories: categoriesWithProducts })`
9. `setExpandedCategory(categoriesWithProducts[0].id)` — primeira categoria expandida
10. Renderiza header com nome do restaurante + FAB carrinho
11. Renderiza lista de categorias com accordion (apenas uma expandida por vez)
12. Mobile: FAB fixo no bottom se `totalItems > 0`

**Estados**: `loading` | `loaded` | `not_found` | `empty`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `restaurantError \|\| !restaurant` | Renderiza 404 "Cardápio não encontrado" | Prossegue |
| `categories.length === 0` | Renderiza "Nenhum produto disponível" | Renderiza categorias |
| `expandedCategory === category.id` | Collapse | Expand |

**API Calls**:
- `supabase.from('restaurants').select('*').eq('slug', slug)` → `Restaurant`
- `supabase.from('categories').select('*').eq('restaurant_id', restaurant.id)` → `Category[]`
- `supabase.from('products').select('*').eq('category_id', category.id).eq('is_available', true)` → `Product[]`

**Arquivos**: `app/menu/[slug]/page.tsx`, `context/cart-context.tsx`, `lib/supabase/client.ts`, `types/index.ts`

---

### 3.2 Checkout (Finalização de Pedido)

**Arquivo**: `app/menu/[slug]/page.tsx`

**Descrição**: Cliente preenche dados para finalizar pedido: nome, WhatsApp, método de pagamento. Após validação, chama API de criação.

**Etapas**:
1. Cliente adiciona itens ao carrinho
2. Cliente abre Sheet do carrinho (clica FAB ou ícone carrinho)
3. `checkoutStep = 'cart'` inicialmente
4. Cliente clica "Continuar" → `handleProceedToCheckout()`
5. `setCheckoutStep('checkout')`, limpa erros
6. Sheet exibe formulário: nome, WhatsApp, método pagamento (PIX ou Dinheiro)
7. Cliente preenche dados e clica "Confirmar e Enviar"
8. `validateWhatsApp()`: verifica 10-13 dígitos
9. Se inválido: `setWhatsappError` e retorna
10. `handlePlaceOrder()`: `fetch POST /api/orders`
11. Body: `{ customerName, customerWhatsapp, paymentMethod, items, total, restaurantId }`
12. Se `response.ok`: `setCheckoutStep('success')`, `clearCart()`
13. After 2s: `window.open` wa.me com mensagem formatada
14. Reset: `setCartOpen(false)`, `checkoutStep='cart'`, limpa campos

**Estados**: `cart` | `checkout` | `success` | `error`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `validateWhatsApp()` true | Prossegue com criação | Exibe "Digite um WhatsApp válido" |
| `response.ok` após POST | Step 'success', abre WhatsApp | Exibe `orderError` |
| `paymentMethod === 'pix'` | Label: "Transferência" | Label: "Na entrega" |

**API Calls**:
- `POST /api/orders` body `{ customerName, customerWhatsapp, paymentMethod, items, total, restaurantId }` → `{ success, order }`

**Arquivos**: `app/menu/[slug]/page.tsx`, `context/cart-context.tsx`, `lib/sanitize.ts`, `lib/constants.ts`

---

### 3.3 Criação do Pedido (API)

**Arquivo**: `app/api/orders/route.ts`

**Descrição**: Endpoint POST `/api/orders` que cria pedido no banco e envia notificação WhatsApp para o restaurante.

**Etapas**:
1. Request POST com JSON body
2. `createClient()` do servidor (com cookies)
3. Extrai campos: `customerName`, `customerWhatsapp`, `paymentMethod`, `items`, `total`, `restaurantId`
4. Validação: campos obrigatórios presentes
5. Se inválido: `return 400 { error: 'Missing required fields' }`
6. Busca restaurante: `supabase.from('restaurants').select('id, owner_whatsapp, name').eq('id', restaurantId)`
7. Se restaurante não existe: `return 404 { error: 'Restaurant not found' }`
8. Insert order: `supabase.from('orders').insert({ restaurant_id, customer_name, customer_whatsapp, total, payment_method, status: 'pending' })`
9. Se `orderError`: `return 500 { error: orderError.message }`
10. Mapeia items para `order_items`: `{ order_id, product_id, product_name, unit_price, quantity, total_price }`
11. Insert `order_items`: `supabase.from('order_items').insert(orderItems)`
12. Se `itemsError`: delete order, `return 500`
13. `formatOrderMessage()` gera texto do pedido
14. `sendWhatsAppMessage()` com `owner_whatsapp` do restaurante
15. `return 201 { success: true, order }` com WhatsApp mascarado

**Estados**: `processing` | `validation_error (400)` | `restaurant_not_found (404)` | `created (201)` | `error (500)`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| Campos obrigatórios presentes | Prossegue | Return 400 |
| Restaurante existe | Prossegue | Return 404 |
| Order insert succeed | Prossegue com items | Return 500 |
| Order items insert succeed | Prossegue com WhatsApp | Delete order, return 500 |

**API Calls**:
- `supabase.from('orders').insert()` → `Order`
- `supabase.from('order_items').insert()` → `OrderItem[]`
- `supabase.from('orders').delete().eq('id', order.id)` — rollback
- `sendWhatsAppMessage()` → `WhatsAppResponse`

**Arquivos**: `app/api/orders/route.ts`, `lib/supabase/server.ts`, `lib/whatsapp.ts`, `lib/sanitize.ts`, `lib/constants.ts`

---

## 4. Fluxos Administrativos

### 4.1 Dashboard

**Arquivo**: `app/admin/dashboard/page.tsx`

**Descrição**: Página principal do admin exibindo métricas do restaurante: categorias, produtos, pedidos pendentes e pedidos do dia.

**Etapas**:
1. Página carrega com `loading=true`
2. `useEffect` executa `fetchData()`
3. Define `today = new Date().toISOString().split('T')[0]`
4. `Promise.all`: categories count, products count, orders (últimos 5)
5. Busca pending orders count `WHERE status = 'pending'`
6. Busca today orders count `WHERE created_at >= today`
7. `setStats` com contagens
8. `setRecentOrders` com `orders.data`
9. `setLoading(false)`
10. Renderiza grid 2x2 (mobile) ou 4 colunas (desktop) com Cards
11. Cada Card: ícone + título + valor + descrição
12. Seção "Pedidos Recentes": lista últimos 5 pedidos com status badge

**Estados**: `loading` | `loaded` | `empty`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `recentOrders.length === 0` | Exibe "Nenhum pedido ainda" | Lista pedidos com badge |

**API Calls**:
- `supabase.from('categories').select('id', { count: 'exact' })` → count
- `supabase.from('products').select('id', { count: 'exact' })` → count
- `supabase.from('orders').select('*').order('created_at').limit(5)` → `Order[]`
- `supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending')` → count
- `supabase.from('orders').select('id', { count: 'exact' }).gte('created_at', today)` → count

**Arquivos**: `app/admin/dashboard/page.tsx`, `lib/supabase/client.ts`, `components/ui/card.tsx`, `components/ui/badge.tsx`, `lib/constants.ts`

---

### 4.2 CRUD de Categorias

**Arquivo**: `app/admin/categories/page.tsx`

**Descrição**: Interface admin para gerenciar categorias: criar, editar, excluir e reordenar.

**Etapas**:
1. Página carrega, `useEffect` executa `fetchCategories()`
2. `supabase.from('categories').select('*').order('display_order')`
3. `setCategories(data)`, `setLoading(false)`
4. Renderiza header "Categorias" + Dialog trigger "Nova Categoria"
5. Clique em "Nova Categoria" ou "Editar": `handleOpenDialog(category?)`
6. Dialog abre com form: nome + ordem de exibição
7. `handleSave()`: se `editingCategory` existe → UPDATE, senão → INSERT
8. UPDATE: `supabase.from('categories').update({ name, display_order }).eq('id', editingCategory.id)`
9. INSERT: `supabase.from('categories').insert({ name, display_order })`
10. `handleDelete(id)`: `confirm()`, `supabase.from('categories').delete().eq('id', id)`
11. Desktop (≥1024px): Table com colunas Ordem, Nome, Ações
12. Mobile (<1024px): Cards com Badge de ordem e botões Editar/Excluir
13. Alert success/error aparece por 3s após operações

**Estados**: `loading` | `loaded` | `creating` | `editing` | `deleting`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `editingCategory` existe | Dialog "Editar Categoria", UPDATE | Dialog "Nova Categoria", INSERT |
| `categories.length === 0` | Exibe "Criar primeira categoria" | Exibe Table ou Cards |

**API Calls**:
- GET: `supabase.from('categories').select('*').order('display_order')` → `Category[]`
- POST: `supabase.from('categories').insert({ name, display_order })` → `Category`
- PATCH: `supabase.from('categories').update({ name, display_order }).eq('id', id)` → `null`
- DELETE: `supabase.from('categories').delete().eq('id', id)` → `null`

**Arquivos**: `app/admin/categories/page.tsx`, `lib/supabase/client.ts`, `components/ui/dialog.tsx`, `components/ui/table.tsx`, `components/ui/card.tsx`, `components/ui/badge.tsx`

---

### 4.3 CRUD de Produtos

**Arquivo**: `app/admin/products/page.tsx`

**Descrição**: Interface admin para gerenciar produtos: criar, editar, excluir, upload de imagem e toggle de disponibilidade.

**Etapas**:
1. Página carrega, `useEffect` executa `Promise.all([fetchCategories(), fetchProducts()])`
2. `fetchProducts`: `supabase.from('products').select('*').order('display_order')`
3. `fetchCategories`: `supabase.from('categories').select('id, name').order('display_order')`
4. `setLoading(false)`
5. Dialog trigger "Novo Produto": `handleOpenDialog()` sem parâmetro
6. Dialog: form com nome, descrição, preço, ordem, categoria (Select), imagem (Input file), disponibilidade (Switch)
7. `handleOpenDialog(product?)` preenche `formData` se editando
8. `handleSave()`: se `imageFile`, `uploadImage()` primeiro
9. `uploadImage()`: gera filename único, faz upload para Supabase Storage `product-images`
10. `handleSave()` continua: INSERT ou UPDATE em products
11. `handleDelete(id)`: `confirm()`, delete
12. Desktop: Table com Imagem, Nome, Categoria, Preço, Status, Ações
13. Mobile (<1024px): Cards com imagem, nome, categoria badge, preço, botões

**Estados**: `loading` | `loaded` | `creating` | `editing` | `uploading` | `deleting`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `imageFile` existe | Chama `uploadImage()` antes de salvar | Usa `image_url` existente ou null |
| `editingProduct` existe | UPDATE products | INSERT products |
| `uploadImage` succeed | Prossegue com INSERT/UPDATE | `setAlert` error |

**API Calls**:
- GET products: `supabase.from('products').select('*').order('display_order')` → `Product[]`
- GET categories: `supabase.from('categories').select('id, name').order('display_order')` → `Category[]`
- POST upload: `supabase.storage.from('product-images').upload(filePath, file)` → `StorageError`
- GET public URL: `supabase.storage.from('product-images').getPublicUrl(filePath)` → `{ publicUrl }`
- POST: `supabase.from('products').insert(productData)` → `Product`
- PATCH: `supabase.from('products').update(productData).eq('id', id)` → `null`
- DELETE: `supabase.from('products').delete().eq('id', id)` → `null`

**Arquivos**: `app/admin/products/page.tsx`, `lib/supabase/client.ts`, `components/ui/dialog.tsx`, `components/ui/select.tsx`, `components/ui/switch.tsx`, `components/ui/textarea.tsx`, `lib/constants.ts`

---

### 4.4 Gestão de Pedidos

**Arquivo**: `app/admin/orders/page.tsx`

**Descrição**: Interface admin para visualizar pedidos, ver detalhes, confirmar ou cancelar pedidos.

**Etapas**:
1. Página carrega, `useEffect` executa `fetchOrders()`
2. `supabase.from('orders').select('*').order('created_at', { ascending: false })`
3. `setOrders(data)`, `setLoading(false)`
4. Renderiza header "Pedidos" + Card com lista
5. Desktop: Table com Cliente, WhatsApp (link wa.me), Total, Pagamento, Status, Data/Hora, Ações
6. Mobile (<1024px): Cards com detalhes similares
7. Clique "Ver detalhes": `handleViewDetails(order)`
8. `fetchOrderItems(orderId)`: `supabase.from('order_items').select('*').eq('order_id', orderId)`
9. Dialog abre com detalhes completos + itens do pedido
10. Se `order.status === 'pending'`: botões Confirmar (verde) e Cancelar (vermelho) ativos
11. `handleUpdateStatus(orderId, status)`: `supabase.from('orders').update({ status }).eq('id', orderId)`
12. Dialog de detalhes fecha após ação

**Estados**: `loading` | `loaded` | `empty` | `viewing_details` | `updating_status`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `order.status === 'pending'` | Exibe botões Confirmar/Cancelar | Não exibe ações |
| `orders.length === 0` | Exibe "Nenhum pedido recebido ainda" | Lista pedidos |

**API Calls**:
- GET orders: `supabase.from('orders').select('*').order('created_at', { ascending: false })` → `Order[]`
- GET order items: `supabase.from('order_items').select('*').eq('order_id', orderId)` → `OrderItem[]`
- PATCH: `supabase.from('orders').update({ status }).eq('id', orderId)` → `null`

**Arquivos**: `app/admin/orders/page.tsx`, `lib/supabase/client.ts`, `components/ui/dialog.tsx`, `components/ui/table.tsx`, `lib/constants.ts`

---

### 4.5 Configurações do Restaurante

**Arquivo**: `app/admin/settings/page.tsx`

**Descrição**: Interface admin para editar informações do restaurante (nome, WhatsApp) e copiar link do cardápio.

**Etapas**:
1. Página carrega com `loading=true`
2. `useEffect` executa `fetchRestaurant()`
3. `supabase.auth.getUser()` para obter user
4. `supabase.from('restaurants').select('*').eq('owner_id', user.id).single()`
5. `setRestaurant(restaurantData)`, `setFormData({ name, owner_whatsapp })`
6. `setLoading(false)`
7. Renderiza header "Configurações" + 2 Cards
8. Card 1 "Informações do Restaurante": Inputs para nome e WhatsApp + botão Salvar
9. Card 2 "Link do Cardápio": Input readonly com URL + botão Copiar
10. `menuUrl = ${window.location.origin}/menu/${restaurant.slug}`
11. `handleSave()`: `supabase.from('restaurants').update({ name, owner_whatsapp }).eq('id', restaurant.id)`
12. `setAlert` success/error por 3s
13. Copiar: `navigator.clipboard.writeText(menuUrl)`, `setAlert('Link copiado!')`

**Estados**: `loading` | `loaded` | `saving` | `copying`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| Restaurant existe para user | Exibe formulários preenchidos | Exibe página vazia |

**API Calls**:
- `supabase.auth.getUser` → `{ data: { user } }`
- GET: `supabase.from('restaurants').select('*').eq('owner_id', user.id).single()` → `Restaurant`
- PATCH: `supabase.from('restaurants').update({ name, owner_whatsapp }).eq('id', restaurant.id)` → `null`

**Arquivos**: `app/admin/settings/page.tsx`, `lib/supabase/client.ts`, `components/ui/card.tsx`, `components/ui/input.tsx`

---

## 5. Fluxos de Integração Externa

### 5.1 Notificação WhatsApp

**Arquivo**: `lib/whatsapp.ts`

**Descrição**: Módulo de integração com WhatsApp Business API. Formata mensagens de pedido e envia notificações para o restaurante.

**Etapas**:
1. App API route chama `sendWhatsAppMessage(phoneNumberId, token, to, message)`
2. Validação: `token` e `phoneNumberId` devem existir
3. Se inválido: `return { success: false, error: 'WhatsApp não configurado' }`
4. Fetch POST para `https://graph.facebook.com/v18.0/{phoneNumberId}/messages`
5. Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
6. Body: `messaging_product: 'whatsapp'`, `to`, `type: 'text'`, `text: { body: message }`
7. Se `response.ok`: `return { success: true, messageId: data.messages[0].id }`
8. Se erro: `return { success: false, error: 'Erro ao enviar mensagem' }`
9. Se exception: `return { success: false, error: 'Falha ao enviar mensagem' }`
10. `formatOrderMessage(order, items)`: formata texto com markdown WhatsApp
11. `generateWhatsAppUrl(whatsapp, message)`: gera URL wa.me com texto pré-codificado

**Estados**: `sending` | `success` | `not_configured` | `error`

**Decisões**:
| Condição | True | False |
|----------|------|-------|
| `token && phoneNumberId` existem | Prossegue com envio | Log warning, retorna sem enviar |
| `response.ok` | Extrai `messageId`, retorna success | Log error, retorna failure |

**API Calls**:
- POST: `https://graph.facebook.com/v18.0/{phoneNumberId}/messages`
  - Headers: `{ Authorization: Bearer token, Content-Type: application/json }`
  - Body: `{ messaging_product, to, type, text }`
  - Returns: `{ messages: [{ id }] }`

**Arquivos**: `lib/whatsapp.ts`, `app/api/orders/route.ts`

---

## Resumo

| # | Fluxo | Categoria | Arquivo Principal |
|---|-------|-----------|-------------------|
| 1 | Login Admin | Auth | `app/admin/login/page.tsx` |
| 2 | Logout | Auth | `components/admin/header.tsx` |
| 3 | Signup Admin | Auth | `app/admin/signup/page.tsx` |
| 4 | OAuth Callback | Auth | `app/admin/auth/callback/route.ts` |
| 5 | Auth Check (Proteção de Rotas) | Auth | `app/admin/layout.tsx` |
| 6 | Adicionar ao Carrinho | Cart | `context/cart-context.tsx` |
| 7 | Remover do Carrinho | Cart | `context/cart-context.tsx` |
| 8 | Persistência do Carrinho | Cart | `context/cart-context.tsx` |
| 9 | Visualização do Cardápio | User | `app/menu/[slug]/page.tsx` |
| 10 | Checkout | Order | `app/menu/[slug]/page.tsx` |
| 11 | Criação do Pedido (API) | API | `app/api/orders/route.ts` |
| 12 | Dashboard | Admin | `app/admin/dashboard/page.tsx` |
| 13 | CRUD de Categorias | Admin | `app/admin/categories/page.tsx` |
| 14 | CRUD de Produtos | Admin | `app/admin/products/page.tsx` |
| 15 | Gestão de Pedidos | Admin | `app/admin/orders/page.tsx` |
| 16 | Configurações do Restaurante | Admin | `app/admin/settings/page.tsx` |
| 17 | Notificação WhatsApp | Integration | `lib/whatsapp.ts` |

**Total: 17 fluxos**

---

## Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | 2026-04-19 | Versão inicial |
| 1.1 | 2026-04-19 | Removida seção "Fluxos Responsivos" |
| 1.2 | 2026-04-19 | Removida seção "Fluxos de Dados (CRUD)" e estados redundantes |
| 1.3 | 2026-04-19 | Detalhamento completo dos 17 fluxos com estados, decisões e API calls |

---

**Versão**: 1.3
**Última Atualização**: 2026-04-19
**Autor**: AI Agent
