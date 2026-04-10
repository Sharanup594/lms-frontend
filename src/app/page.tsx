'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { role, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (role === 'admin') {
      router.replace('/admin/dashboard')
    } else if (role === 'student') {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [role, isLoading, router])

  return (
    <div className="flex h-screen items-center justify-center bg-surface-secondary">
      <svg className="h-8 w-8 animate-spin text-primary-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}
