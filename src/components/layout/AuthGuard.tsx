'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { role, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!role) {
      router.replace('/login')
      return
    }
    if (requireAdmin && role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [role, isLoading, requireAdmin, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-secondary">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-primary-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!role) return null
  if (requireAdmin && role !== 'admin') return null

  return <>{children}</>
}
