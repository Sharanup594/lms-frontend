import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

const levelVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
  BEGINNER: 'success',
  INTERMEDIATE: 'warning',
  ADVANCED: 'danger',
}

const levelDisplay: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

const categoryColors: Record<string, string> = {
  Leadership: 'bg-purple-100 text-purple-700',
  Technology: 'bg-blue-100 text-blue-700',
  Management: 'bg-amber-100 text-amber-700',
  Communication: 'bg-green-100 text-green-700',
  Innovation: 'bg-pink-100 text-pink-700',
}

const thumbnailGradients: Record<string, string> = {
  Leadership: 'from-purple-500 to-indigo-700',
  Technology: 'from-cyan-500 to-blue-700',
  Management: 'from-amber-500 to-orange-700',
  Communication: 'from-emerald-500 to-teal-700',
  Innovation: 'from-pink-500 to-rose-700',
}

const categoryIcons: Record<string, React.ReactNode> = {
  Leadership: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Technology: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  Management: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  ),
  Communication: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  ),
  Innovation: (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
}

export function CourseCard({ course }: CourseCardProps) {
  const gradient = thumbnailGradients[course.category] || 'from-primary-400 to-primary-700'
  const icon = categoryIcons[course.category]

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <Card padding="none" className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neutral-900/10 group-hover:-translate-y-1">
        {/* Thumbnail */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute right-10 bottom-4 h-12 w-12 rounded-full bg-white/5" />

          {/* Category icon */}
          <div className="relative text-white/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-white/50">
            {icon || (
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            )}
          </div>

          <div className="absolute top-3 left-3">
            <Badge variant={levelVariant[course.level] ?? 'default'} size="sm">{levelDisplay[course.level] ?? course.level}</Badge>
          </div>
          {course.status === 'completed' && (
            <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-success-500 text-white shadow-lg shadow-success-500/30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[course.category] || 'bg-neutral-100 text-neutral-600'}`}>
              {course.category}
            </span>
          </div>
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{course.instructor?.name ?? ''}</p>

          <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
            </span>
            <span className="flex items-center gap-1 text-warning-500 font-medium">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {course.rating}
            </span>
            <span>{course.enrolled.toLocaleString()} enrolled</span>
          </div>

          {course.status !== 'not-started' && (
            <div className="mt-3">
              <ProgressBar
                value={course.progress}
                size="sm"
                color={course.progress === 100 ? 'success' : 'primary'}
                animated={course.progress > 0 && course.progress < 100}
              />
              <p className="mt-1 text-xs text-neutral-500">{course.progress}% complete</p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
