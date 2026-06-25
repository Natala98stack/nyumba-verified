import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Lock, BadgeCheck, Globe } from 'lucide-react'

function useMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const mobile = useMobile()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  const from = new URLSearchParams(location.search).get('from') || '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form)
      navigate(from)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0faf6 0%, #e8f5f0 30%, #f7fdf9 60%, #edfaf3 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: mobile ? 300 : 600, height: mobile ? 300 : 600, background: 'radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: mobile ? 280 : 500, height: mobile ? 280 : 500, background: 'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ padding: mobile ? '20px 20px' : '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#1d9e75', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 15 }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111', letterSpacing: -0.3 }}>NyumbaVerified</span>
        </Link>
        <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
          No account?{' '}
          <Link to="/signup" style={{ color: '#1d9e75', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </nav>

      {/* Centered card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? '16px 16px 40px' : '24px 24px 48px', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Frosted glass card */}
          <div style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: mobile ? 16 : 20,
            border: '1px solid rgba(255,255,255,0.95)',
            boxShadow: '0 8px 40px rgba(29,158,117,0.1), 0 1px 3px rgba(0,0,0,0.06)',
            padding: mobile ? '28px 24px' : '40px 36px',
          }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: mobile ? 22 : 26, fontWeight: 800, color: '#0a0a0a', margin: '0 0 5px', letterSpacing: -0.5 }}>
                Welcome back
              </h1>
              <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
                Sign in to your NyumbaVerified account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" required
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: focused === 'email' ? '#fff' : 'rgba(255,255,255,0.7)',
                    border: `1.5px solid ${focused === 'email' ? '#1d9e75' : '#e0e0e0'}`,
                    borderRadius: 10, fontSize: 15, color: '#111',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s', caretColor: '#1d9e75',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(29,158,117,0.1)' : 'none',
                    WebkitAppearance: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password" required
                  value={form.password}
                  placeholder="••••••••"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: focused === 'password' ? '#fff' : 'rgba(255,255,255,0.7)',
                    border: `1.5px solid ${focused === 'password' ? '#1d9e75' : '#e0e0e0'}`,
                    borderRadius: 10, fontSize: 15, color: '#111',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s', caretColor: '#1d9e75',
                    boxShadow: focused === 'password' ? '0 0 0 3px rgba(29,158,117,0.1)' : 'none',
                    WebkitAppearance: 'none',
                  }}
                />
              </div>

              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#dc2626', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? 'rgba(29,158,117,0.6)' : '#1d9e75',
                  border: 'none', borderRadius: 11,
                  color: 'white', fontSize: 16, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 18px rgba(29,158,117,0.35)',
                  transition: 'all 0.2s',
                  WebkitAppearance: 'none',
                }}
              >
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
              <span style={{ color: '#bbb', fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
            </div>

            <p style={{ textAlign: 'center', color: '#888', fontSize: 14, margin: 0 }}>
              New here?{' '}
              <Link to="/signup" style={{ color: '#1d9e75', fontWeight: 600, textDecoration: 'none' }}>
                Create a free account
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: mobile ? 16 : 24, marginTop: 20, flexWrap: 'wrap' }}>
            {[{ Icon: Lock, t: 'Escrow protected' }, { Icon: BadgeCheck, t: 'ID verified' }, { Icon: Globe, t: 'Pan-African' }].map(b => (
              <span key={b.t} style={{ color: '#888', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}><b.Icon size={14} />{b.t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
