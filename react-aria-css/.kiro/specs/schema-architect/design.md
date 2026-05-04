# Design: The Schema Architect

## Technology Stack
- **UI Framework:** React (with TypeScript)
- **Component Library:** React Aria
- **Styling:** Plain CSS (no utility frameworks — use standard CSS files with component-scoped class names)
- **Build Tool:** Vite
- **Drag & Drop:** dnd-kit

## Styling Approach
- Use plain `.css` files co-located with their components (e.g., `LoginPage.css` alongside `LoginPage.tsx`)
- Use descriptive class names scoped by component (e.g., `.login-form__input`, `.field-ledger__badge--active`)
- Leverage CSS custom properties (variables) for shared design tokens (colors, spacing, typography)
- No CSS-in-JS, no Tailwind, no CSS modules — standard CSS imports only

## Architecture

### State Management
All state is local (React state). No server calls — mock data is generated on mount.
- Auth token stored in memory
- Field records stored as an array in a top-level state
- Field order stored as an index array
- Selection stored as a `Set<string>` of field IDs
- Drawer open/closed state in parent component
- Form state is a single object matching the core JSON schema

### Component Hierarchy

```
App
├── LoginPage
│   ├── LoginForm (email, password, show/hide toggle, loading button)
│   └── ToastNotification
└── FieldLedger (authenticated route)
    ├── FilterInput
    ├── NewFieldButton
    ├── VirtualizedTable
    │   ├── SortableColumnHeaders
    │   ├── DragHandle (per row)
    │   ├── Checkbox (per row + select all)
    │   └── StatusBadge
    ├── FloatingActionBar (portal, visible when selection > 0)
    │   ├── DeactivateButton
    │   └── DeleteButton → ConfirmationModal
    └── FieldDrawer (portal, right side)
        ├── EditorPanel
        │   ├── CommonFields (Label, Name, Type, Status, Placeholder, Default, Required)
        │   ├── TypeSpecificFields (conditional on Type)
        │   │   ├── NumberFields (Min, Max, Decimal Places)
        │   │   ├── SelectFields (dynamic Options list)
        │   │   ├── DateFields (Min Date, Max Date)
        │   │   └── TextFields (Pattern, Max Length)
        │   └── VisibilityRuleSection
        │       ├── EnableToggle
        │       ├── FieldSelect
        │       ├── OperatorSelect
        │       └── ValueInput (hidden when operator is "filled")
        └── PreviewPanel
            └── LivePreviewComponent (renders actual input matching selected type)
```

### Data Flow

| Area | Source | Notes |
|---|---|---|
| Auth | Mock — `{ email, password }` → in-memory token | Redirect to Field Ledger on success |
| Field Records | 1,000 generated on mount | Filter/sort are derived state |
| Selection | `Set<string>` local state | Drives floating action bar visibility |
| Drawer Form | Single object matching JSON schema | Shared between Editor and Preview panels |
| Visibility Rule | Nested object within form state (`logic.visibleIf`) | Operator change conditionally nulls `value` |
| Field Order | Index array in local state | Updated on drag-and-drop |

### Key DX Patterns Tested
- Controlled, conditional form state without a dedicated form library
- Real-time derived UI from shared state (editor ↔ preview)
- Nested conditional state, dynamic option lists from sibling records, inline validation
- Virtualized rendering of 1,000+ rows
- Accessible drag-and-drop with keyboard support
