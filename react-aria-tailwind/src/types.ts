export type FieldType = "text" | "number" | "boolean" | "select";
export type FieldStatus = "active" | "inactive";
export type Operator = "equals" | "contains" | "filled";

export interface FieldValidation {
	required: boolean;
	min?: number;
	max?: number;
	pattern?: string;
}

export interface FieldConfig {
	placeholder: string;
	defaultValue: unknown;
	options: string[];
}

export interface VisibilityRule {
	field: string;
	operator: Operator;
	value: unknown;
}

export interface FieldLogic {
	visibleIf?: VisibilityRule;
}

export interface FieldSchema {
	id: string;
	label: string;
	name: string;
	type: FieldType;
	validation: FieldValidation;
	min?: number;
	max?: number;
	decimalPlaces?: number;
	maxLength?: number;
	config: FieldConfig;
	logic: FieldLogic;
	status: FieldStatus;
	usageCount: number;
}
