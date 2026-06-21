import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 32, height: 32, background: '#1d9e75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 15 }}>N</div>
      <p style={{ color: '#999', fontSize: 14 }}>Loading…</p>
    </div>
  )

  if (!user) return <Navigate to={`/login?from=${location.pathname}`} replace />

  return children
}
