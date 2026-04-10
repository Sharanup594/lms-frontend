'use client'

import { useState } from 'react'
import { Sidebar, type NavItem } from './Sidebar'
import { Topbar } from './Topbar'

interface ShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  userName: string
  userRole: string
  onLogout: () => void
}

export function Shell({ children, navItems, userName, userRole, onLogout }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-surface-secondary">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} items={navItems} onLogout={onLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} userName={userName} userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
