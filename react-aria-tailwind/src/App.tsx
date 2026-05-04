import { AuthProvider, useAuth } from './AuthContext'
import { ToastProvider } from './Toast'
import { LoginPage } from './LoginPage'
import { FieldLedger } from './FieldLedger'

function AppContent() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <FieldLedger /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}
