import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Badge,
  Checkbox,
  Group,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import { type Field, useAppStore } from "../store";

type SortKey = "label" | "name" | "type" | "status" | "usageCount";
type SortDir = "asc" | "desc";

interface Props {
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
}

const ROW_HEIGHT = 42;

export function FieldTable({ selected, setSelected }: Props) {
  const fields = useAppStore((s) => s.fields);
  const reorderFields = useAppStore((s) => s.reorderFields);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("label");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    let result = fields;
    if (q) {
      result = result.filter(
        (f) =>
          f.label.toLowerCase().includes(q) || f.name.toLowerCase().includes(q),
      );
    }
    return [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number"
          ? av - (bv as number)
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [fields, filter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allSelected =
    filtered.length > 0 && filtered.every((f) => selected.has(f.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((f) => f.id)));
    }
  };

  const toggleRow = useCallback(
    (id: string) => {
      setSelected(
        selected.has(id)
          ? new Set([...selected].filter((x) => x !== id))
          : new Set([...selected, id]),
      );
    },
    [selected, setSelected],
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <UnstyledButton onClick={() => toggleSort(field)}>
      <Group gap={4}>
        <Text fw={600} size="sm">
          {label}
        </Text>
        {sortKey === field && (
          <Text size="xs">{sortDir === "asc" ? "↑" : "↓"}</Text>
        )}
      </Group>
    </UnstyledButton>
  );

  const virtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? totalHeight - virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <>
      <TextInput
        placeholder="Filter by label or name..."
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        mb="sm"
      />
      <div
        ref={parentRef}
        style={{
          height: "60vh",
          overflow: "auto",
          border: "1px solid var(--mantine-color-default-border)",
          borderRadius: "var(--mantine-radius-sm)",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table striped highlightOnHover layout="fixed">
              <Table.Thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  background: "var(--mantine-color-body)",
                }}
              >
                <Table.Tr>
                  <Table.Th w={50}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selected.size > 0 && !allSelected}
                      onChange={toggleAll}
                      aria-label="Select all"
                    />
                  </Table.Th>
                  <Table.Th w={40} />
                  <Table.Th>
                    <SortHeader label="Label" field="label" />
                  </Table.Th>
                  <Table.Th>
                    <SortHeader label="Name" field="name" />
                  </Table.Th>
                  <Table.Th w={80}>
                    <SortHeader label="Type" field="type" />
                  </Table.Th>
                  <Table.Th w={100}>
                    <SortHeader label="Status" field="status" />
                  </Table.Th>
                  <Table.Th w={80}>
                    <SortHeader label="Usage" field="usageCount" />
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: paddingTop, padding: 0 }} />
                  </tr>
                )}
                {virtualItems.map((virtualRow) => {
                  const field = filtered[virtualRow.index];
                  return (
                    <SortableRow
                      key={field.id}
                      field={field}
                      isSelected={selected.has(field.id)}
                      toggleRow={toggleRow}
                    />
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: paddingBottom, padding: 0 }} />
                  </tr>
                )}
              </Table.Tbody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

function SortableRow({
  field,
  isSelected,
  toggleRow,
}: {
  field: Field;
  isSelected: boolean;
  toggleRow: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const rowStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Table.Tr ref={setNodeRef} style={rowStyle}>
      <Table.Td w={50}>
        <Checkbox
          checked={isSelected}
          onChange={() => toggleRow(field.id)}
          aria-label={`Select ${field.label}`}
        />
      </Table.Td>
      <Table.Td w={40}>
        <UnstyledButton
          {...attributes}
          {...listeners}
          style={{ cursor: "grab", touchAction: "none" }}
          aria-label={`Drag ${field.label}`}
        >
          ⠿
        </UnstyledButton>
      </Table.Td>
      <Table.Td>{field.label}</Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed" ff="monospace">
          {field.name}
        </Text>
      </Table.Td>
      <Table.Td w={80}>{field.type}</Table.Td>
      <Table.Td w={100}>
        <Badge
          color={field.status === "active" ? "green" : "gray"}
          variant="light"
        >
          {field.status}
        </Badge>
      </Table.Td>
      <Table.Td w={80}>{field.usageCount}</Table.Td>
    </Table.Tr>
  );
}
