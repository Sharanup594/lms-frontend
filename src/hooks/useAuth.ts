'use client'

import { useAuthContext } from '@/providers/AuthProvider'

export type Role = 'admin' | 'student'

export function useAuth() {
  const { user, isLoading, login, logout, signup } = useAuthContext()

  const role: Role | null = user
    ? user.role === 'ADMIN' ? 'admin' : 'student'
    : null

  return { role, user, isLoading, login, logout, signup }
}
