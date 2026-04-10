'use client'

import { useState, useEffect, use } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'
import { COURSE_QUERY } from '@/lib/graphql/queries'
import { MARK_LESSON_COMPLETE_MUTATION } from '@/lib/graphql/mutations'

interface Props {
  params: Promise<{ id: string }>
}

export default function LearningPlayerPage({ params }: Props) {
  const { id } = use(params)
  const { data, loading: queryLoading } = useQuery<any>(COURSE_QUERY, { variables: { id } })
  const [markComplete] = useMutation(MARK_LESSON_COMPLETE_MUTATION)
  const course = data?.course

  const allLessons = course?.modules?.flatMap((m: { lessons: unknown[] }) => m.lessons) ?? []
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    if (course) {
      const lessons = course.modules.flatMap((m: { lessons: { completed: boolean }[] }) => m.lessons)
      const idx = lessons.findIndex((l: { completed: boolean }) => !l.completed)
      setActiveLessonIndex(idx >= 0 ? idx : 0)
    }
  }, [course])

  if (queryLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <svg className="h-8 w-8 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }
  if (!course) return notFound()

  const activeLesson = allLessons[activeLessonIndex] as { id: string; title: string; type: string; duration: string; completed: boolean } | undefined
  const totalLessons = allLessons.length
  const completedCount = allLessons.filter((l: { completed: boolean }) => l.completed).length
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  async function handleMarkComplete() {
    if (!activeLesson || activeLesson.completed || marking) return
    setMarking(true)
    try {
      await markComplete({
        variables: { lessonId: activeLesson.id },
        refetchQueries: [{ query: COURSE_QUERY, variables: { id } }],
      })
    } catch (err) {
      console.error('Failed to mark lesson complete:', err)
    }
    setMarking(false)
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-900">
      <header className="flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.id}`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white truncate max-w-xs lg:max-w-lg">{course.title}</h1>
            <p className="text-xs text-neutral-400">{completedCount}/{totalLessons} lessons completed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-48"><ProgressBar value={progress} size="sm" color="success" /></div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer" aria-label="Toggle sidebar">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center bg-neutral-950 bg-dot-pattern relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" /></div>
            {activeLesson && (
              <div className="relative text-center animate-fade-in-up">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 animate-glow cursor-pointer hover:scale-105 transition-transform duration-300">
                  {(activeLesson.type === 'video' || activeLesson.type === 'VIDEO') && <svg className="h-10 w-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>}
                  {(activeLesson.type === 'article' || activeLesson.type === 'ARTICLE') && <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                  {(activeLesson.type === 'quiz' || activeLesson.type === 'QUIZ') && <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
                </div>
                <p className="text-xl font-bold text-white">{activeLesson.title}</p>
                <p className="mt-2 text-sm text-neutral-400 capitalize"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">{activeLesson.type.toLowerCase()} &middot; {activeLesson.duration}</span></p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-4 py-3">
            <Button variant="ghost" size="sm" disabled={activeLessonIndex === 0} onClick={() => setActiveLessonIndex((i) => i - 1)} className="text-neutral-300 hover:text-white hover:bg-neutral-800">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              Previous
            </Button>
            <Button size="sm" onClick={handleMarkComplete} loading={marking} disabled={!activeLesson || activeLesson.completed} variant={activeLesson?.completed ? 'ghost' : 'primary'}>
              {activeLesson?.completed ? '✓ Completed' : 'Mark Complete'}
            </Button>
            <Button size="sm" disabled={activeLessonIndex === totalLessons - 1} onClick={() => setActiveLessonIndex((i) => i + 1)}>
              Next
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </Button>
          </div>
        </div>

        {sidebarOpen && (
          <aside className="w-80 shrink-0 overflow-y-auto border-l border-neutral-800 bg-neutral-900">
            <div className="p-4"><h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Course Content</h2></div>
            {course.modules.map((mod: { id: string; title: string; duration: string; lessons: { id: string; title: string; type: string; duration: string; completed: boolean }[] }, modIndex: number) => {
              const modLessonsStart = course.modules.slice(0, modIndex).reduce((acc: number, m: { lessons: unknown[] }) => acc + m.lessons.length, 0)
              return (
                <div key={mod.id}>
                  <div className="px-4 py-2 bg-neutral-800/50">
                    <p className="text-xs font-semibold text-neutral-300">Module {modIndex + 1}: {mod.title}</p>
                    <p className="text-xs text-neutral-500">{mod.duration}</p>
                  </div>
                  <ul>
                    {mod.lessons.map((lesson, lessonIndex) => {
                      const globalIndex = modLessonsStart + lessonIndex
                      const isActive = globalIndex === activeLessonIndex
                      return (
                        <li key={lesson.id}>
                          <button onClick={() => setActiveLessonIndex(globalIndex)} className={cn('flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors cursor-pointer', isActive ? 'bg-primary-600/20 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200')}>
                            {lesson.completed ? (
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-500 text-white"><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                            ) : (
                              <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', isActive ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-600')}>{isActive && <div className="h-2 w-2 rounded-full bg-white" />}</div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{lesson.title}</p>
                              <p className="text-xs text-neutral-500 capitalize">{lesson.type.toLowerCase()} &middot; {lesson.duration}</p>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </aside>
        )}
      </div>
    </div>
  )
}
