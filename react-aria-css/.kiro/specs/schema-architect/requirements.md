# Requirements: The Schema Architect

## Overview
A high-density administrative tool for defining, validating, and previewing dynamic custom data fields. Built with React Aria and plain CSS.

The majority of each implementation (~90%) is scaffold-generated. A small set of stories are written by hand to capture the real developer experience. Stories are tagged `[scaffold]` or `[manual]` accordingly.

## Core Data Structure

Each field conforms to this JSON schema:

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
    "options": ["string"]
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

## Requirements

### REQUIREMENT-1: Login Form `[scaffold]`
**User Story:** As an admin, I want to authenticate via a login form so that I can securely manage my organization's data schema.

**Acceptance Criteria:**
- Email and password fields are required; inline errors appear on blur
- Password field has a "Show/Hide" toggle
- Submit button enters a loading state while the request is in flight
- A toast notification appears on success ("Welcome back") and failure ("Invalid credentials")
- On success, redirect to the Field Ledger

### REQUIREMENT-2: Field Overview `[scaffold]`
**User Story:** As an admin, I want to view a high-density table of all custom fields so that I can quickly see their status, data type, and usage.

**Acceptance Criteria:**
- Table renders 1,000+ rows without perceptible lag (virtualized)
- Columns: Label, Name (slug), Type, Status, Usage Count
- Each column header is sortable (ascending/descending toggle)
- A search/filter input above the table filters rows in real time by label or name
- Status is displayed as a badge (`active` = green, `inactive` = grey)

### REQUIREMENT-3: Bulk Management `[scaffold]`
**User Story:** As an admin, I want to select multiple rows to delete or deactivate them in a single action.

**Acceptance Criteria:**
- Each row has a checkbox; table header has a "select all" checkbox
- When 1+ rows are selected, a floating action bar appears at the bottom of the screen
- Action bar shows count of selected rows and two actions: "Deactivate" and "Delete"
- "Delete" opens a confirmation modal before proceeding
- After confirming, selected rows are removed/updated and the action bar dismisses

### REQUIREMENT-4: Side-Drawer Creation `[scaffold]`
**User Story:** As an admin, I want to click "New Field" to open a side drawer so that I can configure a field without losing table context.

**Acceptance Criteria:**
- "New Field" button in the table header opens a drawer from the right
- Drawer renders in a portal, overlaying the table with a backdrop
- Focus is trapped inside the drawer while open
- Pressing Escape or clicking the backdrop closes the drawer
- Drawer header shows "New Field" and a close button

### REQUIREMENT-5: Conditional Configuration `[manual]`
**User Story:** As an admin, I want the configuration form to change based on the selected 'Type'.

**Acceptance Criteria:**
- Form always shows: Label, Name (auto-slugified from Label), Type (select), Status, Placeholder, Default Value, Required (checkbox)
- Selecting `number` reveals: Min, Max, Decimal Places
- Selecting `select` reveals: Options (a dynamic list where items can be added/removed)
- Selecting `date` reveals: Min Date, Max Date
- Selecting `text` reveals: Pattern (regex), Max Length
- Selecting `boolean` hides all type-specific fields
- Name field auto-populates as a slug of Label but remains manually editable

### REQUIREMENT-6: Live Component Preview `[manual]`
**User Story:** As an admin, I want to see a "Live Preview" of the actual input component as I edit its properties.

**Acceptance Criteria:**
- The drawer is split into two panels: "Editor" (left) and "Preview" (right)
- The preview renders the actual input component type matching the selected `type`
- Preview updates in real time as Label, Placeholder, Default Value, and Options are edited
- Preview component reflects the `required` and `disabled` states
- Preview is visually distinguished (e.g., subtle background, "Preview" label)

### REQUIREMENT-7: Nested Rule Builder `[manual]`
**User Story:** As an admin, I want to create "Visibility Rules" (e.g., "Show X if Y equals Z").

**Acceptance Criteria:**
- A "Visibility Rule" section appears at the bottom of the field configuration form
- Toggle to enable/disable the rule
- When enabled, shows three controls: Field (select — lists all existing field names), Operator (select — `equals | contains | filled`), Value (text input, hidden when operator is `filled`)
- Selecting `filled` as the operator hides the Value input
- The rule is serialised into the `logic.visibleIf` object on the field schema
- Invalid state: if rule is enabled but Field is not selected, show an inline error on save

### REQUIREMENT-8: Drag-and-Drop Reordering `[scaffold]`
**User Story:** As an admin, I want to drag and drop fields to change their display order.

**Acceptance Criteria:**
- Each row in the Field Ledger has a drag handle on the left
- Dragging a row reorders the list; order persists in local state
- Visual feedback during drag: dragged row is semi-transparent, drop target is highlighted
- Works with keyboard (arrow keys on the drag handle) for accessibility
