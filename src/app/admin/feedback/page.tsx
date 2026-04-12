'use client'

import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ALL_FEEDBACKS_QUERY } from '@/lib/graphql/queries'

export default function AdminFeedbackPage() {
  const { data, loading } = useQuery<any>(ALL_FEEDBACKS_QUERY)
  const feedbacks = data?.allFeedbacks ?? []

  const avgRating = feedbacks.length > 0 ? (feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : '0'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Feedback</span>
      </nav>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Student Feedback</h1>
          <p className="mt-1 text-sm text-neutral-500">{feedbacks.length} response{feedbacks.length !== 1 ? 's' : ''} • Average rating: {avgRating}/5</p>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : feedbacks.length === 0 ? (
        <Card className="text-center py-12"><p className="text-neutral-500">No feedback received yet.</p></Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((f: any) => (
            <Card key={f.id}>
              <div className="flex items-start gap-4">
                <Avatar name={f.userName ?? 'User'} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-neutral-900">{f.userName}</span>
                    <span className="text-warning-500 text-sm">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                    <Badge>{f.category}</Badge>
                    <span className="text-xs text-neutral-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-neutral-700">{f.comment}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
