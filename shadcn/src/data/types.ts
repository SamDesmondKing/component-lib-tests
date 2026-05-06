export interface FieldSchema {
  id: string;
  label: string;
  name: string;
  type: "text" | "number" | "boolean" | "select";
  validation: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    maxLength?: string;
  };
  config: {
    placeholder?: string;
    defaultValue?: unknown;
    options?: string[];
    decimalPlaces?: number;
  };
  status: "active" | "inactive";
  usageCount: number;
}
