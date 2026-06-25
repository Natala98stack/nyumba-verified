import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import {
  LayoutDashboard, Search, Calendar, CalendarCheck, ShieldCheck, Plus,
  ClipboardList, LogOut, Menu, Home, Star, Shield, Lock, BadgeCheck,
  ShieldAlert, Lightbulb, Check,
} from 'lucide-react'

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

export default function Dashboard() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const mobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({ listings: 0, bookings: 0, viewings: 0 })
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    if (!profile) return
    if (profile.role === 'admin') {
      navigate('/admin')
      return
    }
    fetchStats()
  }, [profile])

  async function fetchStats() {
    try {
      if (profile.role === 'tenant') {
        const { data } = await supabase.from('viewings').select('id').eq('tenant_id', profile.id)
        setStats({ bookings: data?.length || 0, listings: 0, viewings: 0 })
      } else {
        const [{ data: lData }, { data: vData }] = await Promise.all([
          supabase.from('listings').select('id').eq('owner_id', profile.id),
          supabase.from('viewings').select('id').eq('landlord_id', profile.id),
        ])
        setStats({ listings: lData?.length || 0, viewings: vData?.length || 0, bookings: 0 })
      }
    } catch (err) {
      console.error('Stats fetch error:', err)
    }
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fffe', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: G, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18, margin: '0 auto 12px' }}>N</div>
        <p style={{ color: '#bbb', fontSize: 14 }}>Loading your dashboard…</p>
      </div>
    </div>
  )

  const isTenant = profile.role === 'tenant'
  const isLandlord = profile.role === 'landlord' || profile.role === 'bnb_host'
  const firstName = profile.full_name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const KYC_STATUS = {
    pending:  { label: 'ID not verified', bg: '#fff8e1', color: '#b7791f', border: '#fde68a', dot: '#f59e0b' },
    verified: { label: 'ID verified', bg: '#f0faf6', color: GD, border: '#b8dfd0', dot: G },
    rejected: { label: 'Verification failed', bg: '#fff5f5', color: '#c92a2a', border: '#fecaca', dot: '#e53e3e' },
  }
  const kyc = KYC_STATUS[profile.kyc_status] || KYC_STATUS.pending

  const TENANT_NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Search, label: 'Browse listings', to: '/listings' },
    { icon: Calendar, label: 'My bookings', to: '/my-bookings' },
    { icon: ShieldCheck, label: 'Verify identity', to: '/verify-kyc' },
  ]
  const LANDLORD_NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Plus, label: 'Add listing', to: '/listings/new' },
    { icon: ClipboardList, label: 'My listings', to: '/my-listings' },
    { icon: Calendar, label: 'Viewings', to: '/my-bookings' },
    { icon: ShieldCheck, label: 'Verify identity', to: '/verify-kyc' },
  ]
  const NAV = isTenant ? TENANT_NAV : LANDLORD_NAV

  const TENANT_ACTIONS = [
    { icon: Search, title: 'Browse listings', desc: 'Find your next verified home', to: '/listings', gradient: `linear-gradient(135deg, ${GL} 0%, #d0ede3 100%)`, accent: G, tag: 'Explore' },
    { icon: Calendar, title: 'My bookings', desc: 'Track your viewing requests', to: '/my-bookings', gradient: 'linear-gradient(135deg, #eef3ff 0%, #dce8ff 100%)', accent: '#3b5bdb', tag: 'Track' },
    { icon: ShieldAlert, title: 'Report fraud', desc: 'Report a suspicious agent', to: '/listings', gradient: 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)', accent: '#c92a2a', tag: 'Report' },
    { icon: ShieldCheck, title: 'Verify identity', desc: 'Upload your national ID', to: '/verify-kyc', gradient: 'linear-gradient(135deg, #fff8e1 0%, #ffeebb 100%)', accent: '#e67700', tag: 'Important' },
  ]

  const LANDLORD_ACTIONS = [
    { icon: Plus, title: 'Add new listing', desc: 'Post a vacant property', to: '/listings/new', gradient: `linear-gradient(135deg, ${GL} 0%, #d0ede3 100%)`, accent: G, tag: 'New' },
    { icon: ClipboardList, title: 'My listings', desc: 'Manage your properties', to: '/my-listings', gradient: 'linear-gradient(135deg, #eef3ff 0%, #dce8ff 100%)', accent: '#3b5bdb', tag: 'Manage' },
    { icon: Calendar, title: 'Viewings', desc: 'Track booking requests', to: '/my-bookings', gradient: 'linear-gradient(135deg, #f3fff3 0%, #dcf5dc 100%)', accent: '#2f9e44', tag: 'Monitor' },
    { icon: ShieldCheck, title: 'Verify identity', desc: 'Get the verified badge', to: '/verify-kyc', gradient: 'linear-gradient(135deg, #fff8e1 0%, #ffeebb 100%)', accent: '#e67700', tag: 'Important' },
  ]

  const ACTIONS = isTenant ? TENANT_ACTIONS : LANDLORD_ACTIONS
  const SIDEBAR_W = 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6faf8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .action-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; cursor: pointer; }
        .action-card:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 32px rgba(0,0,0,0.1) !important; }
        .nav-lnk { transition: all 0.15s ease !important; }
        .nav-lnk:hover { background: rgba(29,158,117,0.08) !important; color: #0f6e56 !important; }
        .signout-btn:hover { background: #fff0f0 !important; color: #c92a2a !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      {(!mobile || sidebarOpen) && (
        <>
          {mobile && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />}
          <aside style={{
            width: SIDEBAR_W, flexShrink: 0,
            background: '#fff',
            borderRight: '1px solid #eef2ef',
            display: 'flex', flexDirection: 'column',
            position: mobile ? 'fixed' : 'sticky',
            top: 0, left: 0, height: '100vh',
            zIndex: 50,
            boxShadow: mobile ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
          }}>
            {/* Logo */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f4f1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 17, boxShadow: '0 2px 8px rgba(29,158,117,0.3)' }}>N</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: '#0a0a0a', margin: 0, letterSpacing: -0.3 }}>NyumbaVerified</p>
                  <p style={{ fontSize: 10, color: '#bbb', margin: 0, letterSpacing: 0.5, textTransform: 'uppercase' }}>{profile.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* User card */}
            <div style={{ margin: '14px 14px 0', padding: '14px', background: GL, borderRadius: 12, border: `1px solid ${G}25` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0 }}>
                  {firstName[0]?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.full_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, background: kyc.dot, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: kyc.color, fontWeight: 600 }}>{kyc.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#ccc', letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>Menu</p>
              {NAV.map(item => {
                const active = currentPath === item.to
                const Icon = item.icon
                return (
                  <Link key={item.to} to={item.to} className="nav-lnk"
                    onClick={() => setCurrentPath(item.to)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', marginBottom: 2, background: active ? GL : 'transparent', color: active ? GD : '#555', fontWeight: active ? 700 : 500, fontSize: 14, borderLeft: active ? `3px solid ${G}` : '3px solid transparent', transition: 'all 0.15s' }}>
                    <Icon size={18} strokeWidth={active ? 2.4 : 2} style={{ flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Sign out */}
            <div style={{ padding: '14px', borderTop: '1px solid #f0f4f1' }}>
              <button onClick={signOut} className="signout-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#888', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <LogOut size={18} style={{ flexShrink: 0 }} />
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
            {mobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#555', display: 'flex' }}><Menu size={22} /></button>
            )}
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#0a0a0a', margin: 0 }}>{greeting}, {firstName}</p>
              <p style={{ fontSize: 12, color: '#aaa', margin: 0, textTransform: 'capitalize' }}>{profile.role?.replace('_', ' ')} Account</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: kyc.bg, border: `1px solid ${kyc.border}`, borderRadius: 20, padding: '5px 12px' }}>
              <span style={{ width: 7, height: 7, background: kyc.dot, borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: kyc.color, fontWeight: 600 }}>{kyc.label}</span>
            </div>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, boxShadow: '0 2px 8px rgba(29,158,117,0.25)' }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: mobile ? '20px 16px' : '28px 32px', overflowY: 'auto' }}>

          {/* KYC banner */}
          {profile.kyc_status === 'pending' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: '#fff8e1', borderRadius: 14, border: '1px solid #fde68a', marginBottom: 24, animation: 'fadeUp 0.4s ease', flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}><ShieldCheck size={22} color="#d97706" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#92400e', margin: '0 0 2px' }}>Verify your identity to unlock all features</p>
                <p style={{ fontSize: 13, color: '#b45309', margin: 0 }}>Upload your national ID to build trust with {isTenant ? 'landlords' : 'tenants'}.</p>
              </div>
              <Link to="/verify-kyc" style={{ background: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 16px', borderRadius: 9, textDecoration: 'none', flexShrink: 0, boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}>
                Verify now →
              </Link>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : `repeat(${isTenant ? 2 : 3}, 1fr)`, gap: 14, marginBottom: 28 }}>
            {(isTenant ? [
              { icon: CalendarCheck, label: 'Bookings made', value: stats.bookings, bg: 'linear-gradient(135deg, #eef3ff, #dce8ff)', accent: '#3b5bdb', sub: 'Total viewings' },
              { icon: Search, label: 'Listings available', value: '2,400+', bg: `linear-gradient(135deg, ${GL}, #d0ede3)`, accent: G, sub: 'Verified properties' },
            ] : [
              { icon: Home, label: 'My listings', value: stats.listings, bg: `linear-gradient(135deg, ${GL}, #d0ede3)`, accent: G, sub: 'Active properties' },
              { icon: CalendarCheck, label: 'Viewing requests', value: stats.viewings, bg: 'linear-gradient(135deg, #eef3ff, #dce8ff)', accent: '#3b5bdb', sub: 'Total bookings' },
              { icon: Star, label: 'Rating', value: '—', bg: 'linear-gradient(135deg, #fff8e1, #ffeebb)', accent: '#e67700', sub: 'After first review' },
            ]).map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid #eef2ef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={22} color={s.accent} strokeWidth={2.2} /></div>
                    <span style={{ fontSize: 10, color: '#bbb', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.sub}</span>
                  </div>
                  <p style={{ fontSize: 32, fontWeight: 900, color: s.accent, margin: '0 0 4px', letterSpacing: -1 }}>{s.value}</p>
                  <p style={{ fontSize: 13, color: '#666', margin: 0, fontWeight: 500 }}>{s.label}</p>
                </div>
              )
            })}
          </div>

          {/* Quick actions */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a', margin: 0, letterSpacing: -0.3 }}>Quick actions</h2>
              <span style={{ fontSize: 12, color: '#bbb' }}>What would you like to do?</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14 }}>
              {ACTIONS.map((a, i) => {
                const Icon = a.icon
                return (
                  <Link key={i} to={a.to} className="action-card"
                    style={{ textDecoration: 'none', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #eef2ef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animation: `fadeUp 0.4s ease ${i * 0.07 + 0.1}s both` }}>
                    <div style={{ height: 80, background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <Icon size={30} color={a.accent} strokeWidth={2} />
                      <span style={{ position: 'absolute', top: 10, right: 10, background: a.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: 0.5 }}>{a.tag}</span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', margin: '0 0 4px', letterSpacing: -0.2 }}>{a.title}</p>
                      <p style={{ fontSize: 12, color: '#999', margin: '0 0 12px', lineHeight: 1.4 }}>{a.desc}</p>
                      <span style={{ color: a.accent, fontSize: 12, fontWeight: 700 }}>Go →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Bottom cards */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>

            <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: '1px solid #eef2ef', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: GL, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={18} color={GD} /></div>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', margin: 0 }}>Your protections</h3>
              </div>
              {[
                { Icon: Lock, text: 'Viewing fees held in escrow', color: G, ok: true },
                { Icon: BadgeCheck, text: 'Landlord identity verified', color: G, ok: profile.kyc_status === 'verified' },
                { Icon: Star, text: 'Rated & reviewed system', color: '#e67700', ok: true },
                { Icon: ShieldAlert, text: 'One-tap fraud reporting', color: '#c92a2a', ok: true },
              ].map((item, i) => {
                const Icon = item.Icon
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none' }}>
                    <Icon size={16} color={item.color} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#555', flex: 1 }}>{item.text}</span>
                    {item.ok
                      ? <Check size={15} color={G} strokeWidth={3} />
                      : <span style={{ fontSize: 12, color: '#bbb', fontWeight: 700 }}>—</span>}
                  </div>
                )
              })}
            </div>

            <div style={{ background: `linear-gradient(135deg, #f7fdf9 0%, #edfaf3 100%)`, borderRadius: 16, padding: '22px 24px', border: `1px solid ${G}20` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: GL, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lightbulb size={18} color={GD} /></div>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', margin: 0 }}>{isTenant ? 'Tips for tenants' : 'Tips for landlords'}</h3>
              </div>
              {(isTenant ? [
                'Always verify a landlord\'s badge before booking',
                'Your viewing fee is protected — refund if no-show',
                'Leave honest reviews to help other tenants',
                'Report suspicious activity immediately',
              ] : [
                'Verify your ID to get the trusted badge',
                'Clear photos get 3x more views',
                'Respond to viewing requests within 24 hours',
                'Build reputation with consistent positive reviews',
              ]).map((tip, i) => (
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
