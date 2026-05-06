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
import { Switch } from "@/components/ui/switch";

interface FieldDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
};

const INITIAL = {
  label: "",
  name: "",
  type: "text" as FieldSchema["type"],
  status: "active" as FieldSchema["status"],
  placeholder: "",
  defaultValue: "",
  min: "",
  max: "",
  pattern: "",
  maxLength: "",
  decimalPlaces: "",
  options: [] as string[],
  optionDraft: "",
  required: false,
};

export const FieldDrawer = ({ open, onOpenChange }: FieldDrawerProps) => {
  const addField = useFieldStore((state) => state.addField);
  const [form, setForm] = useState(INITIAL);
  const [nameEdited, setNameEdited] = useState(false);
  const [previewValue, setPreviewValue] = useState("");
  const options = form.options ?? [];
  const optionDraft = form.optionDraft ?? "";
  const maxLengthNumber = Number(form.maxLength);
  const resolvedMaxLength =
    form.maxLength.trim() !== "" &&
    Number.isInteger(maxLengthNumber) &&
    maxLengthNumber >= 0
      ? maxLengthNumber
      : undefined;

  const previewValidationMessage = (() => {
    if (form.type !== "text") {
      return undefined;
    }

    if (form.maxLength.trim() !== "" && resolvedMaxLength === undefined) {
      return "Max length must be a non-negative whole number.";
    }

    if (form.pattern.trim() === "") {
      return undefined;
    }

    try {
      const patternRegex = new RegExp(form.pattern);
      if (previewValue !== "" && !patternRegex.test(previewValue)) {
        return "Value does not match the configured pattern.";
      }
    } catch {
      return "Pattern is not a valid regular expression.";
    }

    return undefined;
  })();

  useEffect(() => {
    if (!open) {
      setForm(INITIAL);
      setNameEdited(false);
      setPreviewValue("");
    }
  }, [open]);

  useEffect(() => {
    if (
      resolvedMaxLength !== undefined &&
      previewValue.length > resolvedMaxLength
    ) {
      setPreviewValue(previewValue.slice(0, resolvedMaxLength));
    }
  }, [previewValue, resolvedMaxLength]);

  const handleLabelChange = (value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      label: value,
      name: nameEdited ? currentForm.name : slugify(value),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.label.trim()) return;
    if (form.type === "select" && options.length === 0) {
      toast.error("Add at least one dropdown option");
      return;
    }

    const min = form.min === "" ? undefined : Number(form.min);
    const max = form.max === "" ? undefined : Number(form.max);
    const decimalPlaces =
      form.decimalPlaces === "" ? undefined : Number(form.decimalPlaces);

    const field: FieldSchema = {
      id: crypto.randomUUID(),
      label: form.label.trim(),
      name: form.name || slugify(form.label),
      type: form.type,
      validation: {
        required: form.required,
        min: form.type === "number" ? min : undefined,
        max: form.type === "number" ? max : undefined,
        pattern: form.type === "text" ? form.pattern : undefined,
        maxLength: form.type === "text" ? form.maxLength : undefined,
      },
      config: {
        placeholder: form.placeholder || undefined,
        defaultValue: form.defaultValue || undefined,
        decimalPlaces: form.type === "number" ? decimalPlaces : undefined,
        options: form.type === "select" ? options : undefined,
      },
      status: form.status,
      usageCount: 0,
    };

    addField(field);
    toast.success(`Field "${field.label}" created`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>New Field</SheetTitle>
        </SheetHeader>
        <div className="grid items-stretch gap-4 p-4 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="h-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-label">Label *</Label>
              <Input
                id="field-label"
                value={form.label}
                onChange={(event) => handleLabelChange(event.target.value)}
                placeholder="e.g. Customer Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-name">Name (slug)</Label>
              <Input
                id="field-name"
                value={form.name}
                onChange={(event) => {
                  setNameEdited(true);
                  setForm((currentForm) => ({
                    ...currentForm,
                    name: event.target.value,
                  }));
                }}
                placeholder="auto-generated from label"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={form.placeholder}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    placeholder: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    type: value as FieldSchema["type"],
                  }))
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

            {form.type === "number" && (
              <div className="space-y-2">
                <div className="space-y-4">
                  <Label htmlFor="field-min">Min</Label>
                  <Input
                    id="field-min"
                    type="number"
                    value={form.min}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        min: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field-max">Max</Label>
                  <Input
                    id="field-max"
                    type="number"
                    value={form.max}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        max: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field-decimal-places">Decimal Places</Label>
                  <Input
                    id="field-decimal-places"
                    type="number"
                    min={0}
                    step={1}
                    value={form.decimalPlaces}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        decimalPlaces: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {form.type === "select" && (
              <div className="space-y-2">
                <Label htmlFor="field-option-draft">Dropdown Options</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="field-option-draft"
                    value={optionDraft}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        optionDraft: event.target.value,
                      }))
                    }
                    placeholder="Type an option and add"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const value = optionDraft.trim();
                      if (!value) return;
                      if (options.includes(value)) {
                        toast.error("Option already added");
                        return;
                      }
                      setForm((form) => ({
                        ...form,
                        options: [...(form.options ?? []), value],
                        optionDraft: "",
                      }));
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {options.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No options yet.
                    </p>
                  )}

                  {options.map((option, index) => (
                    <div
                      key={option}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <span className="text-sm">{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setForm((currentForm) => ({
                            ...currentForm,
                            options: (currentForm.options ?? []).filter(
                              (_option, optionIndex) => optionIndex !== index,
                            ),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.type === "text" && (
              <div className="space-y-2">
                <div className="space-y-4">
                  <Label htmlFor="field-pattern">Pattern</Label>
                  <Input
                    id="field-pattern"
                    type="text"
                    value={form.pattern}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        pattern: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="field-max-length">Max length</Label>
                  <Input
                    id="field-max-length"
                    type="number"
                    min={0}
                    step={1}
                    value={form.maxLength}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        maxLength: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    status: value as FieldSchema["status"],
                  }))
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
              <Label htmlFor="field-default">Default Value</Label>
              <Input
                id="field-default"
                value={form.defaultValue}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    defaultValue: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="field-required"
                  checked={form.required}
                  onCheckedChange={(checked) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      required: checked === true,
                    }))
                  }
                />
                <Label htmlFor="field-required">Required</Label>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Field
            </Button>
          </form>

          <aside className="h-full rounded-md border bg-muted/20 p-4">
            <h3 className="text-sm font-medium">Preview</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {form.type === "text" && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="field-label">{form.label || "Label"}</Label>
                  <Input
                    id="field-label"
                    value={previewValue}
                    onChange={(event) => {
                      const nextValue =
                        resolvedMaxLength !== undefined
                          ? event.target.value.slice(0, resolvedMaxLength)
                          : event.target.value;
                      setPreviewValue(nextValue);
                    }}
                    maxLength={resolvedMaxLength}
                    placeholder={form.placeholder}
                    disabled={form.status === "inactive"}
                  />
                  {previewValidationMessage && (
                    <p className="text-xs text-destructive">
                      {previewValidationMessage}
                    </p>
                  )}
                </div>
              )}
              {form.type === "boolean" && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="field-label">{form.label || "Label"}</Label>
                  <Switch disabled={form.status === "inactive"} />
                </div>
              )}
              {form.type === "select" && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="field-label">{form.label || "Label"}</Label>
                  <Select
                    disabled={
                      form.status === "inactive" || options.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          options.length === 0
                            ? "Add options to preview"
                            : form.placeholder || "Select an option"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {form.type === "number" && <div></div>}
            </div>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  );
};
