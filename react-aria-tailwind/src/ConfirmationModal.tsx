import { Dialog, Modal, ModalOverlay, Heading, Button } from 'react-aria-components'

interface ConfirmationModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({ title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <ModalOverlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Modal className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl">
        <Dialog className="outline-none">
          <Heading slot="title" className="text-lg font-semibold text-gray-100">{title}</Heading>
          <p className="mt-2 text-sm text-gray-400">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              onPress={onCancel}
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onPress={onConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Delete
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
