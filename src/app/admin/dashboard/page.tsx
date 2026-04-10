'use client'

import { useQuery } from '@apollo/client/react'
import { Card } from '@/components/ui/Card'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ADMIN_STATS_QUERY, USERS_QUERY } from '@/lib/graphql/queries'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { data: statsData, loading: statsLoading } = useQuery<any>(ADMIN_STATS_QUERY)
  const { data: usersData, loading: usersLoading } = useQuery<any>(USERS_QUERY, { variables: { page: 1, pageSize: 5 } })

  const stats = statsData?.adminStats
  const recentUsers = usersData?.users?.users ?? []
  const loading = statsLoading || usersLoading

  const roleVariant = { LEARNER: 'primary' as const, INSTRUCTOR: 'success' as const, ADMIN: 'warning' as const }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Overview of platform activity and management</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Courses" value={stats?.totalCourses ?? 0} change={{ value: 5, direction: 'up' }} color="bg-primary-50 text-primary-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} />
          <StatsCard title="Total Users" value={stats?.totalUsers ?? 0} change={{ value: 12, direction: 'up' }} color="bg-success-50 text-success-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} />
          <StatsCard title="Active Learners" value={stats?.totalEnrollments ?? 0} change={{ value: 8, direction: 'up' }} color="bg-warning-50 text-warning-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>} />
          <StatsCard title="Avg Completion" value={`${stats?.avgCompletion ?? 0}%`} color="bg-purple-50 text-purple-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/courses" className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 hover:bg-neutral-50 hover:border-neutral-200 transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-sm">Manage Courses</h3>
                <p className="text-xs text-neutral-500">{stats?.totalCourses ?? 0} courses available</p>
              </div>
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-4 rounded-xl border border-neutral-100 p-4 hover:bg-neutral-50 hover:border-neutral-200 transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-sm">Manage Users</h3>
                <p className="text-xs text-neutral-500">{stats?.totalUsers ?? 0} registered users</p>
              </div>
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Users</h2>
            <Link href="/admin/users" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">View all</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u: { id: string; name: string; email: string; role: string }) => (
              <div key={u.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-neutral-50 transition-colors">
                <Avatar name={u.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{u.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{u.email}</p>
                </div>
                <Badge variant={roleVariant[u.role as keyof typeof roleVariant] ?? 'default'} className="capitalize">{u.role.toLowerCase()}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
