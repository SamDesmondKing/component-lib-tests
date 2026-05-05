import { ActionIcon, useMantineColorScheme } from "@mantine/core";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="default"
      onClick={toggleColorScheme}
      aria-label="Toggle color scheme"
    >
      {isDark ? "☀️" : "🌙"}
    </ActionIcon>
  );
}
