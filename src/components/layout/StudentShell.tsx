'use client'

import { Shell } from './Shell'
import { AuthGuard } from './AuthGuard'
import { studentNavItems } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <AuthGuard>
      <Shell
        navItems={studentNavItems}
        userName={user?.name ?? ''}
        userRole="Student"
        onLogout={logout}
      >
        {children}
      </Shell>
    </AuthGuard>
  )
}
