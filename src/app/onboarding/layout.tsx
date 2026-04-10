import { AuthGuard } from '@/components/layout/AuthGuard'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
