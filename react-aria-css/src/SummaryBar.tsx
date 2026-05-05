import type { FieldRecord } from "./types";
import "./SummaryBar.css";

interface SummaryBarProps {
	fields: FieldRecord[];
}

export function SummaryBar({ fields }: SummaryBarProps) {
	const activeCount = fields.filter((f) => f.status === "active").length;

	return (
		<div className="summary-bar">
			<div className="summary-bar__stat">
				<span className="summary-bar__label">Total Fields</span>
				<span className="summary-bar__value">{fields.length}</span>
			</div>
			<div className="summary-bar__stat">
				<span className="summary-bar__label">Active Fields</span>
				<span className="summary-bar__value">{activeCount}</span>
			</div>
			<div className="summary-bar__stat">
				<span className="summary-bar__label">Inactive</span>
				<span className="summary-bar__value">
					{fields.length - activeCount}
				</span>
			</div>
		</div>
	);
}
