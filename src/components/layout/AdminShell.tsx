'use client'

import { Shell } from './Shell'
import { AuthGuard } from './AuthGuard'
import { adminNavItems } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <AuthGuard requireAdmin>
      <Shell
        navItems={adminNavItems}
        userName={user?.name ?? 'Admin'}
        userRole="Administrator"
        onLogout={logout}
      >
        {children}
      </Shell>
    </AuthGuard>
  )
}
