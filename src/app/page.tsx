'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const router = useRouter()
  const { role, isLoading } = useAuth()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isLoading) return
    if (role === 'admin') router.replace('/admin/dashboard')
    else if (role === 'student') router.replace('/dashboard')
  }, [role, isLoading, router])

  // Show landing page for unauthenticated visitors
  if (!isLoading && !role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-secondary">
        {/* Nav */}
        <header className="flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/25">
              LH
            </div>
            <span className="text-lg font-bold text-neutral-900 tracking-tight">LearnHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-col items-center justify-center px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-sm text-primary-700 font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              Enterprise Learning Platform
            </div>

            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                LearnHub
              </span>
            </h1>

            <p className="mt-6 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Upskill your career with industry-leading courses in Leadership, Technology, Management, and more.
              Track your progress, earn certificates, and land your dream job.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Get Started Free
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="px-8">
                  Sign in to your account
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature cards */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
            {[
              { icon: '📊', title: 'Skill Assessment', desc: 'Discover your Employability Index with our skill benchmarking quiz' },
              { icon: '📚', title: 'Expert Courses', desc: 'Learn from industry professionals with structured curriculum' },
              { icon: '📝', title: 'Assessments', desc: 'Pre-course, in-course, and post-course evaluations to track growth' },
              { icon: '🎯', title: 'Certifications', desc: 'Earn recognized certificates upon course completion' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white border border-neutral-200/80 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-neutral-900">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 text-center">
            {[
              { value: '6+', label: 'Courses' },
              { value: '50+', label: 'Lessons' },
              { value: '10+', label: 'Instructors' },
              { value: '100%', label: 'Free to Start' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-primary-600">{s.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-500">
          LearnHub LMS — Built for the future of learning
        </footer>
      </div>
    )
  }

  // Loading or redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-surface-secondary">
      <svg className="h-8 w-8 animate-spin text-primary-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}
