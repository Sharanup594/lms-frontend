'use client'

import { useQuery } from '@apollo/client/react'
import { StudentShell } from '@/components/layout/StudentShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { CourseCard } from '@/components/course/CourseCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { MY_COURSES_QUERY } from '@/lib/graphql/queries'

export default function MyLearningPage() {
  const { data, loading } = useQuery<any>(MY_COURSES_QUERY)
  const courses = data?.myCourses ?? []

  const inProgress = courses.filter((c: { status: string }) => c.status === 'in-progress')
  const completed = courses.filter((c: { status: string }) => c.status === 'completed')
  const notStarted = courses.filter((c: { status: string }) => c.status === 'not-started')

  return (
    <StudentShell>
      <div className="space-y-8">
        <PageHeader title="My Learning" description="Track your enrolled courses and progress" />

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
          </div>
        ) : (
          <>
            {inProgress.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">In Progress ({inProgress.length})</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {inProgress.map((c: any) => <CourseCard key={c.id} course={c} />)}
                </div>
              </section>
            )}

            {notStarted.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Not Started ({notStarted.length})</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {notStarted.map((c: any) => <CourseCard key={c.id} course={c} />)}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">Completed ({completed.length})</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {completed.map((c: any) => <CourseCard key={c.id} course={c} />)}
                </div>
              </section>
            )}

            {courses.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-neutral-900">No courses yet</h3>
                <p className="mt-1 text-sm text-neutral-500">Browse the catalog to enroll in courses</p>
              </div>
            )}
          </>
        )}
      </div>
    </StudentShell>
  )
}
