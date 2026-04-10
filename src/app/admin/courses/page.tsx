'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Table } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { COURSES_QUERY } from '@/lib/graphql/queries'
import { CREATE_COURSE_MUTATION, DELETE_COURSE_MUTATION } from '@/lib/graphql/mutations'
import type { Course } from '@/types'

export default function AdminCoursesPage() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading, refetch } = useQuery<any>(COURSES_QUERY, {
    variables: { search: debouncedSearch || undefined, page: 1, pageSize: 100 },
  })
  const [createCourse, { loading: creating }] = useMutation(CREATE_COURSE_MUTATION)
  const [deleteCourse] = useMutation(DELETE_COURSE_MUTATION)

  const courses = data?.courses?.courses ?? []
  const total = data?.courses?.total ?? 0

  const columns = [
    {
      key: 'title',
      header: 'Course',
      render: (c: Course) => (
        <div>
          <p className="font-medium text-neutral-900">{c.title}</p>
          <p className="text-xs text-neutral-500">{c.category}</p>
        </div>
      ),
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (c: Course) => <span>{c.instructor?.name ?? ''}</span>,
    },
    {
      key: 'level',
      header: 'Level',
      render: (c: Course) => {
        const v = { BEGINNER: 'success' as const, INTERMEDIATE: 'warning' as const, ADVANCED: 'danger' as const, Beginner: 'success' as const, Intermediate: 'warning' as const, Advanced: 'danger' as const }
        const display: Record<string, string> = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' }
        return <Badge variant={v[c.level] ?? 'default'}>{display[c.level] ?? c.level}</Badge>
      },
    },
    {
      key: 'enrolled',
      header: 'Enrolled',
      render: (c: Course) => <span>{c.enrolled?.toLocaleString() ?? 0}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (c: Course) => (
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {c.rating}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (c: Course) => (
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors cursor-pointer" aria-label="Edit">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
          </button>
          <button onClick={async () => { if (confirm('Delete this course?')) { await deleteCourse({ variables: { id: c.id } }); refetch() } }} className="rounded-lg p-1.5 text-neutral-400 hover:bg-danger-50 hover:text-danger-600 transition-colors cursor-pointer" aria-label="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ]

  async function handleCreateCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await createCourse({
      variables: {
        input: {
          title: fd.get('title') as string,
          description: fd.get('description') as string,
          category: fd.get('category') as string,
          duration: fd.get('duration') as string,
          level: fd.get('level') as string,
        },
      },
    })
    setShowModal(false)
    refetch()
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-primary-600 transition-colors">Admin</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium">Courses</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Manage Courses</h1>
          <p className="mt-1 text-sm text-neutral-500">{total} total courses</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Course
        </Button>
      </div>

      <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} />

      {loading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <Card padding="none">
          <Table columns={columns} data={courses} keyExtractor={(c: Course) => c.id} />
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Course" size="lg">
        <form className="space-y-4" onSubmit={handleCreateCourse}>
          <Input label="Course Title" name="title" placeholder="e.g. Introduction to Machine Learning" required />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Category</label>
              <select name="category" className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                <option>Technology</option><option>Leadership</option><option>Management</option><option>Communication</option><option>Innovation</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Level</label>
              <select name="level" className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                <option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
          <Input label="Duration" name="duration" placeholder="e.g. 8h 30m" required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Description</label>
            <textarea name="description" rows={3} placeholder="Course description..." className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={creating}>Create Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
