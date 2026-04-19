# Tasks: Multi-Restaurant Support for PediAi

## Phase 1: Foundation (Context & Infrastructure)

- [x] 1.1 Create `context/RestaurantContext.tsx` with React Context for active restaurant state
- [x] 1.2 Implement `restaurants` fetch query using `owner_id = auth.uid()`
- [x] 1.3 Add localStorage persistence for `activeRestaurantId`
- [x] 1.4 Export `RestaurantContext` from `context/` directory

## Phase 2: Core Implementation (Admin Layout Integration)

- [x] 2.1 Wrap admin layout children in `RestaurantProvider`
- [x] 2.2 Update `app/admin/layout.tsx` to consume active restaurant context
- [x] 2.3 Verify auth state still works with new context wrapping

## Phase 3: Restaurant Switcher (Sidebar UI)

- [x] 3.1 Create `RestaurantSwitcher` component in `components/admin/`
- [x] 3.2 Add `RestaurantSwitcher` dropdown to `SidebarContent`
- [x] 3.3 Implement restaurant selection callback with context update + localStorage
- [x] 3.4 Add visual indication of active restaurant (checkmark or highlight)

## Phase 4: Settings Page Expansion (Full CRUD)

- [x] 4.1 Fetch all user restaurants in settings page
- [x] 4.2 Add restaurant list display with cards/rows
- [x] 4.3 Add "Create Restaurant" form (name + WhatsApp inputs)
- [x] 4.4 Implement create restaurant Supabase insert
- [x] 4.5 Add edit mode per restaurant (inline or modal)
- [x] 4.6 Implement update restaurant Supabase query
- [x] 4.7 Add delete button with confirmation dialog
- [x] 4.8 Implement delete restaurant Supabase query with cascade consideration

## Phase 5: Integration & Consistency

- [x] 5.1 Update all admin pages (categories, products, orders) to use `RestaurantContext` for restaurant_id
- [x] 5.2 Test that existing pages work with multi-restaurant context
- [x] 5.3 Handle edge case: user with zero restaurants
- [x] 5.4 Handle edge case: active restaurant deleted (fallback to another)

## Phase 6: Verification

- [x] 6.1 Run `npm run build` to verify no TypeScript errors
- [x] 6.2 Build passed
- [ ] 6.2 Test restaurant creation flow end-to-end
- [ ] 6.3 Test restaurant switcher interaction
- [ ] 6.4 Test edit and delete operations
- [ ] 6.5 Verify public menu pages still work independently
- [ ] 6.6 Create or update unit tests for RestaurantContext

## Execution Order

Phase 1 (Foundation) must complete before Phase 2 (Layout Integration). Phase 2 must complete before Phase 3 (Switcher) as the switcher depends on context. Phase 3 and 4 can proceed in parallel once Phase 2 is done. Phase 5 (Integration) requires both Phases 3 and 4 to be complete. Phase 6 (Verification) is the final gate before archive.