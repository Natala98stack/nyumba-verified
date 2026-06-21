import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const CITIES = ['Nairobi', 'Lagos', 'Accra', 'Johannesburg', 'Cairo', 'Dar es Salaam', 'Kampala', 'London', 'Dubai']

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: '#060910',
    }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: '0 0 52%', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Animated gradient background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 30%, #071a12 65%, #060d1a 100%)',
        }} />

        {/* Large globe SVG */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 500 500" style={{ width: '85%', maxWidth: 480, opacity: 0.85 }}>
            {/* Outer glow ring */}
            <circle cx="250" cy="250" r="200" fill="none" stroke="rgba(29,158,117,0.08)" strokeWidth="40" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(29,158,117,0.06)" strokeWidth="1" />

            {/* Globe base */}
            <circle cx="250" cy="250" r="160" fill="#091422" stroke="rgba(29,158,117,0.2)" strokeWidth="1" />

            {/* Grid lines - latitude */}
            {[-120, -80, -40, 0, 40, 80, 120].map((offset, i) => {
              const r = Math.sqrt(Math.max(0, 160*160 - offset*offset))
              return r > 0 ? <ellipse key={i} cx="250" cy={250+offset} rx={r} ry={r*0.3} fill="none" stroke="rgba(29,158,117,0.12)" strokeWidth="0.5" /> : null
            })}

            {/* Grid lines - longitude */}
            {[0, 30, 60, 90, 120, 150].map((angle, i) => (
              <ellipse key={i} cx="250" cy="250" rx={160 * Math.abs(Math.cos(angle * Math.PI / 180))} ry="160" fill="none" stroke="rgba(29,158,117,0.12)" strokeWidth="0.5" transform={`rotate(${angle}, 250, 250)`} />
            ))}

            {/* Africa continent shape (simplified) */}
            <path d="M230,145 L255,140 L270,155 L275,175 L268,195 L278,215 L280,240 L272,265 L260,285 L248,305 L240,315 L232,300 L228,280 L222,260 L218,240 L220,215 L215,195 L218,175 L225,160 Z"
              fill="rgba(29,158,117,0.35)" stroke="rgba(29,158,117,0.6)" strokeWidth="1.5" />

            {/* Madagascar */}
            <ellipse cx="282" cy="282" rx="6" ry="12" fill="rgba(29,158,117,0.25)" stroke="rgba(29,158,117,0.4)" strokeWidth="1" transform="rotate(15,282,282)" />

            {/* Europe hint */}
            <path d="M218,115 L235,108 L248,112 L250,125 L238,130 L220,128 Z" fill="rgba(29,158,117,0.12)" stroke="rgba(29,158,117,0.2)" strokeWidth="0.8" />

            {/* Middle East hint */}
            <path d="M272,148 L290,145 L298,158 L292,170 L275,168 Z" fill="rgba(29,158,117,0.1)" stroke="rgba(29,158,117,0.2)" strokeWidth="0.8" />

            {/* City dots with pulse rings */}
            {[
              { x: 258, y: 220, city: 'Nairobi', size: 5 },
              { x: 220, y: 200, city: 'Lagos', size: 4 },
              { x: 218, y: 190, city: 'Accra', size: 3.5 },
              { x: 268, y: 248, city: 'Dar es Salaam', size: 3 },
              { x: 248, y: 165, city: 'Cairo', size: 4 },
              { x: 265, y: 278, city: 'Johannesburg', size: 4 },
              { x: 255, y: 210, city: 'Kampala', size: 3 },
              { x: 226, y: 183, city: 'Abidjan', size: 3 },
            ].map((dot, i) => (
              <g key={i}>
                <circle cx={dot.x} cy={dot.y} r={dot.size * 2.5} fill="rgba(29,158,117,0.08)" />
                <circle cx={dot.x} cy={dot.y} r={dot.size * 1.5} fill="rgba(29,158,117,0.15)" />
                <circle cx={dot.x} cy={dot.y} r={dot.size * 0.7} fill="#1d9e75" />
              </g>
            ))}

            {/* Connection lines between cities */}
            {[
              [258, 220, 220, 200],
              [258, 220, 265, 278],
              [258, 220, 248, 165],
              [220, 200, 218, 190],
              [265, 278, 248, 165],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(29,158,117,0.2)" strokeWidth="0.8" strokeDasharray="3,3" />
            ))}

            {/* Globe rim highlight */}
            <circle cx="250" cy="250" r="160" fill="none"
              stroke="url(#rimGrad)" strokeWidth="1.5" />

            <defs>
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(29,158,117,0.6)" />
                <stop offset="50%" stopColor="rgba(29,158,117,0.1)" />
                <stop offset="100%" stopColor="rgba(29,158,117,0.4)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* City marquee strip */}
        <div style={{
          position: 'absolute', bottom: 120, left: 0, right: 0,
          overflow: 'hidden', padding: '10px 0',
          borderTop: '1px solid rgba(29,158,117,0.1)',
          borderBottom: '1px solid rgba(29,158,117,0.1)',
          background: 'rgba(6,13,26,0.6)',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            display: 'flex', gap: 40, whiteSpace: 'nowrap',
            animation: 'marquee 20s linear infinite',
          }}>
            {[...CITIES, ...CITIES, ...CITIES].map((city, i) => (
              <span key={i} style={{ color: 'rgba(29,158,117,0.7)', fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
                {city.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div style={{ position: 'absolute', bottom: 40, left: 48, right: 48, zIndex: 10 }}>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.3 }}>
            Housing without borders.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0, letterSpacing: 1 }}>
            KENYA · NIGERIA · GHANA · SOUTH AFRICA · AND GROWING
          </p>
        </div>

        {/* Top logo */}
        <div style={{ position: 'relative', zIndex: 10, padding: '32px 40px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: '#1d9e75', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: 'white', fontSize: 15, letterSpacing: -1,
          }}>N</div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>NyumbaVerified</span>
          <span style={{
            background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)',
            color: '#1d9e75', fontSize: 9, fontWeight: 700, padding: '2px 7px',
            borderRadius: 20, letterSpacing: 1, marginLeft: 4,
          }}>GLOBAL</span>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#090f1a', padding: '48px 40px',
        position: 'relative',
      }}>
        {/* Subtle top-right glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 340, position: 'relative' }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              color: 'white', fontSize: 28, fontWeight: 700,
              margin: '0 0 8px', letterSpacing: -0.5, lineHeight: 1.2,
            }}>
              Sign in
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 }}>
              Good to have you back.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', color: 'rgba(255,255,255,0.5)',
                fontSize: 12, fontWeight: 500, marginBottom: 7, letterSpacing: 0.3,
              }}>EMAIL</label>
              <input
                type="email" required
                value={form.email}
                placeholder="you@example.com"
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: focusedField === 'email' ? 'rgba(29,158,117,0.06)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${focusedField === 'email' ? 'rgba(29,158,117,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'all 0.2s', caretColor: '#1d9e75',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{
                display: 'block', color: 'rgba(255,255,255,0.5)',
                fontSize: 12, fontWeight: 500, marginBottom: 7, letterSpacing: 0.3,
              }}>PASSWORD</label>
              <input
                type="password" required
                value={form.password}
                placeholder="••••••••••"
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: focusedField === 'password' ? 'rgba(29,158,117,0.06)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${focusedField === 'password' ? 'rgba(29,158,117,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'all 0.2s', caretColor: '#1d9e75',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.2)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                color: '#ff7070', fontSize: 13,
              }}>{error}</div>
            )}

            {/* Sign in button */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', marginTop: 20,
                background: loading ? 'rgba(29,158,117,0.4)' : '#1d9e75',
                border: 'none', borderRadius: 12,
                color: 'white', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: 0.2,
                boxShadow: loading ? 'none' : '0 4px 24px rgba(29,158,117,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in…' : 'Continue →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
            New to NyumbaVerified?{' '}
            <Link to="/signup" style={{ color: '#1d9e75', textDecoration: 'none', fontWeight: 600 }}>
              Create account
            </Link>
          </p>

          {/* Trust strip */}
          <div style={{
            marginTop: 48, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', gap: 16, flexWrap: 'wrap',
          }}>
            {[
              { icon: '🔒', text: 'Escrow protected' },
              { icon: '✅', text: 'ID verified' },
              { icon: '🌍', text: 'Pan-African' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
