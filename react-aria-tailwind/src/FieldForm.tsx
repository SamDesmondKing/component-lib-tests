import { useState, useCallback } from "react";
import {
	TextField,
	Input,
	Label,
	Button,
	Select,
	SelectValue,
	Popover,
	ListBox,
	ListBoxItem,
	Checkbox,
	NumberField,
} from "react-aria-components";
import type { FieldSchema, FieldType, FieldStatus } from "./types";

type FieldFormProps = {
	onSave: (field: FieldSchema) => void;
};

const FIELD_TYPES: FieldType[] = ["text", "number", "boolean", "select"];
const STATUSES: FieldStatus[] = ["active", "inactive"];

const slugify = (s: string): string => {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
};

const createDefaultField = (): FieldSchema => {
	return {
		id: crypto.randomUUID(),
		label: "",
		name: "",
		type: "text",
		validation: { required: false },
		config: { placeholder: "", defaultValue: "", options: [] },
		logic: {},
		status: "active",
		usageCount: 0,
	};
};

export const FieldForm = ({ onSave }: FieldFormProps) => {
	const [field, setField] = useState<FieldSchema>(createDefaultField);
	const [nameManuallyEdited, setNameManuallyEdited] = useState(false);

	const updateField = useCallback(
		<K extends keyof FieldSchema>(key: K, value: FieldSchema[K]) => {
			setField((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const handleLabelChange = (value: string) => {
		updateField("label", value);
		if (!nameManuallyEdited) {
			updateField("name", slugify(value));
		}
	};

	const handleNameChange = (value: string) => {
		setNameManuallyEdited(true);
		updateField("name", value);
	};

	const handleTypeChange = (key: React.Key | null) => {
		if (key == null) return;
		const type = key as FieldType;
		setField((prev) => ({
			...prev,
			type,
			validation: {
				...prev.validation,
				pattern: undefined,
			},
			config: {
				...prev.config,
				options: type === "select" ? prev.config.options : [],
			},
			min: undefined,
			max: undefined,
			decimalPlaces: undefined,
			maxLength: undefined,
		}));
	};

	const handleMinChange = (value: number) => {
		setField((prev) => ({
			...prev,
			min: Number.isFinite(value) ? value : undefined,
		}));
	};

	const handleMaxChange = (value: number) => {
		setField((prev) => ({
			...prev,
			max: Number.isFinite(value) ? value : undefined,
		}));
	};

	const handleDecimalPlacesChange = (value: number) => {
		setField((prev) => ({
			...prev,
			decimalPlaces: Number.isFinite(value) ? value : undefined,
		}));
	};

	const handlePatternChange = (value: string) => {
		setField((prev) => ({
			...prev,
			validation: {
				...prev.validation,
				pattern: value || undefined,
			},
		}));
	};

	const handleMaxLengthChange = (value: number) => {
		setField((prev) => ({
			...prev,
			maxLength: Number.isFinite(value) ? value : undefined,
		}));
	};

	const handleOptionChange = (index: number, value: string) => {
		setField((prev) => ({
			...prev,
			config: {
				...prev.config,
				options: prev.config.options.map((option, optionIndex) =>
					optionIndex === index ? value : option,
				),
			},
		}));
	};

	const handleAddOption = () => {
		setField((prev) => ({
			...prev,
			config: {
				...prev.config,
				options: [...prev.config.options, ""],
			},
		}));
	};

	const handleRemoveOption = (index: number) => {
		setField((prev) => ({
			...prev,
			config: {
				...prev.config,
				options: prev.config.options.filter(
					(_, optionIndex) => optionIndex !== index,
				),
			},
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(field);
	};

	const inputClass =
		"w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";
	const labelClass = "text-sm font-medium text-gray-300";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{/* Label */}
			<TextField
				value={field.label}
				onChange={handleLabelChange}
				className="flex flex-col gap-1"
			>
				<Label className={labelClass}>Label</Label>
				<Input className={inputClass} placeholder="Field label" />
			</TextField>

			{/* Name (slug) */}
			<TextField
				value={field.name}
				onChange={handleNameChange}
				className="flex flex-col gap-1"
			>
				<Label className={labelClass}>Name (slug)</Label>
				<Input
					className={`${inputClass} font-mono text-xs`}
					placeholder="field_name"
				/>
			</TextField>

			{/* Type */}
			<Select
				selectedKey={field.type}
				onSelectionChange={handleTypeChange}
				className="flex flex-col gap-1"
			>
				<Label className={labelClass}>Type</Label>
				<Button
					className={`${inputClass} flex items-center justify-between text-left`}
				>
					<SelectValue />
					<span>▾</span>
				</Button>
				<Popover className="w-(--trigger-width) rounded-lg border border-gray-600 bg-gray-800 shadow-lg">
					<ListBox className="p-1">
						{FIELD_TYPES.map((t) => (
							<ListBoxItem
								key={t}
								id={t}
								className="cursor-pointer rounded px-3 py-1.5 text-sm capitalize text-gray-200 hover:bg-gray-700 data-[focused]:bg-gray-700"
							>
								{t}
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>

			{field.type === "number" && (
				<>
					<NumberField
						name="min"
						value={field.min}
						onChange={handleMinChange}
						maxValue={field.max}
						className="flex flex-col gap-1"
					>
						<Label className={labelClass}>Min</Label>
						<Input
							className={inputClass}
							placeholder="Enter the min"
							inputMode="decimal"
						/>
					</NumberField>
					<NumberField
						name="max"
						value={field.max}
						onChange={handleMaxChange}
						minValue={field.min}
						className="flex flex-col gap-1"
					>
						<Label className={labelClass}>Max</Label>
						<Input
							className={inputClass}
							placeholder="Enter the max"
							inputMode="decimal"
						/>
					</NumberField>
					<NumberField
						name="decimalPlaces"
						value={field.decimalPlaces}
						onChange={handleDecimalPlacesChange}
						minValue={0}
						step={1}
						formatOptions={{ maximumFractionDigits: 0 }}
						className="flex flex-col gap-1"
					>
						<Label className={labelClass}>Decimal places</Label>
						<Input
							className={inputClass}
							placeholder="Enter the decimal places"
							inputMode="numeric"
						/>
					</NumberField>
				</>
			)}

			{field.type === "text" && (
				<>
					<TextField
						name="pattern"
						value={field.validation.pattern ?? ""}
						onChange={handlePatternChange}
						className="flex flex-col gap-1"
					>
						<Label className={labelClass}>Pattern</Label>
						<Input className={inputClass} placeholder="Field pattern" />
					</TextField>
					<NumberField
						name="maxLength"
						value={field.maxLength}
						onChange={handleMaxLengthChange}
						minValue={0}
						step={1}
						formatOptions={{ maximumFractionDigits: 0 }}
						className="flex flex-col gap-1"
					>
						<Label className={labelClass}>Max Length</Label>
						<Input
							className={inputClass}
							placeholder="Field max length"
							inputMode="numeric"
						/>
					</NumberField>
				</>
			)}

			{field.type === "select" && (
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<Label className={labelClass}>Dropdown options</Label>
						<Button
							type="button"
							onPress={handleAddOption}
							className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
						>
							Add option
						</Button>
					</div>
					{field.config.options.map((option, index) => (
						<div
							key={`${field.id}-option-${index}`}
							className="flex items-end gap-2"
						>
							<TextField
								name={`option-${index + 1}`}
								value={option}
								onChange={(value) => handleOptionChange(index, value)}
								className="flex-1 flex flex-col gap-1"
							>
								<Label className={labelClass}>Option {index + 1}</Label>
								<Input
									className={inputClass}
									placeholder={`Option ${index + 1}`}
								/>
							</TextField>
							<Button
								type="button"
								onPress={() => handleRemoveOption(index)}
								className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
							>
								Remove
							</Button>
						</div>
					))}
				</div>
			)}

			{/* Status */}
			<Select
				selectedKey={field.status}
				onSelectionChange={(key) => {
					if (key != null) updateField("status", key as FieldStatus);
				}}
				className="flex flex-col gap-1"
			>
				<Label className={labelClass}>Status</Label>
				<Button
					className={`${inputClass} flex items-center justify-between text-left`}
				>
					<SelectValue />
					<span>▾</span>
				</Button>
				<Popover className="w-(--trigger-width) rounded-lg border border-gray-600 bg-gray-800 shadow-lg">
					<ListBox className="p-1">
						{STATUSES.map((s) => (
							<ListBoxItem
								key={s}
								id={s}
								className="cursor-pointer rounded px-3 py-1.5 text-sm capitalize text-gray-200 hover:bg-gray-700 data-[focused]:bg-gray-700"
							>
								{s}
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>

			{/* Placeholder */}
			<TextField
				value={field.config.placeholder}
				onChange={(v) =>
					setField((prev) => ({
						...prev,
						config: { ...prev.config, placeholder: v },
					}))
				}
				className="flex flex-col gap-1"
			>
				<Label className={labelClass}>Placeholder</Label>
				<Input className={inputClass} placeholder="Placeholder text" />
			</TextField>

			{/* Default Value */}
			<TextField
				value={String(field.config.defaultValue ?? "")}
				onChange={(v) =>
					setField((prev) => ({
						...prev,
						config: { ...prev.config, defaultValue: v },
					}))
				}
				className="flex flex-col gap-1"
			>
				<Label className={labelClass}>Default Value</Label>
				<Input className={inputClass} placeholder="Default value" />
			</TextField>

			{/* Required */}
			<Checkbox
				isSelected={field.validation.required}
				onChange={(v) =>
					setField((prev) => ({
						...prev,
						validation: { ...prev.validation, required: v },
					}))
				}
				className="flex items-center gap-2"
			>
				<div className="flex h-4 w-4 items-center justify-center rounded border border-gray-500 bg-gray-700 text-[10px] text-transparent data-[selected]:bg-blue-600 data-[selected]:border-blue-600 data-[selected]:text-white">
					✓
				</div>
				<span className="text-sm text-gray-300">Required</span>
			</Checkbox>

			<Button
				type="submit"
				className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
			>
				Save Field
			</Button>
		</form>
	);
};
