import { Button } from "react-aria-components";
import { useTheme } from "./useTheme";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	return (
		<Button
			onPress={toggleTheme}
			className="theme-toggle"
			aria-label="Toggle color scheme"
		>
			{theme === "dark" ? "☀️" : "🌙"}
		</Button>
	);
}
