# Design: Multi-Restaurant Support for PediAi

## Technical Approach

The implementation uses a **context-based state management** pattern where the active restaurant is stored in React Context and persisted to localStorage. This allows all admin pages to access the current restaurant without prop drilling and maintains persistence across page reloads.

**Key components:**
1. `RestaurantContext` - provides active restaurant to all admin children
2. `RestaurantSwitcher` - dropdown in sidebar for restaurant selection
3. Updated `SettingsPage` - full CRUD for restaurants

**No schema changes required** - the existing `restaurants` table with `owner_id` already supports multiple restaurants per user via RLS policies.

## Architecture Decisions

### Decision: Client-Side Restaurant Selection
**Choice**: Store active restaurant ID in localStorage and React Context
**Alternatives considered**:
- Server-side session storage (requires API route, adds latency)
- URL-based restaurant ID in all admin routes (clutters URLs, harder to persist)
**Rationale**: The admin is a single-user context per browser; localStorage is sufficient for persistence. React Context avoids prop drilling through the admin layout hierarchy.

### Decision: RestaurantContext Instead of Supabase Query Per Page
**Choice**: Fetch all user restaurants once, store in Context, filter locally
**Alternatives considered**:
- Query `restaurants` table on every admin page using `owner_id` (repetitive, slower)
- Query on mount and pass down as props (prop drilling, tight coupling)
**Rationale**: Restaurant count per user is expected to be small (dozens, not thousands), so fetching all and filtering locally is efficient and avoids redundant Supabase calls.

### Decision: Settings Page as Central Management Hub
**Choice**: `/admin/settings` becomes the restaurant CRUD interface
**Alternatives considered**:
- Separate `/admin/restaurants` route (adds complexity, more files)
- Modal-based creation from sidebar (limited space for forms)
**Rationale**: Settings page already handles restaurant-specific data; expanding it to full CRUD keeps the UI organized and follows the existing pattern.

## Data Flow

```
User logs in
    │
    ▼
AdminLayout mounts
    │
    ▼
RestaurantContext loads user restaurants
    │
    ├──► localStorage.getItem('activeRestaurantId')
    │
    ▼
If activeRestaurantId exists:
    └──► Filter restaurants by ID → set as active
Else:
    └──► Set first restaurant as active (if any)
    │
    ▼
Sidebar renders RestaurantSwitcher dropdown
    │
    ▼
User selects different restaurant:
    │
    ├──► Update Context state
    │
    ├──► localStorage.setItem('activeRestaurantId', newId)
    │
    └──► Refresh current page to reload data for new restaurant
```

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `context/RestaurantContext.tsx` | React Context for active restaurant state |

### Modified Files

| File | Changes |
|------|---------|
| `app/admin/layout.tsx` | Wrap children in `RestaurantProvider`; pass active restaurant |
| `app/admin/settings/page.tsx` | Expand to full restaurant CRUD: list, create, edit, delete |
| `components/admin/sidebar.tsx` | Add `RestaurantSwitcher` dropdown component |

### No Changes Required

| File | Reason |
|------|--------|
| `supabase/schema.sql` | RLS policies already support multi-restaurant via `owner_id = auth.uid()` |
| `lib/supabase/client.ts` | No change needed |
| `app/admin/categories/page.tsx` | Will use context for restaurant_id |
| `app/admin/products/page.tsx` | Will use context for restaurant_id |
| `app/admin/orders/page.tsx` | Will use context for restaurant_id |

## Interfaces / Contracts

### RestaurantContext API

```typescript
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  owner_whatsapp: string;
}

interface RestaurantContextValue {
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  setActiveRestaurant: (restaurant: Restaurant) => void;
  isLoading: boolean;
}
```

### RestaurantSwitcher Component

```typescript
interface RestaurantSwitcherProps {
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  onSelect: (restaurant: Restaurant) => void;
}
```

## Testing Strategy

1. **Unit tests** for RestaurantContext (provider renders, state updates)
2. **Unit tests** for restaurant CRUD operations in SettingsPage
3. **Integration tests** for restaurant switcher interaction
4. **E2E tests** for full flow: create restaurant → switch → edit → delete

## Migration / Rollout

1. **Phase 1**: Create `RestaurantContext`, verify existing pages work with context
2. **Phase 2**: Add `RestaurantSwitcher` to sidebar
3. **Phase 3**: Expand settings page with CRUD UI
4. **Phase 4**: Test multi-restaurant flow end-to-end
5. **Phase 5**: Build verification (`npm run build`)

No database migration needed. No breaking changes to existing functionality.

## Open Questions

1. **Should deleting a restaurant require typing the name for confirmation?** (Security vs. UX tradeoff - proposed design uses simple button + confirmation dialog)
2. **Should there be a limit on number of restaurants per user?** (Not implemented initially; can add later if abuse occurs)
3. **What happens when user has zero restaurants?** (Edge case: prompt to create first restaurant in settings)