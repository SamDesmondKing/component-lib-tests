import {
	Dialog,
	DialogTrigger,
	Modal,
	Heading,
	Button,
} from "react-aria-components";
import "./ConfirmationModal.css";

interface ConfirmationModalProps {
	count: number;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmationModal({
	count,
	onConfirm,
	onCancel,
}: ConfirmationModalProps) {
	return (
		<DialogTrigger
			isOpen
			onOpenChange={(open) => {
				if (!open) onCancel();
			}}
		>
			<button style={{ display: "none" }} />
			<Modal isDismissable className="confirmation-modal__overlay">
				<Dialog className="confirmation-modal" role="alertdialog">
					<Heading slot="title" className="confirmation-modal__title">
						Confirm Delete
					</Heading>
					<p className="confirmation-modal__body">
						Are you sure you want to delete {count} field
						{count !== 1 ? "s" : ""}? This action cannot be undone.
					</p>
					<div className="confirmation-modal__actions">
						<Button
							className="confirmation-modal__btn confirmation-modal__btn--cancel"
							onPress={onCancel}
						>
							Cancel
						</Button>
						<Button
							className="confirmation-modal__btn confirmation-modal__btn--confirm"
							onPress={onConfirm}
						>
							Delete
						</Button>
					</div>
				</Dialog>
			</Modal>
		</DialogTrigger>
	);
}
