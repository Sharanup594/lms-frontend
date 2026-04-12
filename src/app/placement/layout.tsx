import { AuthGuard } from '@/components/layout/AuthGuard'

export default function PlacementLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
