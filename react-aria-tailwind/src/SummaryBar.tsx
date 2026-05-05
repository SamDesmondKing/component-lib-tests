import type { FieldSchema } from "./types";

interface SummaryBarProps {
	fields: FieldSchema[];
}

export function SummaryBar({ fields }: SummaryBarProps) {
	const activeCount = fields.filter((f) => f.status === "active").length;

	return (
		<div className="mx-6 mt-4 flex gap-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 shadow-lg shadow-blue-900/30">
			<div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
				<p className="text-xs font-medium uppercase tracking-wide text-white/80">
					Total Fields
				</p>
				<p className="text-2xl font-bold text-white">{fields.length}</p>
			</div>
			<div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
				<p className="text-xs font-medium uppercase tracking-wide text-white/80">
					Active Fields
				</p>
				<p className="text-2xl font-bold text-white">{activeCount}</p>
			</div>
			<div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
				<p className="text-xs font-medium uppercase tracking-wide text-white/80">
					Inactive
				</p>
				<p className="text-2xl font-bold text-white">
					{fields.length - activeCount}
				</p>
			</div>
		</div>
	);
}
