'use client'

import { useState, useEffect, use } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ASSESSMENT_QUERY } from '@/lib/graphql/queries'
import { SUBMIT_ASSESSMENT_MUTATION } from '@/lib/graphql/mutations'

interface Props { params: Promise<{ id: string }> }

export default function AssessmentPlayerPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { data, loading } = useQuery<any>(ASSESSMENT_QUERY, { variables: { id } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submitMutation, { loading: submitting }] = useMutation<any>(SUBMIT_ASSESSMENT_MUTATION)

  const assessment = data?.assessment
  const questions = assessment?.questions ?? []
  const alreadyDone = !!assessment?.myAttempt

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  // Initialize answers array when questions load
  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      setAnswers(new Array(questions.length).fill(null))
    }
  }, [questions.length, answers.length])

  // Timer
  useEffect(() => {
    if (!assessment?.timeLimit || alreadyDone) return
    setTimeLeft(assessment.timeLimit * 60)
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [assessment?.timeLimit, alreadyDone])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !alreadyDone) handleSubmit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  function selectAnswer(optionIndex: number) {
    const updated = [...answers]
    updated[currentQ] = optionIndex
    setAnswers(updated)
  }

  async function handleSubmit() {
    const finalAnswers = answers.map((a) => a ?? -1)
    try {
      const { data: result } = await submitMutation({ variables: { assessmentId: id, answers: finalAnswers } })
      if (result?.submitAssessment) {
        router.push(`/assessments/${id}/result`)
      }
    } catch (err) {
      console.error('Submit failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <Skeleton className="h-96 w-full max-w-2xl rounded-2xl" />
      </div>
    )
  }

  // Already completed — show result link
  if (alreadyDone) {
    const attempt = assessment.myAttempt
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${attempt.passed ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
            <span className="text-2xl">{attempt.passed ? '✓' : '✗'}</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Assessment Completed</h2>
          <p className="mt-2 text-neutral-500">You scored {attempt.score}/{attempt.totalPoints}</p>
          <Badge variant={attempt.passed ? 'success' : 'danger'} className="mt-2">{attempt.passed ? 'Passed' : 'Failed'}</Badge>
          <Button className="mt-6 w-full" onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  const question = questions[currentQ]
  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === questions.length

  return (
    <div className="min-h-screen bg-surface-secondary p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-neutral-900">{assessment.title}</h1>
            {timeLeft !== null && (
              <Badge variant={timeLeft < 60 ? 'danger' : 'default'}>
                ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </Badge>
            )}
          </div>
          <ProgressBar value={Math.round((answeredCount / questions.length) * 100)} size="sm" />
          <p className="mt-1 text-xs text-neutral-500">Question {currentQ + 1} of {questions.length} • {answeredCount} answered</p>
        </div>

        {/* Question */}
        {question && (
          <Card className="mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{question.points} pt{question.points > 1 ? 's' : ''}</Badge>
              <Badge>{question.type === 'TRUE_FALSE' ? 'True/False' : 'Multiple Choice'}</Badge>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option: string, i: number) => {
                const selected = answers[currentQ] === i
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border mr-3 text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                )
              })}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
            ← Previous
          </Button>
          <div className="flex gap-1">
            {questions.map((_: unknown, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
                  i === currentQ ? 'bg-primary-600' : answers[i] !== null ? 'bg-primary-300' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
          {currentQ < questions.length - 1 ? (
            <Button onClick={() => setCurrentQ(currentQ + 1)}>
              Next →
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} disabled={!allAnswered}>
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
