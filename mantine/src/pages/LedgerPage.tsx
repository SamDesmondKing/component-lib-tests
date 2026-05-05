import { AppShell, Button, Group } from "@mantine/core";
import { useState } from "react";
import { BulkActionBar } from "../components/BulkActionBar";
import { FieldDrawer } from "../components/FieldDrawer";
import { FieldTable } from "../components/FieldTable";
import { SummaryBar } from "../components/SummaryBar";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAppStore } from "../store";

export function LedgerPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const logout = useAppStore((s) => s.logout);

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between">
          <Group>
            <strong>Schema Architect</strong>
          </Group>
          <Group>
            <ThemeToggle />
            <Button variant="subtle" size="xs" onClick={logout}>
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <SummaryBar />
        <Group mb="md" justify="flex-end">
          <Button onClick={() => setDrawerOpen(true)}>New Field</Button>
        </Group>
        <FieldTable selected={selected} setSelected={setSelected} />
        <BulkActionBar selected={selected} setSelected={setSelected} />
        <FieldDrawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </AppShell.Main>
    </AppShell>
  );
}
