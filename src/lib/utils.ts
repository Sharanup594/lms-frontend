export function cn(...classes: (string | boolean | number | undefined | null)[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ')
}
