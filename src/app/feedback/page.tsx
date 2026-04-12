'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { StudentShell } from '@/components/layout/StudentShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { MY_FEEDBACKS_QUERY } from '@/lib/graphql/queries'
import { SUBMIT_FEEDBACK_MUTATION } from '@/lib/graphql/mutations'

export default function FeedbackPage() {
  const { data, loading, refetch } = useQuery<any>(MY_FEEDBACKS_QUERY)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submitFeedback, { loading: submitting }] = useMutation<any>(SUBMIT_FEEDBACK_MUTATION)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('general')
  const [submitted, setSubmitted] = useState(false)

  const feedbacks = data?.myFeedbacks ?? []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !comment) return
    await submitFeedback({ variables: { rating, comment, category } })
    setRating(0)
    setComment('')
    setSubmitted(true)
    refetch()
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <StudentShell>
      <div className="space-y-6 animate-fade-in-up">
        <PageHeader title="Feedback" description="Share your experience and help us improve" />

        {/* Submit feedback form */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Submit Feedback</h3>
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">✅</p>
              <p className="font-semibold text-success-700">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${star <= rating ? 'text-warning-500' : 'text-neutral-300'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                  <option value="general">General</option>
                  <option value="course-content">Course Content</option>
                  <option value="instructor">Instructor</option>
                  <option value="platform">Platform</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Feedback</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Tell us about your experience..." className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none" required />
              </div>
              <Button type="submit" loading={submitting} disabled={!rating || !comment}>Submit Feedback</Button>
            </form>
          )}
        </Card>

        {/* Past feedback */}
        {loading ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : feedbacks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Past Feedback</h3>
            <div className="space-y-3">
              {feedbacks.map((f: any) => (
                <Card key={f.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-warning-500">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                    <Badge>{f.category}</Badge>
                    <span className="text-xs text-neutral-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-neutral-700">{f.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  )
}
