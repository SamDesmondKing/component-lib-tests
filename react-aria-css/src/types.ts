export interface FieldRecord {
	id: string;
	label: string;
	name: string;
	type: "text" | "number" | "boolean" | "select";
	validation: {
		required: boolean;
		min?: number;
		max?: number;
		pattern?: string;
	};
	config: {
		placeholder: string;
		defaultValue: unknown;
		options?: string[];
	};
	logic: {
		visibleIf?: {
			field: string;
			operator: "equals" | "contains" | "filled";
			value?: unknown;
		};
	};
	status: "active" | "inactive";
	usageCount: number;
}
