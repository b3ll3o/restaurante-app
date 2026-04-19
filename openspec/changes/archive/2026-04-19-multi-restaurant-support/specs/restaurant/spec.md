# Delta for Restaurant Management

## ADDED Requirements

### Requirement: Multi-Restaurant Ownership
A restaurant owner MUST be able to own multiple restaurants within a single PediAi account.

#### Scenario: List User's Restaurants
- GIVEN an authenticated user with multiple restaurants
- WHEN the user navigates to the settings page
- THEN the system SHALL display all restaurants owned by the user
- AND each restaurant SHALL show its name and slug

#### Scenario: Switch Active Restaurant
- GIVEN an authenticated user with multiple restaurants
- WHEN the user selects a different restaurant from the switcher
- THEN the system SHALL update the active restaurant context
- AND persist the selection in localStorage
- AND redirect or refresh relevant admin pages to reflect the new restaurant

#### Scenario: Create New Restaurant
- GIVEN an authenticated user
- WHEN the user submits the "Create Restaurant" form with valid name and WhatsApp
- THEN the system SHALL create a new restaurant record with `owner_id` set to the authenticated user's ID
- AND generate a unique slug from the restaurant name
- AND display the new restaurant in the restaurant list
- AND set the new restaurant as the active restaurant

#### Scenario: Create Restaurant Without Name
- GIVEN an authenticated user
- WHEN the user submits the "Create Restaurant" form without a name
- THEN the system SHALL display a validation error
- AND NOT create a restaurant

### Requirement: Edit Restaurant
A restaurant owner MUST be able to edit the details of any restaurant they own.

#### Scenario: Edit Restaurant Name
- GIVEN an authenticated user viewing an restaurant they own
- WHEN the user updates the restaurant name and submits
- THEN the system SHALL update the restaurant record
- AND display a success message

#### Scenario: Edit Restaurant WhatsApp
- GIVEN an authenticated user viewing an restaurant they own
- WHEN the user updates the WhatsApp number and submits
- THEN the system SHALL update the `owner_whatsapp` field
- AND display a success message

#### Scenario: Edit Restaurant Not Owned
- GIVEN an authenticated user
- WHEN the user attempts to edit a restaurant where `owner_id` does not match their user ID
- THEN the system SHALL return a permission error
- AND NOT update the restaurant

### Requirement: Delete Restaurant
A restaurant owner MUST be able to delete any restaurant they own, with cascading deletion of related data.

#### Scenario: Delete Restaurant with Confirmation
- GIVEN an authenticated user viewing a restaurant they own
- WHEN the user clicks delete and confirms the action
- THEN the system SHALL delete the restaurant
- AND cascade delete all categories, products, and orders associated with that restaurant
- AND remove the restaurant from the user's restaurant list
- AND if the deleted restaurant was the active one, set another owned restaurant as active or clear the selection

#### Scenario: Delete Restaurant Without Confirmation
- GIVEN an authenticated user viewing a restaurant they own
- WHEN the user clicks delete but does NOT confirm
- THEN the system SHALL NOT delete the restaurant

### Requirement: Restaurant Switcher
The admin interface MUST provide a visible restaurant switcher so users can easily identify which restaurant they are currently managing.

#### Scenario: Display Restaurant Switcher
- GIVEN an authenticated user
- THEN the sidebar or header SHALL display a restaurant switcher control
- AND show the currently active restaurant name
- AND list all restaurants owned by the user

#### Scenario: Active Restaurant Indication
- GIVEN an authenticated user viewing the restaurant switcher
- THEN the currently active restaurant SHALL be visually indicated (e.g., checkmark, bold, highlighted)

## MODIFIED Requirements

### Requirement: Settings Page Scope
The settings page MUST expand from single-restaurant editing to full restaurant management (list, create, edit, delete).

#### Scenario: Settings Shows Restaurant List
- GIVEN an authenticated user
- WHEN the user navigates to `/admin/settings`
- THEN the system SHALL display a list of all restaurants owned by the user
- AND provide create, edit, and delete controls for each restaurant

## REMOVED Requirements

None.

## Implementation Notes

- All operations MUST use RLS policies for enforcement at the database level
- The `owner_id` field in `restaurants` table links to `auth.users(id)`
- No schema changes are required; the existing schema supports multiple restaurants per owner
- Active restaurant is stored client-side in localStorage for persistence across sessions
- RestaurantContext provides the active restaurant to all admin child components