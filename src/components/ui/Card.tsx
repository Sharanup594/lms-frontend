import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, padding = 'md', hover }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-neutral-200/80 shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/5 hover:-translate-y-0.5',
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}
