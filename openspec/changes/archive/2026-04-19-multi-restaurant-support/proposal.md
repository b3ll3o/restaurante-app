# Proposal: Multi-Restaurant Support for PediAi

## Intent

Enable restaurant owners to create, manage, and switch between multiple restaurants within a single PediAi account. Currently, users can only own a single restaurant created during signup, with no ability to add more or switch between them.

## Scope

### In Scope
- Create new restaurant for authenticated user
- Edit existing restaurant (name, WhatsApp)
- Delete restaurant (with cascade to categories, products, orders)
- Switch active restaurant from admin interface
- Restaurant switcher component in sidebar/header
- Settings page expanded to full CRUD
- All operations scoped by `owner_id` in `restaurants` table

### Out of Scope
- User registration / authentication changes (existing auth is sufficient)
- Sharing restaurant access with other users
- Restaurant-to-restaurant data migration
- Bulk operations on multiple restaurants
- Changes to public menu (`/menu/[slug]`)

## Approach

1. **Data Model**: No schema changes required. `restaurants` table already has `owner_id` referencing `auth.users(id)`. Multiple restaurants per owner are already supported at the database level via RLS policies.

2. **Restaurant Switcher**: Add a dropdown/dropdown in the admin sidebar that lists all restaurants owned by the authenticated user. The active restaurant is stored in client-side state (React `useState`) and passed via Context.

3. **Active Restaurant Context**: Create `RestaurantContext` to provide current `restaurant_id` and `restaurant` object to all admin pages. This replaces direct `owner_id` lookups.

4. **Settings Page Expansion**: Transform the current single-restaurant settings page into a restaurant management interface with:
   - List of user's restaurants
   - Create new restaurant form
   - Edit/Delete actions per restaurant

5. **RLS Verification**: Ensure all existing queries that filter by `owner_id` continue to work with multiple restaurants (they already do, since RLS checks `owner_id = auth.uid()`).

## Affected Areas

| Area | Impact |
|------|--------|
| `app/admin/settings/page.tsx` | Expand from single restaurant edit to full CRUD + list |
| `app/admin/layout.tsx` | Add restaurant switcher; inject `RestaurantContext` |
| `components/admin/sidebar.tsx` | Add restaurant switcher dropdown |
| `context/` (new) | Create `RestaurantContext` for active restaurant state |
| `lib/supabase/client.ts` | No changes needed |
| `supabase/schema.sql` | No changes needed (RLS already supports multi-restaurant) |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Existing queries break with multiple restaurants | Low | High | Verify all queries use `owner_id` or `restaurant_id` filters; existing RLS policies already enforce ownership |
| User confusion about "which restaurant am I editing?" | Medium | Medium | Prominent restaurant switcher with clear active state indication |
| Accidental deletion of restaurant with active orders | Medium | High | Add confirmation dialog before delete; soft-delete consideration |
| Session persistence of active restaurant | Low | Medium | Store active restaurant ID in `localStorage` to persist across page reloads |

## Rollback Plan

1. **Code Rollback**: Revert changes in `app/admin/settings/page.tsx`, `components/admin/sidebar.tsx`, and any new context files.
2. **No Database Migration**: No schema changes were made, so no DDL rollback needed.
3. **User Impact**: Users with multiple restaurants will see behavior revert to single-restaurant (first restaurant returned by query).
4. **Communication**: If rollback needed, notify affected users that multi-restaurant feature is temporarily unavailable.

## Success Criteria

1. User can create a second restaurant via `/admin/settings`
2. User can edit restaurant name and WhatsApp for any owned restaurant
3. User can delete a restaurant (with confirmation)
4. User can switch between restaurants via sidebar switcher
5. Active restaurant persists across page navigation (localStorage)
6. All existing admin pages continue to work (categories, products, orders) with selected restaurant
7. Menu public pages (`/menu/[slug]`) continue to work independently
8. Build passes (`npm run build`)