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

  // Render children immediately — don't block LCP with a spinner.
  // The page's own skeleton/loading states handle data loading.
  // If auth fails, the useEffect above will redirect.
  if (!isLoading && !role) return null
  if (!isLoading && requireAdmin && role !== 'admin') return null

  return <>{children}</>
}
