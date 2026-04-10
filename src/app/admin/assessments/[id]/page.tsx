'use client'

import { use } from 'react'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { COURSE_ASSESSMENTS_QUERY, COURSE_QUERY } from '@/lib/graphql/queries'

interface Props { params: Promise<{ id: string }> }

export default function AdminCourseAssessmentsPage({ params }: Props) {
  const { id } = use(params)
  const { data: courseData } = useQuery<any>(COURSE_QUERY, { variables: { id } })
  const { data, loading } = useQuery<any>(COURSE_ASSESSMENTS_QUERY, { variables: { courseId: id } })

  const course = courseData?.course
  const assessments = data?.courseAssessments ?? []

  const typeLabel = { PRE_COURSE: 'Pre-Course', IN_COURSE: 'In-Course', POST_COURSE: 'Post-Course' }
  const typeColor = { PRE_COURSE: 'primary' as const, IN_COURSE: 'warning' as const, POST_COURSE: 'success' as const }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <Link href="/admin/assessments" className="hover:text-primary-600 transition-colors">Assessments</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium truncate">{course?.title ?? 'Course'}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{course?.title ?? 'Course'} — Assessments</h1>
        <p className="mt-1 text-sm text-neutral-500">{assessments.length} assessment{assessments.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : assessments.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-neutral-500">No assessments for this course yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {assessments.map((a: { id: string; title: string; description: string; type: string; passingScore: number; totalPoints: number; timeLimit?: number; myAttempt?: { score: number; totalPoints: number; passed: boolean } }) => (
            <Card key={a.id} hover>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={typeColor[a.type as keyof typeof typeColor] ?? 'default'}>
                      {typeLabel[a.type as keyof typeof typeLabel] ?? a.type}
                    </Badge>
                    {a.timeLimit && <Badge>⏱ {a.timeLimit} min</Badge>}
                  </div>
                  <h3 className="font-semibold text-neutral-900">{a.title}</h3>
                  {a.description && <p className="text-sm text-neutral-500 mt-0.5">{a.description}</p>}
                  <p className="text-xs text-neutral-400 mt-2">Passing: {a.passingScore}% • Total: {a.totalPoints} points</p>
                </div>
                {a.myAttempt && (
                  <Badge variant={a.myAttempt.passed ? 'success' : 'danger'}>
                    {a.myAttempt.score}/{a.myAttempt.totalPoints}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
