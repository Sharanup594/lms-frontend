'use client'

import { use } from 'react'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { generateCertificate } from '@/lib/certificate'
import { COURSE_QUERY } from '@/lib/graphql/queries'

interface Props {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: Props) {
  const { id } = use(params)
  const { user } = useAuth()
  const { data, loading } = useQuery<any>(COURSE_QUERY, { variables: { id } })
  const course = data?.course

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!course) return notFound()

  const totalLessons = course.modules.reduce((acc: number, m: { lessons: unknown[] }) => acc + m.lessons.length, 0)
  const completedLessons = course.modules.reduce((acc: number, m: { lessons: { completed: boolean }[] }) => acc + m.lessons.filter((l) => l.completed).length, 0)
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const levelVariant = { Beginner: 'success' as const, Intermediate: 'warning' as const, Advanced: 'danger' as const, BEGINNER: 'success' as const, INTERMEDIATE: 'warning' as const, ADVANCED: 'danger' as const }
  const levelDisplay: Record<string, string> = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-neutral-900 font-medium truncate">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={levelVariant[course.level as keyof typeof levelVariant] ?? 'default'}>{levelDisplay[course.level] ?? course.level}</Badge>
              <Badge>{course.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">{course.title}</h1>
            <p className="mt-3 text-neutral-600 leading-relaxed">{course.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                {course.enrolled?.toLocaleString() ?? 0} enrolled
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {course.rating}
              </span>
              <span>{course.modules.length} modules &middot; {totalLessons} lessons</span>
            </div>
          </Card>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Course Content</h2>
            <div className="space-y-3">
              {course.modules.map((mod: { id: string; title: string; duration: string; lessons: { id: string; title: string; type: string; duration: string; completed: boolean }[] }, modIndex: number) => (
                <Card key={mod.id} padding="none">
                  <div className="border-b border-neutral-100 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-900">Module {modIndex + 1}: {mod.title}</h3>
                      <span className="text-sm text-neutral-500">{mod.duration}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">{mod.lessons.filter((l) => l.completed).length}/{mod.lessons.length} lessons completed</p>
                  </div>
                  <ul className="divide-y divide-neutral-50">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                        {lesson.completed ? (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-500 text-white">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-neutral-300" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${lesson.completed ? 'text-neutral-500 line-through' : 'text-neutral-700'}`}>{lesson.title}</p>
                        </div>
                        <span className="text-xs text-neutral-400">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            {progress > 0 && (
              <div className="mb-4">
                <ProgressBar value={progress} showLabel />
                <p className="mt-2 text-sm text-neutral-500">{completedLessons} of {totalLessons} lessons completed</p>
              </div>
            )}
            <Link href={`/learning/${course.id}`}>
              <Button className="w-full" size="lg">
                {progress === 0 && 'Start Course'}
                {progress > 0 && progress < 100 && 'Continue Learning'}
                {progress === 100 && 'Review Course'}
              </Button>
            </Link>

            {progress === 100 && (
              <button
                onClick={() => generateCertificate({
                  studentName: user?.name ?? 'Student',
                  courseName: course.title,
                  instructorName: course.instructor?.name ?? 'Instructor',
                  completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                  certificateId: `LH-${course.id.toUpperCase()}-${user?.id?.slice(-6)?.toUpperCase() ?? '000000'}`,
                })}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm font-semibold text-success-700 hover:bg-success-100 transition-colors cursor-pointer border border-success-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Certificate
              </button>
            )}
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Instructor</h3>
            <div className="flex items-center gap-3">
              <Avatar name={course.instructor?.name ?? ''} size="lg" />
              <div>
                <p className="font-semibold text-neutral-900">{course.instructor?.name}</p>
                <p className="text-sm text-neutral-500">Course Instructor</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Course Info</h3>
            <dl className="space-y-3">
              {[
                { label: 'Level', value: levelDisplay[course.level] ?? course.level },
                { label: 'Duration', value: course.duration },
                { label: 'Modules', value: `${course.modules.length} modules` },
                { label: 'Lessons', value: `${totalLessons} lessons` },
                { label: 'Enrolled', value: course.enrolled?.toLocaleString() ?? '0' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <dt className="text-neutral-500">{item.label}</dt>
                  <dd className="font-medium text-neutral-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  )
}
