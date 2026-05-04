import { createPortal } from "react-dom";
import { Dialog, Modal, Heading, Button } from "react-aria-components";
import "./FieldDrawer.css";

interface FieldDrawerProps {
	onClose: () => void;
}

export function FieldDrawer({ onClose }: FieldDrawerProps) {
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
					<p className="field-drawer__placeholder">
						Field configuration form goes here.
					</p>
				</div>
			</Dialog>
		</Modal>,
		document.body,
	);
}
