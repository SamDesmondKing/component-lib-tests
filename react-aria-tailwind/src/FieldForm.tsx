import { useState, useCallback } from 'react'
import { TextField, Input, Label, Button, Select, SelectValue, Popover, ListBox, ListBoxItem, Checkbox } from 'react-aria-components'
import type { FieldSchema, FieldType, FieldStatus } from './types'

interface FieldFormProps {
  existingFields: FieldSchema[]
  onSave: (field: FieldSchema) => void
}

const FIELD_TYPES: FieldType[] = ['text', 'number', 'boolean', 'date', 'select']
const STATUSES: FieldStatus[] = ['active', 'inactive']

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function createDefaultField(): FieldSchema {
  return {
    id: crypto.randomUUID(),
    label: '',
    name: '',
    type: 'text',
    validation: { required: false },
    config: { placeholder: '', defaultValue: '', options: [] },
    logic: {},
    status: 'active',
    usageCount: 0,
  }
}

export function FieldForm({ existingFields: _existingFields, onSave }: FieldFormProps) {
  const [field, setField] = useState<FieldSchema>(createDefaultField)
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false)

  const updateField = useCallback(<K extends keyof FieldSchema>(key: K, value: FieldSchema[K]) => {
    setField(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleLabelChange = (value: string) => {
    updateField('label', value)
    if (!nameManuallyEdited) {
      updateField('name', slugify(value))
    }
  }

  const handleNameChange = (value: string) => {
    setNameManuallyEdited(true)
    updateField('name', value)
  }

  const handleTypeChange = (key: React.Key | null) => {
    if (key == null) return
    const type = key as FieldType
    setField(prev => ({
      ...prev,
      type,
      config: { ...prev.config, options: type === 'select' ? ['Option A', 'Option B'] : [] },
      min: undefined,
      max: undefined,
      decimalPlaces: undefined,
      maxLength: undefined,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(field)
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  const labelClass = "text-sm font-medium text-gray-700"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Label */}
      <TextField value={field.label} onChange={handleLabelChange} className="flex flex-col gap-1">
        <Label className={labelClass}>Label</Label>
        <Input className={inputClass} placeholder="Field label" />
      </TextField>

      {/* Name (slug) */}
      <TextField value={field.name} onChange={handleNameChange} className="flex flex-col gap-1">
        <Label className={labelClass}>Name (slug)</Label>
        <Input className={inputClass + ' font-mono text-xs'} placeholder="field_name" />
      </TextField>

      {/* Type */}
      <Select
        selectedKey={field.type}
        onSelectionChange={handleTypeChange}
        className="flex flex-col gap-1"
      >
        <Label className={labelClass}>Type</Label>
        <Button className={inputClass + ' flex items-center justify-between text-left'}>
          <SelectValue />
          <span>▾</span>
        </Button>
        <Popover className="w-(--trigger-width) rounded-lg border border-gray-200 bg-white shadow-lg">
          <ListBox className="p-1">
            {FIELD_TYPES.map(t => (
              <ListBoxItem key={t} id={t} className="cursor-pointer rounded px-3 py-1.5 text-sm capitalize hover:bg-blue-50 data-[focused]:bg-blue-50">
                {t}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      {/* Status */}
      <Select
        selectedKey={field.status}
        onSelectionChange={key => { if (key != null) updateField('status', key as FieldStatus) }}
        className="flex flex-col gap-1"
      >
        <Label className={labelClass}>Status</Label>
        <Button className={inputClass + ' flex items-center justify-between text-left'}>
          <SelectValue />
          <span>▾</span>
        </Button>
        <Popover className="w-(--trigger-width) rounded-lg border border-gray-200 bg-white shadow-lg">
          <ListBox className="p-1">
            {STATUSES.map(s => (
              <ListBoxItem key={s} id={s} className="cursor-pointer rounded px-3 py-1.5 text-sm capitalize hover:bg-blue-50 data-[focused]:bg-blue-50">
                {s}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      {/* Placeholder */}
      <TextField
        value={field.config.placeholder}
        onChange={v => setField(prev => ({ ...prev, config: { ...prev.config, placeholder: v } }))}
        className="flex flex-col gap-1"
      >
        <Label className={labelClass}>Placeholder</Label>
        <Input className={inputClass} placeholder="Placeholder text" />
      </TextField>

      {/* Default Value */}
      <TextField
        value={String(field.config.defaultValue ?? '')}
        onChange={v => setField(prev => ({ ...prev, config: { ...prev.config, defaultValue: v } }))}
        className="flex flex-col gap-1"
      >
        <Label className={labelClass}>Default Value</Label>
        <Input className={inputClass} placeholder="Default value" />
      </TextField>

      {/* Required */}
      <Checkbox
        isSelected={field.validation.required}
        onChange={v => setField(prev => ({ ...prev, validation: { ...prev.validation, required: v } }))}
        className="flex items-center gap-2"
      >
        <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-400 bg-white text-[10px] text-white data-[selected]:bg-blue-600 data-[selected]:border-blue-600">
          ✓
        </div>
        <span className="text-sm text-gray-700">Required</span>
      </Checkbox>

      {/* ── Type-specific fields placeholder ── */}
      {/* [manual] TASK-5: Conditional Configuration — implement type-specific fields here */}
      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <p className="text-xs text-gray-400">
          Type-specific fields for "{field.type}" go here. (Manual implementation — TASK-5)
        </p>
      </div>

      {/* ── Visibility Rule placeholder ── */}
      {/* [manual] TASK-7: Nested Rule Builder — implement visibility rules here */}
      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <p className="text-xs text-gray-400">
          Visibility Rule section goes here. (Manual implementation — TASK-7)
        </p>
      </div>

      <Button
        type="submit"
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save Field
      </Button>
    </form>
  )
}
