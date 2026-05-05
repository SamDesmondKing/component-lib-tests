import { Button, Group, Modal, Paper, Portal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAppStore } from "../store";

interface Props {
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
}

export function BulkActionBar({ selected, setSelected }: Props) {
  const [confirmOpen, { open, close }] = useDisclosure(false);
  const deactivateFields = useAppStore((s) => s.deactivateFields);
  const deleteFields = useAppStore((s) => s.deleteFields);

  if (selected.size === 0) return null;

  const handleDeactivate = () => {
    deactivateFields(selected);
    setSelected(new Set());
  };

  const handleDelete = () => {
    deleteFields(selected);
    setSelected(new Set());
    close();
  };

  return (
    <>
      <Portal>
        <Paper
          shadow="lg"
          p="sm"
          withBorder
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
          }}
        >
          <Group>
            <Text size="sm" fw={500}>
              {selected.size} selected
            </Text>
            <Button size="xs" variant="light" onClick={handleDeactivate}>
              Deactivate
            </Button>
            <Button size="xs" color="red" onClick={open}>
              Delete
            </Button>
          </Group>
        </Paper>
      </Portal>

      <Modal
        opened={confirmOpen}
        onClose={close}
        title="Confirm Delete"
        centered
      >
        <Text mb="md">
          Are you sure you want to delete {selected.size} field(s)? This action
          cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
