import { AuthGuard } from '@/components/layout/AuthGuard'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
