'use client'

import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { COURSES_QUERY } from '@/lib/graphql/queries'

export default function AdminAssessmentsPage() {
  const { data, loading } = useQuery<any>(COURSES_QUERY, { variables: { page: 1, pageSize: 50 } })
  const courses = data?.courses?.courses ?? []

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Assessments</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Manage Assessments</h1>
        <p className="mt-1 text-sm text-neutral-500">View and manage assessments across all courses</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course: { id: string; title: string; category: string; level: string }) => (
            <Link key={course.id} href={`/admin/assessments/${course.id}`}>
              <Card hover className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900">{course.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="primary">{course.category}</Badge>
                    <Badge>{course.level}</Badge>
                  </div>
                </div>
                <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
