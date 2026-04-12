'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { StudentShell } from '@/components/layout/StudentShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { MY_PROJECTS_QUERY } from '@/lib/graphql/queries'
import { SUBMIT_PROJECT_MUTATION } from '@/lib/graphql/mutations'

const complexityColor: Record<string, string> = { SIMPLE: 'success', MEDIUM: 'warning', COMPLEX: 'danger' }
const statusLabel: Record<string, string> = { NOT_STARTED: 'Not Started', IN_PROGRESS: 'In Progress', SUBMITTED: 'Submitted', REVIEWED: 'Reviewed', COMPLETED: 'Completed' }
const statusColor: Record<string, string> = { NOT_STARTED: 'default', IN_PROGRESS: 'primary', SUBMITTED: 'warning', REVIEWED: 'success', COMPLETED: 'success' }

export default function ProjectsPage() {
  const { data, loading, refetch } = useQuery<any>(MY_PROJECTS_QUERY)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submitProject, { loading: submitting }] = useMutation<any>(SUBMIT_PROJECT_MUTATION)
  const [submitModal, setSubmitModal] = useState<string | null>(null)
  const [url, setUrl] = useState('')

  const projects = data?.myProjects ?? []

  async function handleSubmit() {
    if (!submitModal || !url) return
    await submitProject({ variables: { projectId: submitModal, submissionUrl: url } })
    setSubmitModal(null)
    setUrl('')
    refetch()
  }

  return (
    <StudentShell>
      <div className="space-y-6 animate-fade-in-up">
        <PageHeader title="My Projects" description="Track your project assignments and submissions" />

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
        ) : projects.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-4xl mb-3">📂</p>
            <h3 className="font-semibold text-neutral-900">No projects assigned yet</h3>
            <p className="text-sm text-neutral-500 mt-1">Projects will appear here once assigned by your instructor</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((a: any) => (
              <Card key={a.id} hover>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={complexityColor[a.project.complexity] as any}>{a.project.complexity}</Badge>
                      <Badge>Month {a.project.month}</Badge>
                      <Badge variant={statusColor[a.status] as any}>{statusLabel[a.status] ?? a.status}</Badge>
                    </div>
                    <h3 className="font-semibold text-neutral-900">{a.project.title}</h3>
                    {a.project.description && <p className="text-sm text-neutral-500 mt-0.5">{a.project.description}</p>}
                    {a.score !== null && a.score !== undefined && (
                      <div className="mt-2">
                        <ProgressBar value={a.score} size="sm" color={a.score >= 70 ? 'success' : 'warning'} showLabel />
                      </div>
                    )}
                    {a.feedback && <p className="mt-2 text-sm text-neutral-600 italic">&ldquo;{a.feedback}&rdquo;</p>}
                  </div>
                  {(a.status === 'NOT_STARTED' || a.status === 'IN_PROGRESS') && (
                    <Button size="sm" onClick={() => setSubmitModal(a.project.id)}>Submit Project</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal open={!!submitModal} onClose={() => setSubmitModal(null)} title="Submit Project">
          <div className="space-y-4">
            <Input label="Submission URL" placeholder="https://github.com/your-repo" value={url} onChange={(e) => setUrl(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSubmitModal(null)}>Cancel</Button>
              <Button onClick={handleSubmit} loading={submitting} disabled={!url}>Submit</Button>
            </div>
          </div>
        </Modal>
      </div>
    </StudentShell>
  )
}
