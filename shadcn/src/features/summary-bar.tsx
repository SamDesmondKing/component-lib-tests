import { useFieldStore } from "@/stores/field-store";

export function SummaryBar() {
  const fields = useFieldStore((s) => s.fields);
  const total = fields.length;
  const active = fields.filter((f) => f.status === "active").length;

  return (
    <div className="mb-4 rounded-lg border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 shadow-sm">
      <div className="flex gap-6 text-sm font-medium">
        <span>
          Total Fields: <strong>{total}</strong>
        </span>
        <span>
          Active Fields: <strong>{active}</strong>
        </span>
      </div>
    </div>
  );
}
