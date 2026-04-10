import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  className?: string
  onRowClick?: (item: T) => void
}

export function Table<T>({ columns, data, keyExtractor, className, onRowClick }: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/60">
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                'transition-all duration-200 hover:bg-primary-50/40',
                index % 2 === 1 && 'bg-neutral-50/40',
                onRowClick && 'cursor-pointer',
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3.5 text-sm text-neutral-700', col.className)}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-700">No data available</p>
          <p className="mt-1 text-xs text-neutral-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
