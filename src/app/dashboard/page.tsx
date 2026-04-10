'use client'

import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { CourseCard } from '@/components/course/CourseCard'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { DASHBOARD_STATS_QUERY, MY_COURSES_QUERY } from '@/lib/graphql/queries'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: statsData, loading: statsLoading } = useQuery<any>(DASHBOARD_STATS_QUERY)
  const { data: coursesData, loading: coursesLoading } = useQuery<any>(MY_COURSES_QUERY)

  const stats = statsData?.myDashboardStats
  const courses = coursesData?.myCourses ?? []
  const inProgress = courses.filter((c: { status: string }) => c.status === 'in-progress')
  const recentCourses = courses.slice(0, 4)
  const loading = statsLoading || coursesLoading

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Welcome */}
      <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-6 text-white lg:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute right-16 top-20 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute -right-4 bottom-0 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute left-1/2 -bottom-12 h-48 w-48 rounded-full bg-primary-500/20" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-200">Good to see you again</p>
          <h1 className="mt-1 text-2xl font-bold lg:text-3xl">Welcome back, {user?.name?.split(' ')[0] ?? ''}!</h1>
          <p className="mt-2 text-primary-100 max-w-lg">
            You have {inProgress.length} courses in progress. Keep up the great work and continue your learning journey.
          </p>
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-lg shadow-primary-900/20 hover:bg-primary-50 transition-all duration-200 hover:shadow-xl"
          >
            Browse courses
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}><StatsCard title="Courses Enrolled" value={stats?.coursesEnrolled ?? 0} change={{ value: 12, direction: 'up' }} color="bg-primary-50 text-primary-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Completed" value={stats?.coursesCompleted ?? 0} change={{ value: 8, direction: 'up' }} color="bg-success-50 text-success-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Hours Learned" value={stats?.hoursLearned ?? 0} change={{ value: 15, direction: 'up' }} color="bg-warning-50 text-warning-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Certificates" value={stats?.certificates ?? 0} color="bg-purple-50 text-purple-600" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0" /></svg>} /></motion.div>
        </motion.div>
      )}

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Continue Learning</h2>
            <Link href="/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          <div className="space-y-3">
            {inProgress.map((course: { id: string; title: string; instructor: { name: string }; duration: string; progress: number }) => (
              <Link key={course.id} href={`/learning/${course.id}`}>
                <Card hover className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{course.title}</h3>
                    <p className="text-sm text-neutral-500">{course.instructor?.name} &middot; {course.duration}</p>
                  </div>
                  <div className="w-full sm:w-48">
                    <ProgressBar value={course.progress} size="sm" showLabel />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Courses */}
      {recentCourses.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Courses</h2>
            <Link href="/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recentCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
