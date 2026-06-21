import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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

      {/* Background decorative blobs — same as landing */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 600, height: 600, background: 'radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '60%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(29,158,117,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#1d9e75', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 15 }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#111', letterSpacing: -0.4 }}>NyumbaVerified</span>
        </Link>
        <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#1d9e75', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </nav>

      {/* Main content — centered card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 24px 48px', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 8px 40px rgba(29,158,117,0.1), 0 1px 3px rgba(0,0,0,0.06)',
            padding: '40px 36px',
          }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px', letterSpacing: -0.6 }}>
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
                    width: '100%', padding: '12px 15px',
                    background: focused === 'email' ? '#fff' : 'rgba(255,255,255,0.7)',
                    border: `1.5px solid ${focused === 'email' ? '#1d9e75' : '#e0e0e0'}`,
                    borderRadius: 11, fontSize: 14, color: '#111',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s', caretColor: '#1d9e75',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(29,158,117,0.1)' : 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Password</label>
                </div>
                <input
                  type="password" required
                  value={form.password}
                  placeholder="••••••••"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%', padding: '12px 15px',
                    background: focused === 'password' ? '#fff' : 'rgba(255,255,255,0.7)',
                    border: `1.5px solid ${focused === 'password' ? '#1d9e75' : '#e0e0e0'}`,
                    borderRadius: 11, fontSize: 14, color: '#111',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'all 0.2s', caretColor: '#1d9e75',
                    boxShadow: focused === 'password' ? '0 0 0 3px rgba(29,158,117,0.1)' : 'none',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#fff5f5', border: '1px solid #fecaca',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                  color: '#dc2626', fontSize: 13,
                }}>{error}</div>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: loading ? 'rgba(29,158,117,0.6)' : '#1d9e75',
                  border: 'none', borderRadius: 11,
                  color: 'white', fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: -0.2,
                  boxShadow: loading ? 'none' : '0 4px 18px rgba(29,158,117,0.35)',
                  transition: 'all 0.2s',
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

            <p style={{ textAlign: 'center', color: '#888', fontSize: 13, margin: 0 }}>
              New here?{' '}
              <Link to="/signup" style={{ color: '#1d9e75', fontWeight: 600, textDecoration: 'none' }}>
                Create a free account
              </Link>
            </p>
          </div>

          {/* Trust badges below card */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
            {['🔒 Escrow protected', '✅ ID verified landlords', '🌍 Pan-African'].map(b => (
              <span key={b} style={{ color: '#888', fontSize: 12, fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
