import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

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

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const mobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, listings: 0, viewings: 0, reports: 0, kyc: 0, openReports: 0 })

  useEffect(() => {
    if (!profile) return
    if (profile.role !== 'admin') { navigate('/dashboard'); return }
    fetchStats()
  }, [profile])

  async function fetchStats() {
    try {
      const [users, listings, viewings, reports] = await Promise.all([
        supabase.rpc('get_all_profiles'),
        supabase.from('listings').select('id'),
        supabase.from('viewings').select('id'),
        supabase.from('fraud_reports').select('id, status'),
      ])
      const reportRows = reports.data || []
      setStats({
        users: users.data?.length || 0,
        listings: listings.data?.length || 0,
        viewings: viewings.data?.length || 0,
        reports: reportRows.length,
        openReports: reportRows.filter(r => !String(r.status || '').startsWith('resolved')).length,
        kyc: (users.data || []).filter(u => u.kyc_status === 'submitted').length,
      })
    } catch (err) {
      console.error('Admin stats error:', err)
    }
    setLoading(false)
  }

  if (!profile) return <Loader text="Loading admin dashboard…" />
  if (loading) return <Loader text="Loading platform data…" />

  const firstName = profile.full_name?.split(' ')[0] || 'Admin'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const SIDEBAR_W = 240

  const NAV = [
    { icon: '📊', label: 'Dashboard', to: '/admin' },
    { icon: '👥', label: 'Users', to: '/admin/users' },
    { icon: '📋', label: 'Listings', to: '/admin/listings' },
    { icon: '📅', label: 'Viewings', to: '/admin/viewings' },
    { icon: '🚨', label: 'Fraud reports', to: '/admin/reports' },
    { icon: '🪪', label: 'KYC review', to: '/admin/kyc' },
  ]

  const STATS = [
    { icon: '👥', label: 'Total users', value: stats.users, bg: 'linear-gradient(135deg, #eef3ff, #dce8ff)', accent: '#3b5bdb', sub: 'Registered' },
    { icon: '🏠', label: 'Listings', value: stats.listings, bg: `linear-gradient(135deg, ${GL}, #d0ede3)`, accent: G, sub: 'On platform' },
    { icon: '📅', label: 'Viewings', value: stats.viewings, bg: 'linear-gradient(135deg, #f3eeff, #e4dcff)', accent: '#7048e8', sub: 'Total booked' },
    { icon: '🚨', label: 'Fraud reports', value: stats.reports, bg: 'linear-gradient(135deg, #fff0f0, #ffe0e0)', accent: '#c92a2a', sub: 'All time' },
  ]

  const ACTIONS = [
    { icon: '👥', title: 'Manage users', desc: 'View, verify or ban users', to: '/admin/users', gradient: 'linear-gradient(135deg, #eef3ff 0%, #dce8ff 100%)', accent: '#3b5bdb', tag: 'Users' },
    { icon: '📋', title: 'Manage listings', desc: 'Approve or reject properties', to: '/admin/listings', gradient: `linear-gradient(135deg, ${GL} 0%, #d0ede3 100%)`, accent: G, tag: 'Manage' },
    { icon: '📅', title: 'Viewings', desc: 'Monitor bookings & escrow', to: '/admin/viewings', gradient: 'linear-gradient(135deg, #f3eeff 0%, #e4dcff 100%)', accent: '#7048e8', tag: 'Monitor' },
    { icon: '🚨', title: 'Fraud reports', desc: 'Investigate and resolve', to: '/admin/reports', gradient: 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)', accent: '#c92a2a', tag: 'Review' },
    { icon: '🪪', title: 'KYC review', desc: 'Approve or reject ID uploads', to: '/admin/kyc', gradient: 'linear-gradient(135deg, #fff8e1 0%, #ffeebb 100%)', accent: '#e67700', tag: 'Verify' },
  ]

  const attention = [
    { icon: '🪪', text: 'IDs waiting for review', count: stats.kyc, to: '/admin/kyc' },
    { icon: '🚨', text: 'Open fraud reports', count: stats.openReports, to: '/admin/reports' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6faf8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .action-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; cursor: pointer; }
        .action-card:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 32px rgba(0,0,0,0.1) !important; }
        .nav-lnk { transition: all 0.15s ease !important; }
        .nav-lnk:hover { background: rgba(29,158,117,0.08) !important; color: #0f6e56 !important; }
        .signout-btn:hover { background: #fff0f0 !important; color: #c92a2a !important; }
        .attn-row:hover { background: #fafafa !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      {(!mobile || sidebarOpen) && (
        <>
          {mobile && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />}
          <aside style={{ width: SIDEBAR_W, flexShrink: 0, background: '#fff', borderRight: '1px solid #eef2ef', display: 'flex', flexDirection: 'column', position: mobile ? 'fixed' : 'sticky', top: 0, left: 0, height: '100vh', zIndex: 50, boxShadow: mobile ? '4px 0 24px rgba(0,0,0,0.12)' : 'none' }}>
            {/* Logo */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f4f1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 17, boxShadow: '0 2px 8px rgba(29,158,117,0.3)' }}>N</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: '#0a0a0a', margin: 0, letterSpacing: -0.3 }}>NyumbaVerified</p>
                  <p style={{ fontSize: 10, color: '#e8590c', margin: 0, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>Admin panel</p>
                </div>
              </div>
            </div>

            {/* Admin card */}
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

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#ccc', letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>Management</p>
              {NAV.map(item => {
                const active = currentPath === item.to
                return (
                  <Link key={item.to} to={item.to} className="nav-lnk" onClick={() => setCurrentPath(item.to)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', marginBottom: 2, background: active ? GL : 'transparent', color: active ? GD : '#555', fontWeight: active ? 700 : 500, fontSize: 14, borderLeft: active ? `3px solid ${G}` : '3px solid transparent' }}>
                    <span style={{ fontSize: 17 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.to === '/admin/kyc' && stats.kyc > 0 && (
                      <span style={{ background: '#e8590c', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '1px 7px' }}>{stats.kyc}</span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Footer: switch view + sign out */}
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
        {/* Top bar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #eef2ef', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {mobile && <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 4, color: '#555' }}>☰</button>}
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#0a0a0a', margin: 0 }}>{greeting}, {firstName} 👋</p>
              <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>Platform overview & management</p>
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

        {/* Page content */}
        <main style={{ flex: 1, padding: mobile ? '20px 16px' : '28px 32px', overflowY: 'auto' }}>

          {/* Attention banner */}
          {stats.kyc > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: '#fff8e1', borderRadius: 14, border: '1px solid #fde68a', marginBottom: 24, animation: 'fadeUp 0.4s ease', flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>🪪</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#92400e', margin: '0 0 2px' }}>{stats.kyc} ID {stats.kyc === 1 ? 'submission is' : 'submissions are'} waiting for review</p>
                <p style={{ fontSize: 13, color: '#b45309', margin: 0 }}>Approve or reject pending identity verifications.</p>
              </div>
              <Link to="/admin/kyc" style={{ background: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 16px', borderRadius: 9, textDecoration: 'none', flexShrink: 0, boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}>Review now →</Link>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid #eef2ef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                  <span style={{ fontSize: 10, color: '#bbb', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.sub}</span>
                </div>
                <p style={{ fontSize: 32, fontWeight: 900, color: s.accent, margin: '0 0 4px', letterSpacing: -1 }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#666', margin: 0, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a', margin: 0, letterSpacing: -0.3 }}>Management</h2>
              <span style={{ fontSize: 12, color: '#bbb' }}>Run the platform</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14 }}>
              {ACTIONS.map((a, i) => (
                <Link key={i} to={a.to} className="action-card" style={{ textDecoration: 'none', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #eef2ef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animation: `fadeUp 0.4s ease ${i * 0.07 + 0.1}s both` }}>
                  <div style={{ height: 80, background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, position: 'relative' }}>
                    {a.icon}
                    <span style={{ position: 'absolute', top: 10, right: 10, background: a.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: 0.5 }}>{a.tag}</span>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', margin: '0 0 4px', letterSpacing: -0.2 }}>{a.title}</p>
                    <p style={{ fontSize: 12, color: '#999', margin: '0 0 12px', lineHeight: 1.4 }}>{a.desc}</p>
                    <span style={{ color: a.accent, fontSize: 12, fontWeight: 700 }}>Open →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom cards */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            {/* Needs attention */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #eef2ef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: '#fff5f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔔</div>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', margin: 0 }}>Needs attention</h3>
              </div>
              {attention.map((item, i) => (
                <Link key={i} to={item.to} className="attn-row" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 8, borderBottom: i < attention.length - 1 ? '1px solid #f5f5f5' : 'none', textDecoration: 'none' }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: '#555', flex: 1 }}>{item.text}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: item.count > 0 ? '#e8590c' : '#bbb' }}>{item.count}</span>
                </Link>
              ))}
              {stats.kyc === 0 && stats.openReports === 0 && (
                <p style={{ fontSize: 12, color: '#aaa', margin: '8px 0 0', textAlign: 'center' }}>All clear — nothing pending 🎉</p>
              )}
            </div>

            {/* Admin tips */}
            <div style={{ background: 'linear-gradient(135deg, #f7fdf9 0%, #edfaf3 100%)', borderRadius: 16, padding: '22px 24px', border: `1px solid ${G}20` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: GL, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💡</div>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', margin: 0 }}>Admin tips</h3>
              </div>
              {[
                'Review ID submissions within 24 hours to keep trust high',
                'Cross-check the photo against the typed ID details',
                'Resolve fraud reports promptly and keep notes',
                'Verified landlords get more bookings — encourage KYC',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < 3 ? '1px solid rgba(29,158,117,0.1)' : 'none' }}>
                  <span style={{ color: G, fontWeight: 800, fontSize: 12, flexShrink: 0, marginTop: 1 }}>0{i + 1}</span>
                  <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Loader({ text }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fffe', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: G, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18, margin: '0 auto 12px' }}>N</div>
        <p style={{ color: '#bbb', fontSize: 14 }}>{text}</p>
      </div>
    </div>
  )
}