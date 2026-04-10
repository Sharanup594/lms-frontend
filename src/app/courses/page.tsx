'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { CourseCard } from '@/components/course/CourseCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { COURSES_QUERY } from '@/lib/graphql/queries'
import { cn } from '@/lib/utils'

const categories = ['All', 'Leadership', 'Technology', 'Management', 'Communication', 'Innovation']

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLevel, setActiveLevel] = useState<string>('All')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const levelMap: Record<string, string> = { Beginner: 'BEGINNER', Intermediate: 'INTERMEDIATE', Advanced: 'ADVANCED' }

  const { data, loading } = useQuery<any>(COURSES_QUERY, {
    variables: {
      category: activeCategory === 'All' ? undefined : activeCategory,
      level: activeLevel === 'All' ? undefined : levelMap[activeLevel],
      search: debouncedSearch || undefined,
      page: 1,
      pageSize: 50,
    },
  })

  const filtered = data?.courses?.courses ?? []
  const total = data?.courses?.total ?? 0

  return (
    <div className="space-y-6">
      <PageHeader title="Course Catalog" description="Explore our full library of courses" />

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            placeholder="Search by course name or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn('rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer', activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50')}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button key={level} onClick={() => setActiveLevel(level)} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer', activeLevel === level ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}>
              {level}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-neutral-500">{total} course{total !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {filtered.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="mb-4 h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <h3 className="text-lg font-semibold text-neutral-900">No courses found</h3>
          <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
