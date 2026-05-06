import { useState } from "react";
import { Trash2, XCircle } from "lucide-react";
import { useFieldStore } from "@/stores/field-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function BulkActionBar() {
  const { selected, deactivateSelected, deleteSelected, clearSelection } =
    useFieldStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (selected.size === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border bg-background p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button size="sm" variant="secondary" onClick={deactivateSelected}>
            <XCircle className="mr-1 size-4" />
            Deactivate
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="mr-1 size-4" />
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            Cancel
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selected.size} field(s)? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteSelected();
                setConfirmOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
