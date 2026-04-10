'use client'

import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ANALYTICS_QUERY, ADMIN_STATS_QUERY } from '@/lib/graphql/queries'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'

const COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#D97706', '#DC2626', '#0891B2']

export default function AdminAnalyticsPage() {
  const { data: analyticsData, loading: analyticsLoading } = useQuery<any>(ANALYTICS_QUERY)
  const { data: statsData, loading: statsLoading } = useQuery<any>(ADMIN_STATS_QUERY)

  const analytics = analyticsData?.analytics
  const stats = statsData?.adminStats
  const loading = analyticsLoading || statsLoading

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Analytics</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Platform Analytics</h1>
        <p className="mt-1 text-sm text-neutral-500">Insights into enrollments, assessments, and student performance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
        </div>
      ) : (
        <>
          {/* Quick stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats?.totalUsers ?? 0, color: 'text-primary-600' },
              { label: 'Total Courses', value: stats?.totalCourses ?? 0, color: 'text-purple-600' },
              { label: 'Enrollments', value: stats?.totalEnrollments ?? 0, color: 'text-success-600' },
              { label: 'Avg Completion', value: `${stats?.avgCompletion ?? 0}%`, color: 'text-warning-600' },
            ].map((s) => (
              <Card key={s.label} className="text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 1. Enrollment Trend */}
            <Card>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Enrollment Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics?.enrollmentTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#A3A3A3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#A3A3A3" allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '13px' }} />
                  <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} name="Enrollments" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* 2. Enrollments by Category (Pie) */}
            <Card>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Enrollments by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics?.enrollmentsByCategory ?? []}
                    cx="50%" cy="50%"
                    outerRadius={90}
                    dataKey="count"
                    nameKey="category"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={((props: any) => `${props.name ?? ''}: ${props.value ?? 0}`) as any}
                    labelLine={false}
                  >
                    {(analytics?.enrollmentsByCategory ?? []).map((_: unknown, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* 3. Assessment Score Distribution */}
            <Card>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Assessment Score Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics?.assessmentScoreDistribution ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#A3A3A3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#A3A3A3" allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '13px' }} />
                  <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* 4. EI Score Distribution */}
            <Card>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Employability Index Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics?.eiScoreDistribution ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#A3A3A3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#A3A3A3" allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '13px' }} />
                  <Bar dataKey="count" fill="#16A34A" radius={[6, 6, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* 5. Completion by Category (grouped bar) */}
            <Card>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Enrolled vs Completed by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={(analytics?.enrollmentsByCategory ?? []).map((e: { category: string; count: number }, i: number) => ({
                  category: e.category,
                  enrolled: e.count,
                  completed: (analytics?.completionByCategory ?? [])[i]?.count ?? 0,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#A3A3A3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#A3A3A3" allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '13px' }} />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#2563EB" radius={[6, 6, 0, 0]} name="Enrolled" />
                  <Bar dataKey="completed" fill="#16A34A" radius={[6, 6, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* 6. Top Courses */}
            <Card>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Top Courses</h3>
              <div className="space-y-4">
                {(analytics?.topCourses ?? []).map((c: { id: string; title: string; enrolled: number; avgProgress: number }, i: number) => (
                  <div key={c.id} className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{c.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="primary">{c.enrolled} enrolled</Badge>
                        <span className="text-xs text-neutral-500">Avg progress: {c.avgProgress}%</span>
                      </div>
                      <div className="mt-1.5">
                        <ProgressBar value={c.avgProgress} size="sm" color={c.avgProgress >= 70 ? 'success' : c.avgProgress >= 40 ? 'primary' : 'warning'} />
                      </div>
                    </div>
                  </div>
                ))}
                {(analytics?.topCourses ?? []).length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-4">No course data yet</p>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
