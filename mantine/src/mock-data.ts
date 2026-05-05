import type { Field } from "./store";

const TYPES: Field["type"][] = ["text", "number", "boolean", "select"];
const STATUSES: Field["status"][] = ["active", "inactive"];

const LABELS = [
  "First Name",
  "Last Name",
  "Email Address",
  "Phone Number",
  "Company Name",
  "Job Title",
  "Department",
  "Country",
  "City",
  "Zip Code",
  "Subscription Tier",
  "Account Status",
  "Preferred Language",
  "Timezone",
  "Date of Birth",
  "Employee ID",
  "Manager",
  "Team Size",
  "Budget",
  "Priority Level",
];

function slugify(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

function randomId(): string {
  return crypto.randomUUID();
}

export function generateMockFields(count: number): Field[] {
  return Array.from({ length: count }, (_, i) => {
    const label = `${LABELS[i % LABELS.length]} ${Math.floor(i / LABELS.length) + 1}`;
    const type = TYPES[i % TYPES.length];
    return {
      id: randomId(),
      label,
      name: slugify(label),
      type,
      validation: {
        required: Math.random() > 0.5,
        min: type === "number" ? 0 : undefined,
        max: type === "number" ? 100 : undefined,
        pattern: type === "text" ? undefined : undefined,
      },
      config: {
        placeholder: `Enter ${label.toLowerCase()}`,
        defaultValue: undefined,
        options:
          type === "select" ? ["Option A", "Option B", "Option C"] : undefined,
      },
      status: STATUSES[Math.random() > 0.3 ? 0 : 1],
      usageCount: Math.floor(Math.random() * 500),
    };
  });
}
