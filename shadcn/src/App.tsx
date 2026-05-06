import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "@/features/theme-toggle";
import { LoginPage } from "@/pages/login";
import { LedgerPage } from "@/pages/ledger";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-lg font-semibold">Schema Architect</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {token && (
            <button
              type="button"
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <LedgerPage />
              </AuthGuard>
            }
          />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}
