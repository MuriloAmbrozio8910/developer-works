import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from '@/components/ui/loading'
import { Layout } from '@/components/Layout'

export function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) return <Loading message="Verificando sessão..." />
  if (!user) return <Navigate to="/login" replace />

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
