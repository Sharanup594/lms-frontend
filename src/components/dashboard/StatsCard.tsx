import { Card } from '@/components/ui/Card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: { value: number; direction: 'up' | 'down' }
  color: string
}

export function StatsCard({ title, value, icon, change, color }: StatsCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">{value}</p>
          {change && (
            <p className={`mt-1.5 flex items-center gap-1 text-sm font-medium ${change.direction === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${change.direction === 'up' ? 'bg-success-50' : 'bg-danger-50'}`}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  {change.direction === 'up' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                  )}
                </svg>
              </span>
              {change.value}%
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
