'use client'

import { useQuery } from '@apollo/client/react'
import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { MY_SKILL_ASSESSMENT_QUERY, COURSES_QUERY } from '@/lib/graphql/queries'
import { ENROLL_MUTATION } from '@/lib/graphql/mutations'

export default function RecommendationsPage() {
  const router = useRouter()
  const { data: saData, loading: saLoading } = useQuery<any>(MY_SKILL_ASSESSMENT_QUERY)
  const { data: coursesData, loading: coursesLoading } = useQuery<any>(COURSES_QUERY, { variables: { page: 1, pageSize: 50 } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [enrollMutation] = useMutation<any>(ENROLL_MUTATION)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [enrolled, setEnrolled] = useState<string[]>([])

  const sa = saData?.mySkillAssessment
  const allCourses = coursesData?.courses?.courses ?? []
  const recommended = sa?.recommendedCourseIds?.length
    ? allCourses.filter((c: { id: string }) => sa.recommendedCourseIds.includes(c.id))
    : allCourses.slice(0, 6)

  const loading = saLoading || coursesLoading

  async function handleEnroll(courseId: string) {
    setEnrolling(courseId)
    try {
      await enrollMutation({ variables: { courseId } })
      setEnrolled((prev) => [...prev, courseId])
    } catch (err) {
      console.error('Enroll failed:', err)
    }
    setEnrolling(null)
  }

  function goToDashboard() {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-secondary p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Score banner */}
        <Card className="mb-8 text-center bg-gradient-to-r from-primary-600 to-primary-800 text-white border-0">
          <h1 className="text-2xl font-bold">Your Employability Index</h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold">
              {sa?.score ?? 0}
            </div>
            <div className="text-left">
              <p className="text-primary-100">out of 100</p>
              <p className="text-sm text-primary-200 mt-1">
                {(sa?.score ?? 0) >= 70 ? 'Great foundation! Ready for advanced courses.' :
                 (sa?.score ?? 0) >= 40 ? 'Good start! We recommend intermediate courses.' :
                 'Welcome! Let\'s start with the fundamentals.'}
              </p>
            </div>
          </div>
          {sa?.interests?.length > 0 && (
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              {sa.interests.map((i: string) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/20 text-sm">{i}</span>
              ))}
            </div>
          )}
        </Card>

        {/* Recommended courses */}
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recommended Courses for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {recommended.map((course: { id: string; title: string; description: string; category: string; level: string; duration: string; rating: number }) => (
            <Card key={course.id} hover>
              <Badge variant="primary" className="mb-2">{course.category}</Badge>
              <h3 className="font-semibold text-neutral-900">{course.title}</h3>
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{course.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
                <span>{course.duration}</span>
                <span>★ {course.rating}</span>
              </div>
              <div className="mt-4">
                {enrolled.includes(course.id) ? (
                  <Button variant="secondary" size="sm" disabled className="w-full">✓ Enrolled</Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => handleEnroll(course.id)} loading={enrolling === course.id}>
                    Enroll Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={goToDashboard} size="lg">
            {enrolled.length > 0 ? 'Go to Dashboard →' : 'Skip & Go to Dashboard →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
