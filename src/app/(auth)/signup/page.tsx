'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { level: 25, label: 'Weak', color: 'bg-danger-500' }
  if (score === 2) return { level: 50, label: 'Fair', color: 'bg-warning-500' }
  if (score === 3) return { level: 75, label: 'Good', color: 'bg-primary-500' }
  return { level: 100, label: 'Strong', color: 'bg-success-500' }
}

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()

  const strength = getPasswordStrength(form.password)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required'
    if (!form.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const error = await signup(form.name, form.email, form.password)
    if (error) {
      setErrors({ general: error })
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-surface-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold text-xl shadow-lg shadow-primary-600/30">
            VA
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Create an account</h1>
          <p className="mt-1 text-sm text-neutral-500">Start your learning journey today</p>
        </div>

        <div className="rounded-2xl bg-white border border-neutral-200/80 p-8 shadow-lg shadow-neutral-900/5">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input label="Full name" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
            <Input label="Email address" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
            <div>
              <Input label="Password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-300', strength.color)} style={{ width: `${strength.level}%` }} />
                    </div>
                    <span className={cn('text-xs font-medium', strength.level <= 25 ? 'text-danger-600' : strength.level <= 50 ? 'text-warning-600' : strength.level <= 75 ? 'text-primary-600' : 'text-success-600')}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Input label="Confirm password" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
