import { create } from "zustand";
import { generateMockFields } from "./mock-data";

export interface FieldValidation {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface FieldConfig {
  placeholder?: string;
  defaultValue?: unknown;
  options?: string[];
}

export interface Field {
  id: string;
  label: string;
  name: string;
  type: "text" | "number" | "boolean" | "select";
  validation: FieldValidation;
  config: FieldConfig;
  status: "active" | "inactive";
  usageCount: number;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  pattern?: string;
  maxLength?: number;
}

interface AppState {
  isAuthenticated: boolean;
  fields: Field[];
  login: () => void;
  logout: () => void;
  addField: (field: Field) => void;
  deleteFields: (ids: Set<string>) => void;
  deactivateFields: (ids: Set<string>) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  fields: generateMockFields(1000),
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  addField: (field) => set((s) => ({ fields: [...s.fields, field] })),
  deleteFields: (ids) =>
    set((s) => ({ fields: s.fields.filter((f) => !ids.has(f.id)) })),
  deactivateFields: (ids) =>
    set((s) => ({
      fields: s.fields.map((f) =>
        ids.has(f.id) ? { ...f, status: "inactive" as const } : f,
      ),
    })),
  reorderFields: (fromIndex, toIndex) =>
    set((s) => {
      const fields = [...s.fields];
      const [moved] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, moved);
      return { fields };
    }),
}));
