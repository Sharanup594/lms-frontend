'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { StudentShell } from '@/components/layout/StudentShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { MY_PLACEMENT_QUERY } from '@/lib/graphql/queries'
import { UPDATE_PLACEMENT_MUTATION } from '@/lib/graphql/mutations'

const statusOptions = ['SEEKING', 'INTERVIEWING', 'OFFERED', 'PLACED', 'NOT_INTERESTED']
const statusLabel: Record<string, string> = { SEEKING: 'Seeking', INTERVIEWING: 'Interviewing', OFFERED: 'Offered', PLACED: 'Placed', NOT_INTERESTED: 'Not Interested' }
const statusColor: Record<string, string> = { SEEKING: 'primary', INTERVIEWING: 'warning', OFFERED: 'success', PLACED: 'success', NOT_INTERESTED: 'default' }
const statusEmoji: Record<string, string> = { SEEKING: '🔍', INTERVIEWING: '💼', OFFERED: '🎉', PLACED: '✅', NOT_INTERESTED: '⏸️' }

export default function PlacementPage() {
  const { data, loading, refetch } = useQuery<any>(MY_PLACEMENT_QUERY)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [updatePlacement, { loading: updating }] = useMutation<any>(UPDATE_PLACEMENT_MUTATION)
  const placement = data?.myPlacement

  const [status, setStatus] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const [editing, setEditing] = useState(false)

  function startEdit() {
    setStatus(placement?.status ?? 'SEEKING')
    setCompany(placement?.company ?? '')
    setRole(placement?.role ?? '')
    setSalary(placement?.salary ?? '')
    setEditing(true)
  }

  async function handleSave() {
    await updatePlacement({ variables: { status: status || 'SEEKING', company, role, salary } })
    setEditing(false)
    refetch()
  }

  return (
    <StudentShell>
      <div className="space-y-6 animate-fade-in-up">
        <PageHeader title="Job Placement" description="Track your career journey and placement status" />

        {loading ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : !placement && !editing ? (
          <Card className="text-center py-12">
            <p className="text-4xl mb-3">🚀</p>
            <h3 className="font-semibold text-neutral-900">Start Your Career Journey</h3>
            <p className="text-sm text-neutral-500 mt-1 mb-4">Set up your placement profile to track your job search</p>
            <Button onClick={startEdit}>Set Up Placement Profile</Button>
          </Card>
        ) : editing ? (
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Update Placement Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${status === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600 hover:border-primary-300'}`}>
                      {statusEmoji[s]} {statusLabel[s]}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Company" placeholder="e.g. Google, TCS, Infosys" value={company} onChange={(e) => setCompany(e.target.value)} />
              <Input label="Role" placeholder="e.g. Software Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
              <Input label="Salary (optional)" placeholder="e.g. 8 LPA" value={salary} onChange={(e) => setSalary(e.target.value)} />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} loading={updating}>Save</Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Placement Status</h3>
              <Button variant="secondary" size="sm" onClick={startEdit}>Edit</Button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl">
                {statusEmoji[placement.status] ?? '📋'}
              </div>
              <div>
                <Badge variant={statusColor[placement.status] as any} size="md">{statusLabel[placement.status] ?? placement.status}</Badge>
                {placement.company && <p className="text-sm text-neutral-700 mt-1">{placement.company}{placement.role ? ` — ${placement.role}` : ''}</p>}
                {placement.salary && <p className="text-xs text-neutral-500">{placement.salary}</p>}
              </div>
            </div>
            {placement.placedAt && (
              <p className="text-sm text-success-600">🎉 Placed on {new Date(placement.placedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            )}
          </Card>
        )}
      </div>
    </StudentShell>
  )
}
