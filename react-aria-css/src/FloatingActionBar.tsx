import { createPortal } from "react-dom";
import { Button } from "react-aria-components";
import "./FloatingActionBar.css";

interface FloatingActionBarProps {
	count: number;
	onDeactivate: () => void;
	onDelete: () => void;
}

export function FloatingActionBar({
	count,
	onDeactivate,
	onDelete,
}: FloatingActionBarProps) {
	return createPortal(
		<div
			className="floating-action-bar"
			role="toolbar"
			aria-label="Bulk actions"
		>
			<span className="floating-action-bar__count">{count} selected</span>
			<Button
				className="floating-action-bar__btn floating-action-bar__btn--deactivate"
				onPress={onDeactivate}
			>
				Deactivate
			</Button>
			<Button
				className="floating-action-bar__btn floating-action-bar__btn--delete"
				onPress={onDelete}
			>
				Delete
			</Button>
		</div>,
		document.body,
	);
}
