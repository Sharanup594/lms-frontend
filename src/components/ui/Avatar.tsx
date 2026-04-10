import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const bgColors = [
  'bg-primary-100 text-primary-700',
  'bg-success-50 text-success-700',
  'bg-warning-50 text-warning-600',
  'bg-danger-50 text-danger-700',
]

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const colorIndex = name.charCodeAt(0) % bgColors.length

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeStyles[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold',
        sizeStyles[size],
        bgColors[colorIndex],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
