# Component Library Tests

Comparative implementations of **The Schema Architect** — a high-density admin tool for defining, validating, and previewing dynamic custom data fields — built with the same component library but different styling approaches.

## Projects

| Project | Component Library | Styling | Path |
|---|---|---|---|
| react-aria-tailwind | React Aria | Tailwind CSS | `react-aria-tailwind/` |
| react-aria-css | React Aria | Plain CSS | `react-aria-css/` |

## The Schema Architect

Each project implements the same set of features:

- **Login Form** — Email/password auth with validation, loading state, and toast notifications
- **Field Ledger** — Virtualized table (1,000+ rows) with sorting, filtering, and status badges
- **Bulk Management** — Multi-select with floating action bar for deactivate/delete
- **Side-Drawer Creation** — Portal-based drawer with focus trap for field configuration
- **Conditional Configuration** — Dynamic form that adapts based on field type
- **Live Component Preview** — Real-time preview of the configured field
- **Nested Rule Builder** — Visibility rules with conditional logic
- **Drag-and-Drop Reordering** — Accessible reordering with keyboard support

## Getting Started

Each project is an independent Vite + React + TypeScript app:

```bash
cd react-aria-tailwind  # or react-aria-css
npm install
npm run dev
```
