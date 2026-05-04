import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = useCallback(async (_email: string, _password: string) => {
		await new Promise((r) => setTimeout(r, 1000));
		if (_email && _password) {
			setIsAuthenticated(true);
			return true;
		}
		return false;
	}, []);

	const logout = useCallback(() => setIsAuthenticated(false), []);

	return (
		<AuthContext value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
