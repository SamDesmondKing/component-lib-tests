import { LedgerPage } from "./pages/LedgerPage";
import { LoginPage } from "./pages/LoginPage";
import { useAppStore } from "./store";

export function App() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return isAuthenticated ? <LedgerPage /> : <LoginPage />;
}
