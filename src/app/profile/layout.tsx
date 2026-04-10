import { StudentShell } from '@/components/layout/StudentShell'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>
}
