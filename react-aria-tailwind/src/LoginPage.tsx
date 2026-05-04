import { useState } from 'react'
import { TextField, Input, Label, FieldError, Button, Form } from 'react-aria-components'
import { useAuth } from './AuthContext'
import { showToast } from './Toast'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        showToast('Welcome back', 'success')
      } else {
        showToast('Invalid credentials', 'error')
      }
    } catch {
      showToast('Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">Sign In</h1>
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            isRequired
            value={email}
            onChange={setEmail}
            type="email"
            className="flex flex-col gap-1"
          >
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
            />
            <FieldError className="text-xs text-red-600" />
          </TextField>

          <TextField
            isRequired
            value={password}
            onChange={setPassword}
            type={showPassword ? 'text' : 'password'}
            className="flex flex-col gap-1"
          >
            <Label className="text-sm font-medium text-gray-700">Password</Label>
            <div className="relative">
              <Input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <FieldError className="text-xs text-red-600" />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Form>
      </div>
    </div>
  )
}
