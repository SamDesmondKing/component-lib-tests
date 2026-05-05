import { useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, Modal, Heading, Button, Input, Label } from "react-aria-components";
import type { FieldRecord } from "./types";
import "./FieldDrawer.css";

interface FieldDrawerProps {
	onClose: () => void;
	onSave: (field: FieldRecord) => void;
}

function slugify(s: string) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
}

export function FieldDrawer({ onClose, onSave }: FieldDrawerProps) {
	const [label, setLabel] = useState("");
	const [type, setType] = useState<FieldRecord["type"]>("text");
	const [status, setStatus] = useState<FieldRecord["status"]>("active");
	const [placeholder, setPlaceholder] = useState("");
	const [required, setRequired] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!label.trim()) return;
		const field: FieldRecord = {
			id: crypto.randomUUID(),
			label,
			name: slugify(label),
			type,
			validation: { required },
			config: { placeholder: placeholder || `Enter ${label.toLowerCase()}`, defaultValue: "" },
			logic: {},
			status,
			usageCount: 0,
		};
		onSave(field);
	};

	return createPortal(
		<Modal
			isOpen
			isDismissable
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
			className="field-drawer__overlay"
		>
			<Dialog className="field-drawer" aria-label="New Field">
				<div className="field-drawer__header">
					<Heading slot="title" className="field-drawer__title">
						New Field
					</Heading>
					<Button
						className="field-drawer__close"
						onPress={onClose}
						aria-label="Close drawer"
					>
						✕
					</Button>
				</div>
				<div className="field-drawer__body">
					<form className="field-drawer__form" onSubmit={handleSubmit}>
						<div className="field-drawer__field">
							<Label className="field-drawer__label">Label</Label>
							<Input
								className="field-drawer__input"
								value={label}
								onChange={(e) => setLabel(e.target.value)}
								placeholder="e.g. First Name"
								required
							/>
						</div>
						<div className="field-drawer__field">
							<Label className="field-drawer__label">Name (slug)</Label>
							<Input
								className="field-drawer__input field-drawer__input--mono"
								value={slugify(label)}
								disabled
							/>
						</div>
						<div className="field-drawer__field">
							<Label className="field-drawer__label">Type</Label>
							<select
								className="field-drawer__input"
								value={type}
								onChange={(e) => setType(e.target.value as FieldRecord["type"])}
							>
								<option value="text">text</option>
								<option value="number">number</option>
								<option value="boolean">boolean</option>
								<option value="select">select</option>
							</select>
						</div>
						<div className="field-drawer__field">
							<Label className="field-drawer__label">Status</Label>
							<select
								className="field-drawer__input"
								value={status}
								onChange={(e) => setStatus(e.target.value as FieldRecord["status"])}
							>
								<option value="active">active</option>
								<option value="inactive">inactive</option>
							</select>
						</div>
						<div className="field-drawer__field">
							<Label className="field-drawer__label">Placeholder</Label>
							<Input
								className="field-drawer__input"
								value={placeholder}
								onChange={(e) => setPlaceholder(e.target.value)}
								placeholder="Optional placeholder text"
							/>
						</div>
						<div className="field-drawer__field field-drawer__field--row">
							<input
								type="checkbox"
								id="required-check"
								checked={required}
								onChange={(e) => setRequired(e.target.checked)}
							/>
							<Label htmlFor="required-check" className="field-drawer__label">
								Required
							</Label>
						</div>
						<Button type="submit" className="field-drawer__submit">
							Create Field
						</Button>
					</form>
				</div>
			</Dialog>
		</Modal>,
		document.body,
	);
}
