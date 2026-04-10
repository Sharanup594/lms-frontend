'use client'

import { use } from 'react'
import { useQuery } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ASSESSMENT_QUERY } from '@/lib/graphql/queries'

interface Props { params: Promise<{ id: string }> }

export default function AssessmentResultPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { data, loading } = useQuery<any>(ASSESSMENT_QUERY, { variables: { id }, fetchPolicy: 'network-only' })

  const assessment = data?.assessment
  const attempt = assessment?.myAttempt

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <Skeleton className="h-64 w-full max-w-md rounded-2xl" />
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h2 className="text-xl font-bold text-neutral-900">No Result Found</h2>
          <p className="mt-2 text-neutral-500">You haven&apos;t taken this assessment yet.</p>
          <Button className="mt-4" onClick={() => router.push(`/assessments/${id}`)}>Take Assessment</Button>
        </Card>
      </div>
    )
  }

  const percentage = attempt.totalPoints > 0 ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center animate-fade-in-up">
        {/* Result icon */}
        <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${attempt.passed ? 'bg-success-50' : 'bg-danger-50'}`}>
          <span className={`text-5xl ${attempt.passed ? 'text-success-600' : 'text-danger-600'}`}>
            {attempt.passed ? '🎉' : '📚'}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900">
          {attempt.passed ? 'Congratulations!' : 'Keep Learning!'}
        </h1>
        <p className="mt-2 text-neutral-500">
          {attempt.passed
            ? `You passed the ${assessment.title} with ${percentage}%`
            : `You scored ${percentage}%. You need ${assessment.passingScore}% to pass.`
          }
        </p>

        {/* Score display */}
        <div className="mt-6 flex items-center justify-center gap-8">
          <div>
            <p className="text-4xl font-bold text-neutral-900">{attempt.score}</p>
            <p className="text-sm text-neutral-500">Your Score</p>
          </div>
          <div className="h-12 w-px bg-neutral-200" />
          <div>
            <p className="text-4xl font-bold text-neutral-400">{attempt.totalPoints}</p>
            <p className="text-sm text-neutral-500">Total Points</p>
          </div>
        </div>

        <div className="mt-4">
          <Badge variant={attempt.passed ? 'success' : 'danger'} size="md">
            {attempt.passed ? '✓ Passed' : '✗ Not Passed'} — {percentage}%
          </Badge>
        </div>

        <div className="mt-8 flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push(`/courses/${assessment.courseId}`)}>
            Back to Course
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
