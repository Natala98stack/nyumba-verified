import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const G = '#1d9e75'
const GD = '#0f6e56'
const GL = '#e8f5f0'

function useMobile() {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 900)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

const NAV = [
  { icon: '📊', label: 'Dashboard', to: '/admin' },
  { icon: '👥', label: 'Users', to: '/admin/users' },
  { icon: '📋', label: 'Listings', to: '/admin/listings' },
  { icon: '📅', label: 'Viewings', to: '/admin/viewings' },
  { icon: '🚨', label: 'Fraud reports', to: '/admin/reports' },
  { icon: '🪪', label: 'KYC review', to: '/admin/kyc' },
]

export default function AdminLayout({ title, count, subtitle, kycCount = 0, children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (profile && profile.role !== 'admin') navigate('/dashboard')
  }, [profile])

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fffe', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: G, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18, margin: '0 auto 12px' }}>N</div>
        <p style={{ color: '#bbb', fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  )

  const firstName = profile.full_name?.split(' ')[0] || 'Admin'
  const SIDEBAR_W = 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6faf8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .nav-lnk { transition: all 0.15s ease !important; }
        .nav-lnk:hover { background: rgba(29,158,117,0.08) !important; color: #0f6e56 !important; }
        .signout-btn:hover { background: #fff0f0 !important; color: #c92a2a !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      {(!mobile || sidebarOpen) && (
        <>
          {mobile && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />}
          <aside style={{ width: SIDEBAR_W, flexShrink: 0, background: '#fff', borderRight: '1px solid #eef2ef', display: 'flex', flexDirection: 'column', position: mobile ? 'fixed' : 'sticky', top: 0, left: 0, height: '100vh', zIndex: 50, boxShadow: mobile ? '4px 0 24px rgba(0,0,0,0.12)' : 'none' }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f4f1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 17, boxShadow: '0 2px 8px rgba(29,158,117,0.3)' }}>N</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: '#0a0a0a', margin: 0, letterSpacing: -0.3 }}>NyumbaVerified</p>
                  <p style={{ fontSize: 10, color: '#e8590c', margin: 0, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>Admin panel</p>
                </div>
              </div>
            </div>

            <div style={{ margin: '14px 14px 0', padding: '14px', background: '#fff5f0', borderRadius: 12, border: '1px solid #ffd8bf' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #f76707, #e8590c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0 }}>
                  {firstName[0]?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.full_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, background: '#e8590c', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: '#e8590c', fontWeight: 600 }}>Administrator</span>
                  </div>
                </div>
              </div>
            </div>

            <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#ccc', letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>Management</p>
              {NAV.map(item => {
                const active = pathname === item.to
                return (
                  <Link key={item.to} to={item.to} className="nav-lnk" onClick={() => setSidebarOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', marginBottom: 2, background: active ? GL : 'transparent', color: active ? GD : '#555', fontWeight: active ? 700 : 500, fontSize: 14, borderLeft: active ? `3px solid ${G}` : '3px solid transparent' }}>
                    <span style={{ fontSize: 17 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.to === '/admin/kyc' && kycCount > 0 && (
                      <span style={{ background: '#e8590c', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '1px 7px' }}>{kycCount}</span>
                    )}
                  </Link>
                )
              })}
            </nav>

            <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #f0f4f1' }}>
              <Link to="/dashboard" className="nav-lnk" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#555', fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
                <span style={{ fontSize: 17 }}>👤</span>
                <span>Switch to user view</span>
              </Link>
              <button onClick={signOut} className="signout-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#888', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 17 }}>🚪</span>
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #eef2ef', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {mobile && <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 4, color: '#555' }}>☰</button>}
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#0a0a0a', margin: 0 }}>
                {title}{count != null && <span style={{ color: '#aaa', fontWeight: 600 }}> ({count})</span>}
              </p>
              <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>{subtitle || 'Admin panel'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff5f0', border: '1px solid #ffd8bf', borderRadius: 20, padding: '5px 12px' }}>
              <span style={{ width: 7, height: 7, background: '#e8590c', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#e8590c', fontWeight: 600 }}>Admin</span>
            </div>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f76707, #e8590c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, boxShadow: '0 2px 8px rgba(232,89,12,0.25)' }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: mobile ? '20px 16px' : '28px 32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', animation: 'fadeUp 0.35s ease' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
