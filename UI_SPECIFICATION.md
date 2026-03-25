# User Management Screen – UI Specification

**Version:** 1.0  
**Date:** 2026-03-25  
**Author:** Emir Çiftci  
**Status:** Final  

---

## 1. Overview

The **User Management Screen** allows administrators to view, create, edit, and manage application users. The screen is divided into two main regions: a **User List Table** on the left and a **User Detail Form** on the right. A **Toolbar** at the top provides global actions.

### 1.1 Purpose

- Provide a centralized interface for user administration.
- Support creating new users, editing existing users, toggling user status, and filtering disabled users from the list.

### 1.2 Target Users

System administrators and super administrators who need to manage user accounts.

---

## 2. Page Layout

The page uses a **horizontal split layout**:

```
┌──────────────────────────────────────────────────────────────────┐
│  [+ New User]   ☑ Hide Disabled User                [Save User] │  ← Toolbar
├──────────────────────────────┬───────────────────────────────────┤
│                              │                                   │
│      User List Table         │       User Detail Form            │
│      (≈ 45% width)          │       (≈ 55% width)              │
│                              │                                   │
│                              │                                   │
└──────────────────────────────┴───────────────────────────────────┘
```

- **Toolbar**: Full-width bar at the top. Left-aligned action button and checkbox; right-aligned save button.
- **User List Table**: Left panel, approximately 45 % of the content width.
- **User Detail Form**: Right panel, approximately 55 % of the content width.

---

## 3. Toolbar

### 3.1 Components

| # | Component | Type | Label / Text | Position |
|---|-----------|------|-------------|----------|
| 1 | `btnNewUser` | Button (primary) | `+ New User` | Left |
| 2 | `chkHideDisabled` | Checkbox | `Hide Disabled User` | Left, next to button |
| 3 | `btnSaveUser` | Button (primary) | `Save User` | Right |

### 3.2 Behaviour

| Component | Event | Action |
|-----------|-------|--------|
| `btnNewUser` | Click | 1. Deselect the currently selected row in the table (if any). <br>2. Clear all fields in the User Detail Form. <br>3. Set the form title to **"New User"**. <br>4. Place focus on the **Username** field. |
| `chkHideDisabled` | Change | If **checked**: hide all rows where `Enabled` = `false` from the table. <br>If **unchecked**: show all users. <br>Default state on page load: **checked**. |
| `btnSaveUser` | Click | 1. Validate the form (see §5.4). <br>2. If valid and no existing user is selected → **create** a new user record. <br>3. If valid and an existing user is selected → **update** that user record. <br>4. Refresh the table to reflect changes. <br>5. Show a success toast/notification. <br>6. If validation fails → highlight invalid fields with error messages (see §5.5). |

---

## 4. User List Table

### 4.1 Columns

| # | Column Header | Data Field | Width | Sortable | Filterable |
|---|--------------|------------|-------|----------|------------|
| 1 | **ID** | `id` | ~10 % | Yes (▲▼) | Yes (funnel icon 🔽) |
| 2 | **User Name** | `userName` | ~30 % | Yes (▲▼) | Yes (funnel icon 🔽) |
| 3 | **Email** | `email` | ~40 % | Yes (▲▼) | Yes (funnel icon 🔽) |
| 4 | **Enabled** | `enabled` | ~20 % | Yes (▲▼) | Yes (funnel icon 🔽) |

- Column headers have a **dark-blue / steel-blue background** with white text.
- Each column header displays a **sort toggle icon** (▲▼) and a **filter icon** (funnel).

### 4.2 Sort Behaviour

- Clicking the **sort icon** on a column cycles through: **ascending → descending → no sort**.
- Only one column may be sorted at a time; clicking a different column resets the previous sort.
- Default sort on page load: **ID ascending**.

### 4.3 Filter Behaviour

- Clicking the **filter icon** opens a small **popover/dropdown** below the column header.
- The popover contains a **text input** that filters rows in real time (case-insensitive, substring match).
- For the **Enabled** column, the filter should offer a dropdown with options: `All`, `true`, `false`.
- Pressing **Escape** or clicking outside closes the filter popover.
- An active filter is indicated visually (e.g., highlighted funnel icon).

### 4.4 Row Behaviour

| Event | Action |
|-------|--------|
| Click on a row | 1. Highlight the row (selected state). <br>2. Populate the User Detail Form with that user's data. <br>3. Change the form title to **"Edit User"** (or show the user's name). |
| Hover on a row | Apply a subtle hover background colour (`#f5f5f5`). |

### 4.5 Empty State

If there are no users (or all are filtered out), display a centred message:  
> _"No users found."_

### 4.6 Sample Data (Initial Load)

The table should be pre-populated with the following seed data for demonstration:

| ID | User Name | Email | Enabled |
|----|-----------|-------|---------|
| 1 | AdminUser | admin@piworks.net | true |
| 2 | Test User | testuser@piworks.net | true |

---

## 5. User Detail Form

### 5.1 Form Title

