'use client'

import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { PROJECTS_QUERY } from '@/lib/graphql/queries'

const complexityColor: Record<string, string> = { SIMPLE: 'success', MEDIUM: 'warning', COMPLEX: 'danger' }

export default function AdminProjectsPage() {
  const { data, loading } = useQuery<any>(PROJECTS_QUERY)
  const projects = data?.projects ?? []

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Projects</span>
      </nav>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Manage Projects</h1>
        <p className="mt-1 text-sm text-neutral-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
      </div>
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12"><p className="text-neutral-500">No projects created yet.</p></Card>
      ) : (
        <div className="space-y-4">
          {projects.map((p: any) => (
            <Card key={p.id} hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={complexityColor[p.complexity] as any}>{p.complexity}</Badge>
                    <Badge>Month {p.month}</Badge>
                  </div>
                  <h3 className="font-semibold text-neutral-900">{p.title}</h3>
                  {p.description && <p className="text-sm text-neutral-500 mt-0.5">{p.description}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
