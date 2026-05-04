import { useState, useMemo, useRef, useCallback } from 'react'
import { Input, TextField, Label, Button, Checkbox, DialogTrigger } from 'react-aria-components'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { FieldSchema } from './types'
import { generateMockFields } from './mockData'
import { FloatingActionBar } from './FloatingActionBar'
import { ConfirmationModal } from './ConfirmationModal'
import { FieldDrawer } from './FieldDrawer'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SortKey = 'label' | 'name' | 'type' | 'status' | 'usageCount'
type SortDir = 'asc' | 'desc'

const ROW_HEIGHT = 40

export function FieldLedger() {
  const [fields, setFields] = useState<FieldSchema[]>(() => generateMockFields(1000))
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('label')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const filtered = useMemo(() => {
    const q = filter.toLowerCase()
    let result = fields
    if (q) {
      result = result.filter(f => f.label.toLowerCase().includes(q) || f.name.toLowerCase().includes(q))
    }
    result = [...result].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [fields, filter, sortKey, sortDir])

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(f => f.id)))
    }
  }

  const handleDeactivate = () => {
    setFields(prev => prev.map(f => selected.has(f.id) ? { ...f, status: 'inactive' as const } : f))
    setSelected(new Set())
  }

  const handleDelete = () => {
    setFields(prev => prev.filter(f => !selected.has(f.id)))
    setSelected(new Set())
    setDeleteModalOpen(false)
  }

  const handleAddField = (field: FieldSchema) => {
    setFields(prev => [field, ...prev])
    setDrawerOpen(false)
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFields(prev => {
        const oldIndex = prev.findIndex(f => f.id === active.id)
        const newIndex = prev.findIndex(f => f.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return prev
        const next = [...prev]
        const [moved] = next.splice(oldIndex, 1)
        next.splice(newIndex, 0, moved)
        return next
      })
    }
  }, [])

  const sortIndicator = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const columns: { key: SortKey; label: string; width: string }[] = [
    { key: 'label', label: 'Label', width: 'flex-[2]' },
    { key: 'name', label: 'Name', width: 'flex-1' },
    { key: 'type', label: 'Type', width: 'w-24' },
    { key: 'status', label: 'Status', width: 'w-24' },
    { key: 'usageCount', label: 'Usage', width: 'w-20' },
  ]

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-700 bg-gray-900 px-6 py-3">
        <h1 className="text-lg font-semibold text-gray-100">Field Ledger - Tailwind</h1>
        <div className="flex-1" />
        <TextField value={filter} onChange={setFilter} className="flex items-center gap-2" aria-label="Filter fields">
          <Label className="sr-only">Filter</Label>
          <Input
            placeholder="Search fields…"
            className="w-64 rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </TextField>
        <Button
          onPress={() => setDrawerOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
        >
          New Field
        </Button>
      </div>

      {/* Table */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-hidden px-6 py-4">
          {/* Table header */}
          <div className="flex items-center gap-2 rounded-t-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-400 uppercase">
            <div className="w-8" /> {/* drag handle spacer */}
            <Checkbox
              isSelected={filtered.length > 0 && selected.size === filtered.length}
              isIndeterminate={selected.size > 0 && selected.size < filtered.length}
              onChange={toggleSelectAll}
              className="mr-2 flex items-center"
              aria-label="Select all"
            >
              {({isSelected, isIndeterminate}) => (
                <div className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                  isSelected || isIndeterminate ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-500 bg-gray-700 text-transparent'
                }`}>
                  ✓
                </div>
              )}
            </Checkbox>
            {columns.map(col => (
              <button
                key={col.key}
                onClick={() => toggleSort(col.key)}
                className={`text-left hover:text-gray-200 ${col.width}`}
              >
                {col.label}{sortIndicator(col.key)}
              </button>
            ))}
          </div>

          {/* Virtualized rows */}
          <div
            ref={parentRef}
            className="overflow-auto border-x border-b border-gray-700 bg-gray-900"
            style={{ height: 'calc(100vh - 160px)' }}
          >
            <SortableContext items={filtered.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
                {virtualizer.getVirtualItems().map(virtualRow => {
                  const field = filtered[virtualRow.index]
                  return (
                    <SortableRow
                      key={field.id}
                      field={field}
                      isSelected={selected.has(field.id)}
                      onToggleSelect={toggleSelect}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      columns={columns}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </div>
        </div>
      </DndContext>

      {/* Floating action bar */}
      {selected.size > 0 && (
        <FloatingActionBar
          count={selected.size}
          onDeactivate={handleDeactivate}
          onDelete={() => setDeleteModalOpen(true)}
        />
      )}

      {/* Delete confirmation modal */}
      <DialogTrigger isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Button className="hidden">trigger</Button>
        <ConfirmationModal
          title="Delete Fields"
          message={`Are you sure you want to delete ${selected.size} field(s)? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </DialogTrigger>

      {/* Field drawer */}
      {drawerOpen && (
        <FieldDrawer
          existingFields={fields}
          onClose={() => setDrawerOpen(false)}
          onSave={handleAddField}
        />
      )}
    </div>
  )
}

function SortableRow({
  field,
  isSelected,
  onToggleSelect,
  style,
  columns,
}: {
  field: FieldSchema
  isSelected: boolean
  onToggleSelect: (id: string) => void
  style: React.CSSProperties
  columns: { key: string; width: string }[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const dndTransform = CSS.Transform.toString(transform)
  const combinedTransform = [style?.transform, dndTransform].filter(Boolean).join(' ')

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: combinedTransform || undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      className={`flex items-center gap-2 border-b border-gray-800 px-3 text-sm ${
        isSelected ? 'bg-blue-950' : 'hover:bg-gray-800'
      } ${isDragging ? 'shadow-lg' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="w-8 cursor-grab text-gray-500 hover:text-gray-300 active:cursor-grabbing"
        aria-label={`Reorder ${field.label}`}
      >
        ⠿
      </button>
      <Checkbox
        isSelected={isSelected}
        onChange={() => onToggleSelect(field.id)}
        className="mr-2 flex items-center"
        aria-label={`Select ${field.label}`}
      >
        {({isSelected: checked}) => (
          <div className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
            checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-500 bg-gray-700 text-transparent'
          }`}>
            ✓
          </div>
        )}
      </Checkbox>
      <span className={columns[0].width + ' truncate text-gray-200'}>{field.label}</span>
      <span className={columns[1].width + ' truncate text-gray-400 font-mono text-xs'}>{field.name}</span>
      <span className={columns[2].width + ' text-xs capitalize text-gray-300'}>{field.type}</span>
      <span className={columns[3].width}>
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
          field.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'
        }`}>
          {field.status}
        </span>
      </span>
      <span className={columns[4].width + ' text-xs text-gray-400 text-right'}>{field.usageCount}</span>
    </div>
  )
}
