'use client'

import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { MY_COURSES_QUERY, ACHIEVEMENTS_QUERY, DASHBOARD_STATS_QUERY } from '@/lib/graphql/queries'
import Link from 'next/link'

const achievementBgColors = [
  'bg-gradient-to-br from-amber-100 to-amber-50',
  'bg-gradient-to-br from-violet-100 to-violet-50',
  'bg-gradient-to-br from-rose-100 to-rose-50',
  'bg-gradient-to-br from-emerald-100 to-emerald-50',
  'bg-gradient-to-br from-sky-100 to-sky-50',
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: coursesData, loading: coursesLoading } = useQuery<any>(MY_COURSES_QUERY)
  const { data: achievementsData, loading: achievementsLoading } = useQuery<any>(ACHIEVEMENTS_QUERY)
  const { data: statsData } = useQuery<any>(DASHBOARD_STATS_QUERY)

  const courses = coursesData?.myCourses ?? []
  const achievements = achievementsData?.achievements ?? []
  const stats = statsData?.myDashboardStats
  const enrolled = courses.filter((c: { progress: number }) => c.progress > 0 || true)
  const loading = coursesLoading || achievementsLoading

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      <PageHeader title="My Profile" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card padding="none" className="overflow-hidden">
            <div className="relative h-28 bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-600">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
              <div className="absolute right-12 bottom-2 h-12 w-12 rounded-full bg-white/10" />
            </div>
            <div className="relative px-6 pb-6">
              <div className="-mt-10 mb-3">
                <div className="inline-block rounded-full ring-4 ring-white">
                  <Avatar name={user?.name ?? ''} size="xl" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-neutral-900">{user?.name}</h2>
              <p className="text-sm text-neutral-500">{user?.email}</p>
              <Badge variant="primary" className="mt-2 capitalize">{user?.role?.toLowerCase()}</Badge>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{stats?.coursesEnrolled ?? 0}</p>
                  <p className="text-xs text-neutral-500">Enrolled</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{stats?.coursesCompleted ?? 0}</p>
                  <p className="text-xs text-neutral-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{stats?.hoursLearned ?? 0}h</p>
                  <p className="text-xs text-neutral-500">Learned</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Personal Information</h3>
            <dl className="space-y-4">
              {[
                { label: 'Full Name', value: user?.name ?? '' },
                { label: 'Email', value: user?.email ?? '' },
                { label: 'Role', value: user?.role?.toLowerCase() ?? '' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium text-neutral-500">{item.label}</dt>
                  <dd className="mt-0.5 text-sm text-neutral-900 capitalize">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Achievements</h3>
            {loading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((a: { id: string; title: string; description: string; icon: string }, i: number) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${achievementBgColors[i % achievementBgColors.length]}`}>{a.icon}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{a.title}</p>
                      <p className="text-xs text-neutral-500">{a.description}</p>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && <p className="text-sm text-neutral-500 col-span-full">No achievements yet</p>}
              </div>
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Enrolled Courses</h3>
              <Link href="/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {enrolled.map((course: { id: string; title: string; instructor: { name: string }; progress: number }) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="flex items-center gap-4 rounded-xl border border-neutral-100 p-3 hover:bg-primary-50/30 hover:border-primary-100 transition-all duration-200">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{course.title}</p>
                    <p className="text-xs text-neutral-500">{course.instructor?.name}</p>
                  </div>
                  <div className="w-28 shrink-0">
                    <ProgressBar value={course.progress} size="sm" color={course.progress === 100 ? 'success' : 'primary'} />
                    <p className="mt-1 text-right text-xs font-medium text-neutral-600">{course.progress}%</p>
                  </div>
                </Link>
              ))}
              {enrolled.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No enrolled courses</p>}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
