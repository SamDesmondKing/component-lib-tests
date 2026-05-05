import { v4 as uuid } from "uuid";
import type { FieldRecord } from "./types";

const TYPES: FieldRecord["type"][] = [
	"text",
	"number",
	"boolean",
	"select",
];
const STATUSES: FieldRecord["status"][] = ["active", "inactive"];

function slugify(s: string) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
}

export function generateMockFields(count: number): FieldRecord[] {
	return Array.from({ length: count }, (_, i) => {
		const label = `Field ${i + 1}`;
		const type = TYPES[i % TYPES.length];
		return {
			id: uuid(),
			label,
			name: slugify(label),
			type,
			validation: { required: i % 3 === 0 },
			config: { placeholder: `Enter ${label.toLowerCase()}`, defaultValue: "" },
			logic: {},
			status: STATUSES[i % 7 === 0 ? 1 : 0],
			usageCount: Math.floor(Math.random() * 500),
		};
	});
}
