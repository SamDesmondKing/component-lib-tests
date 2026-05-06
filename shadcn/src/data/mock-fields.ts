import type { FieldSchema } from "./types";

const TYPES: FieldSchema["type"][] = ["text", "number", "boolean", "select"];
const STATUSES: FieldSchema["status"][] = ["active", "inactive"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "_");
}

export function generateMockFields(count = 1000): FieldSchema[] {
  return Array.from({ length: count }, (_, i) => {
    const label = `Field ${i + 1}`;
    return {
      id: crypto.randomUUID(),
      label,
      name: slugify(label),
      type: randomItem(TYPES),
      validation: {
        required: Math.random() > 0.5,
        min: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : undefined,
        max:
          Math.random() > 0.7
            ? Math.floor(Math.random() * 100) + 10
            : undefined,
      },
      config: {
        placeholder: `Enter ${label.toLowerCase()}`,
      },
      status: randomItem(STATUSES),
      usageCount: Math.floor(Math.random() * 500),
    };
  });
}
