import { Button } from "react-aria-components";

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
	return (
		<div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-gray-800 px-6 py-3 text-sm text-white shadow-2xl ring-1 ring-gray-700">
			<span className="font-medium">{count} selected</span>
			<Button
				onPress={onDeactivate}
				className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-yellow-400"
			>
				Deactivate
			</Button>
			<Button
				onPress={onDelete}
				className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
			>
				Delete
			</Button>
		</div>
	);
}
