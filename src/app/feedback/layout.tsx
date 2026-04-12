import { AuthGuard } from '@/components/layout/AuthGuard'

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