- Displays **"New User"** when creating a new user.
- Displays **"Edit User"** (or the user's display name) when editing an existing user.

### 5.2 Form Fields

| # | Label | Field Name | Type | Required | Constraints |
|---|-------|-----------|------|----------|-------------|
| 1 | **Username** | `username` | Text input | Yes | 3–50 characters; alphanumeric, dots, underscores only; must be unique. |
| 2 | **Display Name** | `displayName` | Text input | Yes | 2–100 characters. |
| 3 | **Phone** | `phone` | Text input | No | Numeric with optional `+` prefix and dashes; max 20 characters. |
| 4 | **Email** | `email` | Email input | Yes | Must be a valid email format (RFC 5322 simplified); must be unique. |
| 5 | **User Roles** | `userRoles` | Multi-select dropdown | Yes | At least one role must be selected. |
| 6 | **Enabled** | `enabled` | Checkbox | No | Default: **unchecked** (`false`) for new users. |

### 5.3 User Roles Dropdown

- **Type**: Multi-select dropdown (custom component).
- **Placeholder text**: `"Select user roles…"`
- **Options** (static list):

| Value | Display Label |
|-------|---------------|
| `guest` | Guest |
| `admin` | Admin |
| `superAdmin` | SuperAdmin |

- Clicking the dropdown opens a list of options.
- Each option can be toggled on/off (checked/unchecked).
- Selected roles are displayed as comma-separated text or tags inside the input.
- Clicking outside the dropdown closes it.

### 5.4 Validation Rules

Validation is triggered on **Save User** button click.

| Field | Rule | Error Message |
|-------|------|---------------|
| Username | Required, 3–50 chars, alphanumeric/dot/underscore | `"Username is required and must be 3–50 alphanumeric characters."` |
| Username | Unique across all users | `"This username is already taken."` |
| Display Name | Required, 2–100 chars | `"Display Name is required (2–100 characters)."` |
| Phone | If provided, must match phone format | `"Please enter a valid phone number."` |
| Email | Required, valid email format | `"A valid email address is required."` |
| Email | Unique across all users | `"This email is already in use."` |
| User Roles | At least one role selected | `"Please select at least one user role."` |

### 5.5 Error Display

- Invalid fields should be highlighted with a **red border**.
- An error message should appear **below** the invalid field in red text.
- The first invalid field should receive **focus**.
- Errors are cleared when the user modifies the field value.

### 5.6 Form Layout

- Labels are positioned to the **left** of inputs (horizontal form layout).
- Label width: ~30 %, input width: ~70 %.
- Vertical spacing between fields: `16px`.

---

## 6. Initial State (On Page Load)

When the page first loads:

1. The **User List Table** is populated with all user records (seed data).
2. The **"Hide Disabled User"** checkbox is **checked** by default (disabled users are hidden).
3. The table is sorted by **ID ascending**.
4. **No row is selected**.
5. The User Detail Form displays **"New User"** as the title with **all fields empty**.
6. The **Enabled** checkbox in the form is **unchecked** by default.

---

## 7. User Interaction Flows

### 7.1 Create a New User

```
1. User clicks [+ New User]
2. Form clears → title becomes "New User"
3. User fills in fields
4. User clicks [Save User]
5. Validation runs
   ├─ PASS → User added to table, row highlighted, success notification shown
   └─ FAIL → Error messages displayed on invalid fields
```

### 7.2 Edit an Existing User

```
1. User clicks a row in the table
2. Row highlights → form populates with user data → title becomes "Edit User"
3. User modifies desired fields
4. User clicks [Save User]
5. Validation runs
   ├─ PASS → User record updated in table, success notification shown
   └─ FAIL → Error messages displayed on invalid fields
```

### 7.3 Toggle "Hide Disabled User"

```
1. User checks/unchecks the "Hide Disabled User" checkbox
2. Table immediately filters rows based on `enabled` status
3. If the currently selected user gets filtered out, form resets to "New User" state
```

---

## 8. Styling Guidelines

| Element | Style |
|---------|-------|
| Primary buttons (`+ New User`, `Save User`) | Background: `#4a90d9` (blue); Color: white; Border-radius: `4px`; Padding: `8px 16px`. |
| Table header | Background: `#47637a` (dark steel-blue); Color: white; Font-weight: bold. |
| Selected row | Background: `#d4e6f9` (light blue). |
| Hovered row | Background: `#f0f0f0`. |
| Form labels | Color: `#333`; Font-weight: normal; Font-style: italic. |
| Input fields | Border: `1px solid #ccc`; Border-radius: `4px`; Padding: `8px 12px`; Full width within the form column. |
| Invalid input | Border: `2px solid #e74c3c`; Accompanying error text in `#e74c3c`. |
| Checkbox | Standard browser checkbox. |
| Page background | `#ffffff`. |
| Font family | `"Segoe UI", Roboto, Arial, sans-serif`. |
| Base font size | `14px`. |

---

## 9. Accessibility Requirements

- All form inputs must have associated `<label>` elements (using `for`/`id` pairing).
- Interactive elements must be reachable and operable via **keyboard** (Tab, Enter, Escape).
- Error messages must be associated with inputs via `aria-describedby`.
- Table must use proper `<thead>` / `<tbody>` semantic markup.
- Colour contrast must meet **WCAG 2.1 AA** (minimum 4.5:1 for normal text).

---

## 10. Responsive Behaviour

| Breakpoint | Layout Change |
|------------|---------------|
| ≥ 992 px | Side-by-side layout (table left, form right) as described above. |
| < 992 px | Stacked layout – table on top, form below. Both take full width. |

---

## 11. Assumptions & Constraints

- This specification covers the **front-end** only. Back-end API contracts are out of scope.
- User data is managed **in-memory** (client-side) for the initial implementation.
- No pagination is required for the initial version (expected user count < 100).
- The User Roles list is static (Guest, Admin, SuperAdmin) and not configurable from this screen.

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| **User** | An account in the system identified by a unique ID, username, and email. |
| **Role** | A permission level assigned to a user (Guest, Admin, SuperAdmin). |
| **Enabled** | A boolean flag indicating whether the user account is active. |
