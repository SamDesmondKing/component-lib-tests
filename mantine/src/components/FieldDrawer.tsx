import { useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Checkbox,
  Drawer,
  Group,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAppStore, type Field } from "../store";
import classes from "./FieldDrawer.module.css";

type FieldDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
};

export const FieldDrawer = ({ opened, onClose }: FieldDrawerProps) => {
  const addField = useAppStore((s) => s.addField);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const isNameManuallyEdited = useRef(false);

  const form = useForm({
    initialValues: {
      label: "",
      type: "text" as Field["type"],
      status: "active" as Field["status"],
      required: false,
      placeholder: "",
      name: "",
      min: undefined,
      max: undefined,
      decimalPlaces: undefined,
      pattern: "",
      maxLength: undefined,
    },
    validate: {
      label: (value) => (value.trim() ? null : "Label is required"),
    },
  });

  const addOption = () => {
    if (newOption.trim()) {
      setOptions((prev) => [...prev, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setOptions((prev) =>
      prev.filter((_, existingIndex) => existingIndex !== index),
    );
  };

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    const field: Field = {
      id: crypto.randomUUID(),
      label: values.label,
      name: values.name || slugify(values.label),
      type: values.type,
      validation: { required: values.required },
      config: {
        placeholder: values.placeholder || undefined,
        options: values.type === "select" ? options : undefined,
      },
      status: values.status,
      usageCount: 0,
      min: values.min && values.min,
      max: values.max && values.max,
      decimalPlaces: values.decimalPlaces && values.decimalPlaces,
      pattern: values.pattern && values.pattern,
      maxLength: values.maxLength && values.maxLength,
    };
    addField(field);
    form.reset();
    isNameManuallyEdited.current = false;
    setOptions([]);
    onClose();
  });

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={<Title order={4}>New Field</Title>}
      trapFocus
      closeOnEscape
      closeOnClickOutside
      withOverlay
    >
      <Group align="flex-start" gap="xl">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Label"
              placeholder="e.g. First Name"
              required
              {...form.getInputProps("label")}
              onChange={(e) => {
                form.getInputProps("label").onChange(e);
                if (!isNameManuallyEdited.current) {
                  form.setFieldValue("name", slugify(e.currentTarget.value));
                }
              }}
            />
            <TextInput
              label="Name (slug)"
              {...form.getInputProps("name")}
              onChange={(e) => {
                isNameManuallyEdited.current = true;
                form.getInputProps("name").onChange(e);
              }}
            />
            <NativeSelect
              label="Type"
              data={["text", "number", "boolean", "select"]}
              {...form.getInputProps("type")}
            />
            <NativeSelect
              label="Status"
              data={["active", "inactive"]}
              {...form.getInputProps("status")}
            />
            <TextInput
              label="Placeholder"
              placeholder="Optional placeholder text"
              {...form.getInputProps("placeholder")}
            />
            {form.values.type === "text" && (
              <>
                <TextInput
                  label="Pattern (regex)"
                  placeholder="e.g. ^[a-z]+$"
                  {...form.getInputProps("pattern")}
                />
                <TextInput
                  label="Max Length"
                  placeholder="Maximum character length"
                  type="number"
                  {...form.getInputProps("maxLength")}
                />
              </>
            )}
            {form.values.type === "number" && (
              <>
                <NumberInput
                  label="Min"
                  placeholder="Minimum value"
                  {...form.getInputProps("min")}
                />
                <NumberInput
                  label="Max"
                  placeholder="Maximum value"
                  {...form.getInputProps("max")}
                />
                <NumberInput
                  label="Decimal places"
                  placeholder="Decimal places"
                  {...form.getInputProps("decimalPlaces")}
                />
              </>
            )}
            {form.values.type === "select" && (
              <Stack gap="xs">
                <TextInput
                  label="Options"
                  placeholder="Add an option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.currentTarget.value)}
                  rightSection={
                    <ActionIcon
                      size="sm"
                      onClick={addOption}
                      aria-label="Add option"
                    >
                      +
                    </ActionIcon>
                  }
                />
                {options.map((opt, index) => (
                  <Group key={`${opt}`} gap="xs">
                    <TextInput value={opt} disabled style={{ flex: 1 }} />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeOption(index)}
                      aria-label={`Remove ${opt}`}
                    >
                      ×
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
            <Checkbox
              label="Required"
              {...form.getInputProps("required", { type: "checkbox" })}
            />
            <Button type="submit">Create Field</Button>
          </Stack>
        </form>
        <Stack className={classes.preview} gap="md">
          <span className={classes.previewLabel}>Preview</span>
          {form.values.type === "number" && (
            <NumberInput
              label={form.values.label || "Label"}
              placeholder={form.values.placeholder || "Placeholder"}
              min={form.values.min}
              max={form.values.max}
              decimalScale={form.values.decimalPlaces}
            />
          )}
        </Stack>
      </Group>
    </Drawer>
  );
};
