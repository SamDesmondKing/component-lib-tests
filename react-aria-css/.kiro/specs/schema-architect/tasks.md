# Tasks: The Schema Architect

## Epic 1: Secure Access

### TASK-1: Login Form `[scaffold]`
**Requirement:** REQUIREMENT-1

- [x] Create `LoginPage` component with email and password fields using React Aria inputs
- [x] Add blur validation with inline error messages for required fields
- [x] Implement password show/hide toggle button
- [x] Add loading state to submit button during mock auth request
- [x] Implement toast notification for success ("Welcome back") and failure ("Invalid credentials")
- [x] Redirect to Field Ledger on successful login
- [x] Store mock auth token in memory
- [x] Create `LoginPage.css` with component-scoped styles

## Epic 2: The Field Ledger

### TASK-2: Field Overview Table `[scaffold]`
**Requirement:** REQUIREMENT-2

- [x] Generate 1,000 mock field records on mount conforming to the core JSON schema
- [x] Implement virtualized table rendering (e.g., `@tanstack/react-virtual`)
- [x] Add columns: Label, Name (slug), Type, Status, Usage Count
- [x] Implement sortable column headers with ascending/descending toggle
- [x] Add real-time search/filter input that filters by label or name
- [x] Render status as a badge (`active` = green, `inactive` = grey)
- [x] Create `FieldLedger.css` with table, badge, and filter styles

### TASK-3: Bulk Management `[scaffold]`
**Requirement:** REQUIREMENT-3

- [x] Add per-row checkbox and "select all" checkbox in table header
- [x] Track selection as a `Set<string>` of field IDs in local state
- [x] Show floating action bar (portal) at bottom when 1+ rows selected
- [x] Display selected count and "Deactivate" / "Delete" actions in the bar
- [x] "Delete" opens a confirmation modal (React Aria Dialog)
- [x] On confirm, remove selected rows from state and dismiss action bar
- [x] "Deactivate" sets `status: inactive` on selected records
- [x] Create `FloatingActionBar.css` and `ConfirmationModal.css`

## Epic 3: The Builder

### TASK-4: Side-Drawer `[scaffold]`
**Requirement:** REQUIREMENT-4

- [x] Add "New Field" button to the table header area
- [x] Implement right-side drawer using a portal with backdrop overlay
- [x] Trap focus inside the drawer while open (React Aria focus management)
- [x] Close drawer on Escape key or backdrop click
- [x] Add drawer header with "New Field" title and close button
- [x] Create `FieldDrawer.css` with drawer, backdrop, and animation styles

### TASK-5: Conditional Configuration Form `[manual]`
**Requirement:** REQUIREMENT-5

- [ ] Build form with common fields: Label, Name, Type (select), Status, Placeholder, Default Value, Required (checkbox)
- [ ] Auto-slugify Name from Label; keep Name manually editable
- [ ] Conditionally render type-specific fields based on Type selection:
  - `number` → Min, Max, Decimal Places
  - `select` → Options (dynamic add/remove list)
  - `date` → Min Date, Max Date
  - `text` → Pattern (regex), Max Length
  - `boolean` → hide all type-specific fields
- [ ] Reset type-specific fields to defaults on Type change
- [ ] Manage form state as a single object matching the core JSON schema
- [ ] Create `FieldForm.css` with form layout and field group styles

### TASK-6: Live Component Preview `[manual]`
**Requirement:** REQUIREMENT-6

- [ ] Split drawer into two panels: Editor (left) and Preview (right)
- [ ] Render actual input component in Preview matching the selected `type`
- [ ] Update preview in real time as Label, Placeholder, Default Value, and Options change
- [ ] Reflect `required` and `disabled` states in the preview component
- [ ] Visually distinguish preview panel (subtle background, "Preview" label)
- [ ] Create `PreviewPanel.css` with split layout and preview styling

## Epic 4: Advanced Interaction

### TASK-7: Nested Rule Builder `[manual]`
**Requirement:** REQUIREMENT-7

- [ ] Add "Visibility Rule" section at the bottom of the field configuration form
- [ ] Implement enable/disable toggle for the rule
- [ ] When enabled, show: Field (select, populated from existing field names), Operator (select: `equals | contains | filled`), Value (text input)
- [ ] Hide Value input when operator is `filled`
- [ ] Serialise rule into `logic.visibleIf` on the field schema
- [ ] Conditionally null out `value` on operator change
- [ ] Show inline error on save if rule is enabled but Field is not selected
- [ ] Create `VisibilityRule.css` with rule section styles

### TASK-8: Drag-and-Drop Reordering `[scaffold]`
**Requirement:** REQUIREMENT-8

- [x] Add drag handle to each row in the Field Ledger
- [x] Integrate dnd-kit for drag-and-drop reordering
- [x] Show visual feedback: semi-transparent dragged row, highlighted drop target
- [x] Persist reordered list in local state as an index array
- [x] Support keyboard reordering (arrow keys on drag handle) for accessibility
- [x] Add drag-and-drop styles to `FieldLedger.css`
