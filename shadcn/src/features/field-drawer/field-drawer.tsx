import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldStore } from "@/stores/field-store";
import type { FieldSchema } from "@/data/types";

interface FieldDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

const INITIAL = {
  label: "",
  name: "",
  type: "text" as FieldSchema["type"],
  status: "active" as FieldSchema["status"],
  placeholder: "",
  defaultValue: "",
  required: false,
};

export function FieldDrawer({ open, onOpenChange }: FieldDrawerProps) {
  const addField = useFieldStore((s) => s.addField);
  const [form, setForm] = useState(INITIAL);
  const [nameEdited, setNameEdited] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(INITIAL);
      setNameEdited(false);
    }
  }, [open]);

  function handleLabelChange(value: string) {
    setForm((f) => ({
      ...f,
      label: value,
      name: nameEdited ? f.name : slugify(value),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim()) return;

    const field: FieldSchema = {
      id: crypto.randomUUID(),
      label: form.label.trim(),
      name: form.name || slugify(form.label),
      type: form.type,
      validation: { required: form.required },
      config: {
        placeholder: form.placeholder || undefined,
        defaultValue: form.defaultValue || undefined,
      },
      status: form.status,
      usageCount: 0,
    };

    addField(field);
    toast.success(`Field "${field.label}" created`);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New Field</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="field-label">Label *</Label>
            <Input
              id="field-label"
              value={form.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Customer Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-name">Name (slug)</Label>
            <Input
              id="field-name"
              value={form.name}
              onChange={(e) => {
                setNameEdited(true);
                setForm((f) => ({ ...f, name: e.target.value }));
              }}
              placeholder="auto-generated from label"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, type: v as FieldSchema["type"] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="select">Select</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, status: v as FieldSchema["status"] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={form.placeholder}
              onChange={(e) =>
                setForm((f) => ({ ...f, placeholder: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-default">Default Value</Label>
            <Input
              id="field-default"
              value={form.defaultValue}
              onChange={(e) =>
                setForm((f) => ({ ...f, defaultValue: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="field-required"
              checked={form.required}
              onCheckedChange={(v) =>
                setForm((f) => ({ ...f, required: v === true }))
              }
            />
            <Label htmlFor="field-required">Required</Label>
          </div>

          <Button type="submit" className="w-full">
            Create Field
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
