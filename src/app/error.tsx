'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // AbortErrors happen during normal page transitions — silently recover
  useEffect(() => {
    if (
      error.name === 'AbortError' ||
      error.message === 'The operation was aborted.' ||
      error.message?.includes('aborted')
    ) {
      reset()
    }
  }, [error, reset])

  // Don't render error UI for abort errors
  if (
    error.name === 'AbortError' ||
    error.message === 'The operation was aborted.' ||
    error.message?.includes('aborted')
  ) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-surface-secondary via-white to-danger-50 p-4 text-center">
      <div className="animate-fade-in-up">
        <div className="relative mx-auto mb-6">
          <div className="absolute -inset-4 rounded-full bg-danger-100/50 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-danger-100 to-danger-50 text-danger-600 mx-auto">
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Something went wrong</h1>
        <p className="mt-2 text-neutral-500 max-w-md">{error.message || 'An unexpected error occurred. Please try again.'}</p>
        <Button onClick={reset} className="mt-6" size="lg">
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Try again
        </Button>
      </div>
    </div>
  )
}
