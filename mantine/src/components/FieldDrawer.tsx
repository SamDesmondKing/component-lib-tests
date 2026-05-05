import {
  Button,
  Checkbox,
  Drawer,
  NativeSelect,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAppStore, type Field } from "../store";

interface Props {
  opened: boolean;
  onClose: () => void;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function FieldDrawer({ opened, onClose }: Props) {
  const addField = useAppStore((s) => s.addField);

  const form = useForm({
    initialValues: {
      label: "",
      type: "text" as Field["type"],
      status: "active" as Field["status"],
      required: false,
      placeholder: "",
    },
    validate: {
      label: (v) => (v.trim() ? null : "Label is required"),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const field: Field = {
      id: crypto.randomUUID(),
      label: values.label,
      name: slugify(values.label),
      type: values.type,
      validation: { required: values.required },
      config: { placeholder: values.placeholder || undefined },
      status: values.status,
      usageCount: 0,
    };
    addField(field);
    form.reset();
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
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Label"
            placeholder="e.g. First Name"
            required
            {...form.getInputProps("label")}
          />
          <TextInput
            label="Name (slug)"
            value={slugify(form.values.label)}
            disabled
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
          <Checkbox
            label="Required"
            {...form.getInputProps("required", { type: "checkbox" })}
          />
          <Button type="submit">Create Field</Button>
        </Stack>
      </form>
    </Drawer>
  );
}
