<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: MenuLink (Restaurant SaaS)

Stack: Next.js 16.2.3 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Supabase

## Commands

```bash
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint
```

No test command exists yet. No typecheck command (lint handles TypeScript via eslint-config-next/typescript).

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
- Public menu: `app/menu/[slug]/*` (not yet built)
- API routes: `app/api/*` (not yet built)
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