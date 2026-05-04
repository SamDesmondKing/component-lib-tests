import { useState, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox, Input, Button } from 'react-aria-components';
import type { FieldRecord } from './types';
import { FloatingActionBar } from './FloatingActionBar';
import { ConfirmationModal } from './ConfirmationModal';
import { FieldDrawer } from './FieldDrawer';
import './FieldLedger.css';

type SortKey = 'label' | 'name' | 'type' | 'status' | 'usageCount';
type SortDir = 'asc' | 'desc';

interface FieldLedgerProps {
  fields: FieldRecord[];
  onFieldsChange: (fields: FieldRecord[]) => void;
}

function SortableRow({
  field,
  isSelected,
  onToggle,
  virtualTop,
}: {
  field: FieldRecord;
  isSelected: boolean;
  onToggle: (id: string) => void;
  virtualTop: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'absolute' as const,
    top: virtualTop,
    left: 0,
    width: '100%',
  };

  return (
    <tr ref={setNodeRef} style={style} className="field-ledger__row">
      <td className="field-ledger__cell field-ledger__cell--drag">
        <button className="field-ledger__drag-handle" aria-label="Drag to reorder" {...attributes} {...listeners}>
          ⠿
        </button>
      </td>
      <td className="field-ledger__cell field-ledger__cell--check">
        <Checkbox isSelected={isSelected} onChange={() => onToggle(field.id)} aria-label={`Select ${field.label}`}>
          <div className="indicator">
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <polyline points="2 9 7 14 16 4" />
            </svg>
          </div>
        </Checkbox>
      </td>
      <td className="field-ledger__cell">{field.label}</td>
      <td className="field-ledger__cell field-ledger__cell--mono">{field.name}</td>
      <td className="field-ledger__cell">{field.type}</td>
      <td className="field-ledger__cell">
        <span className={`field-ledger__badge field-ledger__badge--${field.status}`}>
          {field.status}
        </span>
      </td>
      <td className="field-ledger__cell field-ledger__cell--num">{field.usageCount}</td>
    </tr>
  );
}

export function FieldLedger({ fields, onFieldsChange }: FieldLedgerProps) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return fields.filter(
      (f) => f.label.toLowerCase().includes(q) || f.name.toLowerCase().includes(q)
    );
  }, [fields, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 20,
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = () => {
    if (selection.size === sorted.length) {
      setSelection(new Set());
    } else {
      setSelection(new Set(sorted.map((f) => f.id)));
    }
  };

  const handleDeactivate = () => {
    onFieldsChange(
      fields.map((f) => (selection.has(f.id) ? { ...f, status: 'inactive' as const } : f))
    );
    setSelection(new Set());
  };

  const handleDeleteConfirm = () => {
    onFieldsChange(fields.filter((f) => !selection.has(f.id)));
    setSelection(new Set());
    setShowDeleteModal(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onFieldsChange(arrayMove(fields, oldIndex, newIndex));
      setSortKey(null);
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'label', label: 'Label' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'usageCount', label: 'Usage' },
  ];

  return (
    <div className="field-ledger">
      <h1 className="field-ledger__title">Field Ledger</h1>
      <div className="field-ledger__toolbar">
        <Input
          className="field-ledger__filter"
          placeholder="Search by label or name…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter fields"
        />
        <Button className="field-ledger__new-btn" onPress={() => setDrawerOpen(true)}>
          New Field
        </Button>
      </div>

      <div className="field-ledger__scroll" ref={parentRef}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <table className="field-ledger__table">
              <thead>
                <tr>
                  <th className="field-ledger__th field-ledger__th--drag" />
                  <th className="field-ledger__th field-ledger__th--check">
                    <Checkbox
                      isSelected={sorted.length > 0 && selection.size === sorted.length}
                      isIndeterminate={selection.size > 0 && selection.size < sorted.length}
                      onChange={toggleAll}
                      aria-label="Select all"
                    >
                      <div className="indicator">
                        <svg viewBox="0 0 18 18" aria-hidden="true">
                          {selection.size > 0 && selection.size < sorted.length
                            ? <rect x={1} y={7.5} width={16} height={3} />
                            : <polyline points="2 9 7 14 16 4" />}
                        </svg>
                      </div>
                    </Checkbox>
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="field-ledger__th field-ledger__th--sortable"
                      onClick={() => toggleSort(col.key)}
                      aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="field-ledger__sort-icon">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  position: 'relative',
                  display: 'block',
                }}
              >
                {virtualizer.getVirtualItems().map((vRow) => {
                  const field = sorted[vRow.index];
                  return (
                    <SortableRow
                      key={field.id}
                      field={field}
                      isSelected={selection.has(field.id)}
                      onToggle={toggleSelect}
                      virtualTop={vRow.start}
                    />
                  );
                })}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      {selection.size > 0 && (
        <FloatingActionBar
          count={selection.size}
          onDeactivate={handleDeactivate}
          onDelete={() => setShowDeleteModal(true)}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          count={selection.size}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {drawerOpen && <FieldDrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  );
}
