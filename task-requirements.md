# Project Specification: The Schema Architect

**Objective:** A high-density administrative tool for defining, validating, and previewing dynamic custom data fields. 

This project should be built using the react-aria component library and tailwind css.

The majority of each implementation (~90%) is to be built by co-pilot. A small set of stories are written by hand to capture the real developer experience of each framework. Stories are tagged `[scaffold]` or `[manual]` accordingly.

---

## 1. Core Data Structure (The JSON Schema)
Each field created in the app should conform to this structure to ensure consistency across implementations:

```json
{
  "id": "uuid",
  "label": "string",
  "name": "string (slug)",
  "type": "text | number | boolean | date | select",
  "validation": {
    "required": "boolean",
    "min": "number",
    "max": "number",
    "pattern": "string (regex)"
  },
  "config": {
    "placeholder": "string",
    "defaultValue": "any",
    "options": ["string"] // Only for 'select' type
  },
  "logic": {
    "visibleIf": {
      "field": "string (id)",
      "operator": "equals | contains | filled",
      "value": "any"
    }
  },
  "status": "active | inactive",
  "usageCount": "number"
}
```

---

## 2. User Stories

### Epic 1: Secure Access

- **Login Form** `[scaffold]` — As an admin, I want to authenticate via a login form so that I can securely manage my organization's data schema.
  - *Acceptance Criteria:*
    - Email and password fields are required; inline errors appear on blur
    - Password field has a "Show/Hide" toggle
    - Submit button enters a loading state while the request is in flight
    - A toast notification appears on success ("Welcome back") and failure ("Invalid credentials")
    - On success, redirect to the Field Ledger
  - *Components:* Text input, password input, button (with loading state), toast/notification
  - *Data Flow:* Form submits `{ email, password }`. On success, store a mock auth token in memory and redirect.

---

### Epic 2: The Field Ledger (High Density)

- **Field Overview** `[scaffold]` — As an admin, I want to view a high-density table of all custom fields so that I can quickly see their status, data type, and usage.
  - *Acceptance Criteria:*
    - Table renders 1,000+ rows without perceptible lag (virtualized)
    - Columns: Label, Name (slug), Type, Status, Usage Count
    - Each column header is sortable (ascending/descending toggle)
    - A search/filter input above the table filters rows in real time by label or name
    - Status is displayed as a badge (`active` = green, `inactive` = grey)
  - *Components:* Virtualized table, sortable column headers, badge, text input (filter)
  - *Data Flow:* Generate 1,000 mock field records on mount. Filter and sort are derived state — no server calls.

- **Bulk Management** `[scaffold]` — As an admin, I want to select multiple rows to delete or deactivate them in a single action.
  - *Acceptance Criteria:*
    - Each row has a checkbox; table header has a "select all" checkbox
    - When 1+ rows are selected, a floating action bar appears at the bottom of the screen
    - Action bar shows count of selected rows and two actions: "Deactivate" and "Delete"
    - "Delete" opens a confirmation modal before proceeding
    - After confirming, selected rows are removed/updated and the action bar dismisses
  - *Components:* Checkbox, floating action bar (portal), modal/dialog, button
  - *Data Flow:* Selection is local state (Set of IDs). Deactivate sets `status: inactive` on matching records. Delete removes them.

---

### Epic 3: The Builder (Dynamic Logic)

- **Side-Drawer Creation** `[scaffold]` — As an admin, I want to click "New Field" to open a side drawer so that I can configure a field without losing table context.
  - *Acceptance Criteria:*
    - "New Field" button in the table header opens a drawer from the right
    - Drawer renders in a portal, overlaying the table with a backdrop
    - Focus is trapped inside the drawer while open
    - Pressing Escape or clicking the backdrop closes the drawer
    - Drawer header shows "New Field" and a close button
  - *Components:* Button, drawer/sheet (portal), focus trap, backdrop
  - *Data Flow:* Drawer open/closed state lives in the parent. Drawer contains the field configuration form (see below).

- **Conditional Configuration** `[manual]` — As an admin, I want the configuration form to change based on the selected 'Type'.
  - *Acceptance Criteria:*
    - Form always shows: Label, Name (auto-slugified from Label), Type (select), Status, Placeholder, Default Value, Required (checkbox)
    - Selecting `number` reveals: Min, Max, Decimal Places
    - Selecting `select` reveals: Options (a dynamic list where items can be added/removed)
    - Selecting `date` reveals: Min Date, Max Date
    - Selecting `text` reveals: Pattern (regex), Max Length
    - Selecting `boolean` hides all type-specific fields
    - Name field auto-populates as a slug of Label but remains manually editable
  - *Components:* Text input, select/combobox, checkbox, number input, dynamic list (add/remove), date input
  - *Data Flow:* Form state is a single object matching the core JSON schema. Type change resets type-specific fields to their defaults.
  - *DX Note:* Tests how naturally the framework handles controlled, conditional form state without a dedicated form library.

- **Live Component Preview** `[manual]` — As an admin, I want to see a "Live Preview" of the actual input component as I edit its properties.
  - *Acceptance Criteria:*
    - The drawer is split into two panels: "Editor" (left) and "Preview" (right)
    - The preview renders the actual input component type matching the selected `type`
    - Preview updates in real time as Label, Placeholder, Default Value, and Options are edited
    - Preview component reflects the `required` and `disabled` states
    - Preview is visually distinguished (e.g., subtle background, "Preview" label)
  - *Components:* Split layout, all input types (text, number, boolean, date, select)
  - *Data Flow:* Editor and Preview share the same form state object — no synchronisation layer needed. Preview reads directly from live form values.
  - *DX Note:* Tests how cleanly the framework enables real-time derived UI from shared state.

---

### Epic 4: Advanced Interaction

- **Nested Rule Builder** `[manual]` — As an admin, I want to create "Visibility Rules" (e.g., "Show X if Y equals Z").
  - *Acceptance Criteria:*
    - A "Visibility Rule" section appears at the bottom of the field configuration form
    - Toggle to enable/disable the rule
    - When enabled, shows three controls: Field (select — lists all existing field names), Operator (select — `equals | contains | filled`), Value (text input, hidden when operator is `filled`)
    - Selecting `filled` as the operator hides the Value input
    - The rule is serialised into the `logic.visibleIf` object on the field schema
    - Invalid state: if rule is enabled but Field is not selected, show an inline error on save
  - *Components:* Toggle/switch, select/combobox, text input, conditional rendering, inline error
  - *Data Flow:* Rule state is a nested object within the form state (`logic.visibleIf`). Operator change conditionally nulls out `value`.
  - *DX Note:* Tests nested conditional state, dynamic option lists (populated from sibling records), and inline validation — the three patterns most likely to expose framework friction.

- **Drag-and-Drop Reordering** `[scaffold]` — As an admin, I want to drag and drop fields to change their display order.
  - *Acceptance Criteria:*
    - Each row in the Field Ledger has a drag handle on the left
    - Dragging a row reorders the list; order persists in local state
    - Visual feedback during drag: dragged row is semi-transparent, drop target is highlighted
    - Works with keyboard (arrow keys on the drag handle) for accessibility
  - *Components:* Drag handle icon, DND-enabled list (e.g., dnd-kit)
  - *Data Flow:* Field order is stored as an index array in local state. On drop, reorder the array.

---

