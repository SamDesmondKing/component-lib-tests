import { useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import type { FieldSchema } from "./types";
import { FieldForm } from "./FieldForm";

interface FieldDrawerProps {
	existingFields: FieldSchema[];
	onClose: () => void;
	onSave: (field: FieldSchema) => void;
}

export function FieldDrawer({ onClose, onSave }: FieldDrawerProps) {
	const drawerRef = useRef<HTMLDivElement>(null);

	// Focus trap: focus the drawer on mount
	useEffect(() => {
		const el = drawerRef.current;
		if (el) {
			const first = el.querySelector<HTMLElement>(
				"[tabindex], button, input, select, textarea",
			);
			first?.focus();
		}
	}, []);

	// Close on Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50 flex justify-end">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/30" onClick={onClose} />

			{/* Drawer panel */}
			<div
				ref={drawerRef}
				role="dialog"
				aria-label="New Field"
				className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-gray-900 shadow-2xl"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
					<h2 className="text-lg font-semibold text-gray-100">New Field</h2>
					<Button
						onPress={onClose}
						className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
						aria-label="Close"
					>
						✕
					</Button>
				</div>
				<div className="flex flex-1 overflow-hidden">
					<div className="flex-1 overflow-y-auto p-6">
						<FieldForm onSave={onSave} />
					</div>
				</div>
			</div>
		</div>
	);
}
