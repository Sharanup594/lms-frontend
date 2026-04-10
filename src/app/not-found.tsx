import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-surface-secondary via-white to-primary-50 p-4 text-center">
      <div className="animate-fade-in-up">
        {/* Decorative circles */}
        <div className="relative mx-auto mb-6">
          <div className="absolute -inset-8 rounded-full bg-primary-100/50 blur-2xl" />
          <p className="relative text-8xl font-black text-primary-600/80 tracking-tight">404</p>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-2 text-neutral-500 max-w-sm">The page you are looking for does not exist or has been moved.</p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button size="lg">
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
