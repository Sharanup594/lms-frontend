'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const router = useRouter()
  const { role, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (role === 'admin') router.replace('/admin/dashboard')
    else if (role === 'student') router.replace('/dashboard')
  }, [role, isLoading, router])

  if (!isLoading && !role) {
    return (
      <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* ═══ Nav ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-12" style={{ background: '#032F35' }}>
          <div className="flex items-center gap-3">
            <img height="40" width="40" className="rounded-full" src="/VA.png" alt="V-Align" />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer" style={{ color: '#F1F2EE', background: 'transparent', border: '1px solid rgba(241,242,238,0.2)' }}>
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer hover:opacity-90" style={{ background: '#B6ED3E', color: '#032F35' }}>
                Get Started
              </button>
            </Link>
          </div>
        </header>

        {/* ═══ Hero Section — Dark Gunmetal ═══ */}
        <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28" style={{ background: 'linear-gradient(135deg, #032F35 0%, #0A4A42 50%, #032F35 100%)' }}>
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10" style={{ background: '#B6ED3E', filter: 'blur(100px)' }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-5" style={{ background: '#B6ED3E', filter: 'blur(120px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: '#B6ED3E', filter: 'blur(150px)' }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8" style={{ background: 'rgba(182,237,62,0.1)', color: '#B6ED3E', border: '1px solid rgba(182,237,62,0.2)' }}>
              <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ background: '#B6ED3E' }} />
              Enterprise Learning Platform
            </div>

            {/* Hero heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: '#F1F2EE' }}>
              Welcome to {' '}
              <span style={{ color: '#B6ED3E' }}><em>VA LMS</em></span>{' '}
            </h1>

            <p className="mt-6 text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#B8BBB2' }}>
              We align technology, processes, and human potential to accelerate your growth.
              Upskill with industry-leading courses, track progress, earn certifications.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <button className="px-8 py-3.5 text-base font-semibold rounded-xl transition-all cursor-pointer hover:shadow-lg" style={{ background: '#B6ED3E', color: '#032F35', boxShadow: '0 4px 20px rgba(182,237,62,0.3)' }}>
                  Complete Your Free Assessment here
                  <svg className="inline h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </Link>
              {/* <Link href="/login">
                <button className="px-8 py-3.5 text-base font-medium rounded-xl transition-all cursor-pointer" style={{ background: 'transparent', color: '#F1F2EE', border: '1px solid rgba(241,242,238,0.25)' }}>
                  Sign in to your account
                </button>
              </Link> */}
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-12">
              {[
                { value: '800+', label: 'Projects Completed' },
                { value: '360+', label: 'Clients Served' },
                { value: '13+', label: 'Countries' },
                { value: '14+', label: 'Years Experience' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold" style={{ color: '#B6ED3E' }}>{s.value}</p>
                  <p className="text-sm mt-1" style={{ color: '#707D7D' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Features — Anti-flash White ═══ */}
        <section className="py-20 px-6" style={{ background: '#F1F2EE' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#7AB520' }}>What We Offer</p>
              <h2 className="mt-2 text-3xl font-bold" style={{ color: '#032F35' }}>Your Complete Learning Journey</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📊', title: 'Skill Assessment', desc: 'Discover your Employability Index with our benchmarking quiz', color: '#7AB520' },
                { icon: '📚', title: 'Expert Courses', desc: 'Learn from industry professionals with structured curriculum', color: '#7AB520' },
                { icon: '📝', title: 'Assessments', desc: 'Pre-course, in-course, and post-course evaluations', color: '#7AB520' },
                { icon: '🎯', title: 'Certifications', desc: 'Earn recognized certificates upon course completion', color: '#7AB520' },
                { icon: '📂', title: 'Projects', desc: '3-tier project system: Simple to Complex, real-world execution', color: '#7AB520' },
                { icon: '💬', title: 'Feedback', desc: 'Monthly feedback collection to continuously improve', color: '#7AB520' },
                { icon: '💼', title: 'Placement', desc: 'Job placement support and career tracking', color: '#7AB520' },
                { icon: '📈', title: 'Analytics', desc: 'Admin dashboard with enrollment trends and insights', color: '#7AB520' },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ background: '#FFFFFF', border: '1px solid #E8E9E4' }}>
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold" style={{ color: '#032F35' }}>{f.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: '#707D7D' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA Section — Castleton Green ═══ */}
        <section className="py-20 px-6" style={{ background: '#032F35' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold" style={{ color: '#F1F2EE' }}>Ready to Transform Your Learning?</h2>
            <p className="mt-4 text-lg" style={{ color: '#B8BBB2' }}>
              Join hundreds of learners who are upskilling with VA LMS.
              Start with a free skill assessment.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <button className="px-8 py-3.5 text-base font-semibold rounded-xl transition-all cursor-pointer hover:opacity-90" style={{ background: '#B6ED3E', color: '#032F35' }}>
                  Sign up to Start Your Journey
                </button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-3.5 text-base font-medium rounded-xl transition-all cursor-pointer" style={{ color: '#F1F2EE', border: '1px solid rgba(241,242,238,0.3)', background: 'transparent' }}>
                  Already have an account? Sign in
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ Footer — Gunmetal ═══ */}
        <footer className="py-8 px-6" style={{ background: '#032F35', borderTop: '1px solid rgba(182,237,62,0.1)' }}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img height="28" width="28" className="rounded-full" src="/VA.png" alt="V-Align" />
              <span className="text-sm font-semibold" style={{ color: '#F1F2EE' }}>V-Align Technologies</span>
            </div>
            <p className="text-xs" style={{ color: '#707D7D' }}>
              Align technology, processes, and human potential &middot; 14+ years of expertise
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Loading or redirecting
  return (
    <div className="flex h-screen items-center justify-center" style={{ background: '#032F35' }}>
      <svg className="h-8 w-8 animate-spin" style={{ color: '#B6ED3E' }} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}
