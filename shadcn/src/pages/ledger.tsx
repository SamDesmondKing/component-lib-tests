import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryBar } from "@/features/summary-bar";
import { FieldTable } from "@/features/field-table/field-table";
import { BulkActionBar } from "@/features/field-table/bulk-action-bar";
import { FieldDrawer } from "@/features/field-drawer/field-drawer";

export function LedgerPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Field Ledger</h1>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="mr-1 size-4" />
          New Field
        </Button>
      </div>
      <SummaryBar />
      <div className="flex-1 min-h-0">
        <FieldTable />
      </div>
      <BulkActionBar />
      <FieldDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
