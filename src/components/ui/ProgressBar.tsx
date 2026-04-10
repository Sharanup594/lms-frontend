import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorStyles: Record<string, string> = {
  primary: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  danger: 'bg-danger-600',
}

const glowStyles: Record<string, string> = {
  primary: 'shadow-[0_0_8px_rgba(37,99,235,0.4)]',
  success: 'shadow-[0_0_8px_rgba(22,163,74,0.4)]',
  warning: 'shadow-[0_0_8px_rgba(217,119,6,0.4)]',
  danger: 'shadow-[0_0_8px_rgba(220,38,38,0.4)]',
}

export function ProgressBar({ value, size = 'md', color = 'primary', showLabel, animated, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const isComplete = clamped === 100

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-neutral-600">Progress</span>
          <span className={cn('font-semibold', isComplete ? 'text-success-600' : 'text-neutral-900')}>{clamped}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-neutral-200', sizeStyles[size])} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorStyles[color],
            animated && 'progress-stripe',
            isComplete && glowStyles[color],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
