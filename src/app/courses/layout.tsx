import { StudentShell } from '@/components/layout/StudentShell'

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>
}
