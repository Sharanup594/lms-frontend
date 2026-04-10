'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { USERS_QUERY } from '@/lib/graphql/queries'
import type { User } from '@/types'

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, loading } = useQuery<any>(USERS_QUERY, {
    variables: { search: debouncedSearch || undefined, page: 1, pageSize: 50 },
  })

  const users = data?.users?.users ?? []
  const total = data?.users?.total ?? 0

  const roleVariant = { LEARNER: 'primary' as const, INSTRUCTOR: 'success' as const, ADMIN: 'warning' as const }

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="sm" />
          <div>
            <p className="font-medium text-neutral-900">{u.name}</p>
            <p className="text-xs text-neutral-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u: User) => <Badge variant={roleVariant[u.role as keyof typeof roleVariant] ?? 'default'} className="capitalize">{u.role.toLowerCase()}</Badge>,
    },
    {
      key: 'coursesEnrolled',
      header: 'Enrolled',
    },
    {
      key: 'coursesCompleted',
      header: 'Completed',
    },
    {
      key: 'totalHours',
      header: 'Hours',
      render: (u: User) => <span>{u.totalHours}h</span>,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (u: User) => <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>,
    },
  ]

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Users</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Manage Users</h1>
        <p className="mt-1 text-sm text-neutral-500">{total} total users</p>
      </div>

      <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} />

      {loading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <Card padding="none">
          <Table columns={columns} data={users} keyExtractor={(u: User) => u.id} />
        </Card>
      )}
    </motion.div>
  )
}
