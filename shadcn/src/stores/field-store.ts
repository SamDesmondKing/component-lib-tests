import { create } from "zustand";
import type { FieldSchema } from "@/data/types";
import { generateMockFields } from "@/data/mock-fields";
import { arrayMove } from "@dnd-kit/sortable";

type SortKey = "label" | "name" | "type" | "status" | "usageCount";
type SortDir = "asc" | "desc";

interface FieldState {
  fields: FieldSchema[];
  filter: string;
  sortKey: SortKey;
  sortDir: SortDir;
  selected: Set<string>;

  setFilter: (filter: string) => void;
  toggleSort: (key: SortKey) => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  deactivateSelected: () => void;
  deleteSelected: () => void;
  reorder: (activeId: string, overId: string) => void;
  addField: (field: FieldSchema) => void;
}

export const useFieldStore = create<FieldState>((set) => ({
  fields: generateMockFields(),
  filter: "",
  sortKey: "label",
  sortDir: "asc",
  selected: new Set(),

  setFilter: (filter) => set({ filter }),

  toggleSort: (key) =>
    set((s) => ({
      sortKey: key,
      sortDir: s.sortKey === key && s.sortDir === "asc" ? "desc" : "asc",
    })),

  toggleSelect: (id) =>
    set((s) => {
      const next = new Set(s.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selected: next };
    }),

  selectAll: (ids) =>
    set((s) => {
      const allSelected = ids.every((id) => s.selected.has(id));
      return { selected: allSelected ? new Set() : new Set(ids) };
    }),

  clearSelection: () => set({ selected: new Set() }),

  deactivateSelected: () =>
    set((s) => ({
      fields: s.fields.map((f) =>
        s.selected.has(f.id) ? { ...f, status: "inactive" as const } : f,
      ),
      selected: new Set(),
    })),

  deleteSelected: () =>
    set((s) => ({
      fields: s.fields.filter((f) => !s.selected.has(f.id)),
      selected: new Set(),
    })),

  reorder: (activeId, overId) =>
    set((s) => {
      const oldIndex = s.fields.findIndex((f) => f.id === activeId);
      const newIndex = s.fields.findIndex((f) => f.id === overId);
      if (oldIndex === -1 || newIndex === -1) return s;
      return { fields: arrayMove(s.fields, oldIndex, newIndex) };
    }),

  addField: (field) => set((s) => ({ fields: [field, ...s.fields] })),
}));

export function useFilteredFields() {
  const { fields, filter, sortKey, sortDir } = useFieldStore();
  let result = fields;
  if (filter) {
    const lower = filter.toLowerCase();
    result = result.filter(
      (f) =>
        f.label.toLowerCase().includes(lower) ||
        f.name.toLowerCase().includes(lower),
    );
  }
  result = [...result].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
  return result;
}
