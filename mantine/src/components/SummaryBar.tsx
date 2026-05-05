import { Box, Group, Text } from "@mantine/core";
import { useAppStore } from "../store";
import classes from "./SummaryBar.module.css";

export function SummaryBar() {
  const fields = useAppStore((s) => s.fields);
  const activeCount = fields.filter((f) => f.status === "active").length;

  return (
    <Box className={classes.root} mb="md">
      <Group>
        <div className={classes.stat}>
          <Text className={classes.statLabel}>Total Fields</Text>
          <Text className={classes.statValue}>{fields.length}</Text>
        </div>
        <div className={classes.stat}>
          <Text className={classes.statLabel}>Active Fields</Text>
          <Text className={classes.statValue}>{activeCount}</Text>
        </div>
        <div className={classes.stat}>
          <Text className={classes.statLabel}>Inactive</Text>
          <Text className={classes.statValue}>
            {fields.length - activeCount}
          </Text>
        </div>
      </Group>
    </Box>
  );
}
