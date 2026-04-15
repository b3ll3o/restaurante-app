<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:sdd-rules -->
# MenuLink - SDD (Specification-Driven Development)

## Core Principle

**Specification is the Source of Truth.** Before writing any code, read and follow the specifications in `.openspec/specs/`.

## Workflow

1. **Read**: Consult `.openspec/specs/menulink-specification.md` for business rules
2. **Plan**: Check `.openspec/specs/menulink-technical-plan.md` for architecture decisions
3. **Implement**: Write code that fulfills the specifications
4. **Verify**: Ensure implementation matches SPEC before calling complete

## SDD Artifacts Location

```
.openspec/
├── specs/                    # Live specifications (Source of Truth)
│   ├── menulink-specification.md   # Business rules (RFC 2119)
│   └── menulink-technical-plan.md  # Architecture & data models
└── changes/                  # Changes in progress (proposals, design, tasks)
```

## Key Specifications

### Business Rules (from specification.md)
- REQ-001 to REQ-006: Restaurant management
- REQ-010 to REQ-013: Category management
- REQ-020 to REQ-026: Product management
- REQ-030 to REQ-034: Public menu
- REQ-040 to REQ-045: Checkout flow
- REQ-050 to REQ-054: Order management

### Architecture (from technical_plan.md)
- Frontend: Next.js 16.2.3 + React 19 + Tailwind CSS 4
- Backend: Next.js API Routes + Supabase
- Auth: Supabase Auth (admin routes protected, public menu open)

### Acceptance Criteria
- CA-001 to CA-006 defined in specification.md

## When Implementing

1. Check if the feature exists in `.openspec/specs/`
2. If adding/changing functionality, update the spec first
3. Use the language ubíqua defined in specification.md
4. Follow the architecture defined in technical-plan.md
5. Ensure code fulfills REQ-*** requirements

## Prohibited Actions

- DO NOT implement features not defined in specifications without updating specs first
- DO NOT skip reading specifications before implementing business logic
<!-- END:sdd-rules -->

# Project: MenuLink (Restaurant SaaS)

Stack: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase

## Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

## Tailwind CSS 4

This project uses Tailwind 4 with the new CSS-based config. There is NO `tailwind.config.js` — theme variables are defined in `app/globals.css` using CSS custom properties (`--primary`, `--background`, etc.) and `@theme inline {}`. Do not create a tailwind.config.js.

## Path Alias

`@/*` maps to the root `./*`. Use `@/lib/...`, `@/components/...`, `@/types/...`.

## Supabase Integration

- Client (browser): `lib/supabase/client.ts` — `createBrowserClient`
- Server (SSR): `lib/supabase/server.ts` — `createServerClient` with async cookies
- Auth callback: `app/admin/auth/callback/route.ts`

## Architecture

- Admin routes: `app/admin/*` (login, signup, dashboard)
- Public menu: `app/menu/[slug]/*`
- API routes: `app/api/*`
- shadcn/ui components: `components/ui/*` (already installed)
- Admin components: `components/admin/*` (header, sidebar)

## Database

Run `supabase/schema.sql` in your Supabase SQL Editor to create tables: `restaurants`, `categories`, `products`, `orders`, `order_items`.

## Required Env Vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
```

## Important Constraints

- Strict TypeScript mode (`strict: true` in tsconfig)
- No RSC "use client" on admin layout (`app/admin/layout.tsx` uses client-side auth check)
- Public menu/orders are unauthenticated; admin routes require Supabase auth

## Domain Model (MenuLink)

### Entities

- **Restaurant**: id, name, slug, owner_whatsapp
- **Category**: id, restaurant_id, name, display_order
- **Product**: id, category_id, name, description, price, image_url, is_available, display_order
- **Order**: id, restaurant_id, customer_name, customer_whatsapp, total, status, payment_method
- **OrderItem**: id, order_id, product_id, product_name, unit_price, quantity, total_price

### Business Rules

- Products belong to a Category
- Categories and Products have display_order for sorting
- Orders have status: pending → confirmed → cancelled
- Order total is calculated from order_items