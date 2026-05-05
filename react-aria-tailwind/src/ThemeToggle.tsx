import { Button } from "react-aria-components";
import { useTheme } from "./useTheme";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	return (
		<Button
			onPress={toggleTheme}
			className="rounded-lg border border-gray-600 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 px-2 py-1 text-sm"
			aria-label="Toggle color scheme"
		>
			{theme === "dark" ? "☀️" : "🌙"}
		</Button>
	);
}
