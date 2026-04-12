'use client'

import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Table } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { ALL_PLACEMENTS_QUERY } from '@/lib/graphql/queries'

const statusColor: Record<string, string> = { SEEKING: 'primary', INTERVIEWING: 'warning', OFFERED: 'success', PLACED: 'success', NOT_INTERESTED: 'default' }
const statusLabel: Record<string, string> = { SEEKING: 'Seeking', INTERVIEWING: 'Interviewing', OFFERED: 'Offered', PLACED: 'Placed', NOT_INTERESTED: 'Not Interested' }

export default function AdminPlacementsPage() {
  const { data, loading } = useQuery<any>(ALL_PLACEMENTS_QUERY)
  const placements = data?.allPlacements ?? []

  const placedCount = placements.filter((p: any) => p.status === 'PLACED').length

  const columns = [
    { key: 'user', header: 'Student', render: (p: any) => (
      <div className="flex items-center gap-2">
        <Avatar name={p.userName ?? 'User'} size="sm" />
        <span className="font-medium text-neutral-900">{p.userName}</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (p: any) => <Badge variant={statusColor[p.status] as any}>{statusLabel[p.status] ?? p.status}</Badge> },
    { key: 'company', header: 'Company', render: (p: any) => <span>{p.company || '-'}</span> },
    { key: 'role', header: 'Role', render: (p: any) => <span>{p.role || '-'}</span> },
    { key: 'salary', header: 'Salary', render: (p: any) => <span>{p.salary || '-'}</span> },
    { key: 'placedAt', header: 'Placed On', render: (p: any) => <span>{p.placedAt ? new Date(p.placedAt).toLocaleDateString() : '-'}</span> },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Placements</span>
      </nav>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Placement Tracking</h1>
        <p className="mt-1 text-sm text-neutral-500">{placements.length} student{placements.length !== 1 ? 's' : ''} • {placedCount} placed</p>
      </div>
      {loading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <Card padding="none">
          <Table columns={columns} data={placements} keyExtractor={(p: any) => p.id} />
        </Card>
      )}
    </div>
  )
}
