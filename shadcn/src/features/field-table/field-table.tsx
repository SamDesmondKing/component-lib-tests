import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpDown, GripVertical } from "lucide-react";
import { useFieldStore, useFilteredFields } from "@/stores/field-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { FieldSchema } from "@/data/types";

const COLUMNS: { key: keyof FieldSchema; label: string; width: string }[] = [
  { key: "label", label: "Label", width: "flex-1" },
  { key: "name", label: "Name", width: "flex-1" },
  { key: "type", label: "Type", width: "w-24" },
  { key: "status", label: "Status", width: "w-24" },
  { key: "usageCount", label: "Usage", width: "w-20" },
];

function SortableRow({ field }: { field: FieldSchema }) {
  const { selected, toggleSelect } = useFieldStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center border-b px-2 h-10 text-sm"
    >
      <button
        className="mr-2 cursor-grab touch-none text-muted-foreground"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="mr-3">
        <Checkbox
          checked={selected.has(field.id)}
          onCheckedChange={() => toggleSelect(field.id)}
          aria-label={`Select ${field.label}`}
        />
      </div>
      <span className="flex-1 truncate">{field.label}</span>
      <span className="flex-1 truncate font-mono text-xs text-muted-foreground">
        {field.name}
      </span>
      <span className="w-24">{field.type}</span>
      <span className="w-24">
        <Badge variant={field.status === "active" ? "default" : "secondary"}>
          {field.status}
        </Badge>
      </span>
      <span className="w-20 text-right">{field.usageCount}</span>
    </div>
  );
}

export function FieldTable() {
  const {
    filter,
    setFilter,
    sortKey,
    sortDir,
    toggleSort,
    selected,
    selectAll,
  } = useFieldStore();
  const filteredFields = useFilteredFields();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredFields.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      useFieldStore.getState().reorder(String(active.id), String(over.id));
    }
  }

  const allIds = filteredFields.map((f) => f.id);
  const allSelected =
    filteredFields.length > 0 && allIds.every((id) => selected.has(id));

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <Input
          placeholder="Filter by label or name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Header */}
      <div className="flex items-center border-b px-2 h-10 text-sm font-medium bg-muted/50">
        <div className="mr-2 w-4" />
        <div className="mr-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={() => selectAll(allIds)}
            aria-label="Select all"
          />
        </div>
        {COLUMNS.map((col) => (
          <button
            type="button"
            key={col.key}
            className={`${col.width} flex items-center gap-1 text-left hover:text-foreground`}
            onClick={() => toggleSort(col.key as never)}
          >
            {col.label}
            {sortKey === col.key && (
              <ArrowUpDown className="size-3" data-dir={sortDir} />
            )}
          </button>
        ))}
      </div>

      {/* Virtualized body */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredFields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={parentRef} className="flex-1 overflow-auto">
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const field = filteredFields[virtualRow.index];
                return (
                  <div
                    key={field.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <SortableRow field={field} />
                  </div>
                );
              })}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
