import type { FieldSchema, FieldType, FieldStatus } from "./types";

const FIELD_TYPES: FieldType[] = [
	"text",
	"number",
	"boolean",
	"date",
	"select",
];
const STATUSES: FieldStatus[] = ["active", "inactive"];

const LABELS = [
	"First Name",
	"Last Name",
	"Email Address",
	"Phone Number",
	"Date of Birth",
	"Company Name",
	"Job Title",
	"Department",
	"Employee ID",
	"Start Date",
	"Salary",
	"Is Active",
	"Country",
	"City",
	"Zip Code",
	"Notes",
	"Priority",
	"Category",
	"Tags",
	"Rating",
	"Description",
	"URL",
	"Age",
	"Gender",
	"Language",
	"Timezone",
	"Currency",
	"Amount",
	"Quantity",
	"Discount",
	"Tax Rate",
	"Total",
	"Status",
	"Type",
	"Source",
	"Channel",
	"Campaign",
	"Referral Code",
	"Subscription",
	"Plan",
];

function slugify(label: string): string {
	return label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
}

function randomId(): string {
	return crypto.randomUUID();
}

export function generateMockFields(count: number): FieldSchema[] {
	const fields: FieldSchema[] = [];
	for (let i = 0; i < count; i++) {
		const label = `${LABELS[i % LABELS.length]} ${Math.floor(i / LABELS.length) + 1}`;
		const type = FIELD_TYPES[i % FIELD_TYPES.length];
		fields.push({
			id: randomId(),
			label,
			name: slugify(label),
			type,
			validation: { required: i % 3 === 0 },
			config: {
				placeholder: `Enter ${label.toLowerCase()}`,
				defaultValue: "",
				options: type === "select" ? ["Option A", "Option B", "Option C"] : [],
			},
			logic: {},
			status: STATUSES[i % 7 === 0 ? 1 : 0],
			usageCount: Math.floor(Math.random() * 500),
		});
	}
	return fields;
}
