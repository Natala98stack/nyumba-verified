import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* LEFT PANEL — Nairobi Illustration */}
      <div style={{
        flex: '0 0 55%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0a1628 0%, #0d2a1f 50%, #0a1f2e 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* Stars */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {[...Array(40)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: i % 5 === 0 ? '2px' : '1px',
              height: i % 5 === 0 ? '2px' : '1px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.3 + (i % 7) * 0.1,
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 29 + 7) % 60}%`,
            }} />
          ))}
        </div>

        {/* Moon */}
        <div style={{
          position: 'absolute', top: '8%', right: '15%',
          width: 48, height: 48,
          background: '#e8d5a3',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(232, 213, 163, 0.3)',
          opacity: 0.9,
        }} />
        <div style={{
          position: 'absolute', top: '8%', right: '12%',
          width: 42, height: 42,
          background: '#0a1628',
          borderRadius: '50%',
        }} />

        {/* Nairobi SVG Skyline */}
        <svg viewBox="0 0 800 420" style={{ width: '100%', position: 'relative', zIndex: 2 }} preserveAspectRatio="xMidYMax meet">

          {/* Sky glow */}
          <ellipse cx="400" cy="420" rx="350" ry="80" fill="rgba(29, 158, 117, 0.08)" />

          {/* KICC Tower (tallest, center) */}
          <rect x="370" y="120" width="60" height="280" fill="#162d3d" />
          <rect x="378" y="100" width="44" height="25" fill="#1a3547" />
          <rect x="385" y="85" width="30" height="18" fill="#1a3547" />
          <rect x="392" y="68" width="16" height="20" fill="#1a3547" />
          <line x1="400" y1="40" x2="400" y2="68" stroke="#2a5a4a" strokeWidth="2" />
          {/* KICC windows */}
          {[130, 150, 170, 190, 210, 230, 250, 270, 290, 310].map((y, i) => (
            <g key={i}>
              <rect x="378" y={y} width="8" height="12" fill={i % 3 === 0 ? '#1d9e75' : 'rgba(255,200,100,0.15)'} rx="1" />
              <rect x="392" y={y} width="8" height="12" fill={i % 4 === 0 ? '#1d9e75' : 'rgba(255,200,100,0.1)'} rx="1" />
              <rect x="414" y={y} width="8" height="12" fill={i % 5 === 0 ? 'rgba(255,200,100,0.3)' : 'rgba(255,200,100,0.1)'} rx="1" />
            </g>
          ))}

          {/* UAP Tower (left of center) */}
          <rect x="280" y="160" width="55" height="240" fill="#0f2233" />
          <rect x="288" y="145" width="39" height="18" fill="#132a40" />
          <polygon points="307,130 307,148 326,148" fill="#132a40" />
          {[170, 190, 210, 230, 250, 270, 290, 310].map((y, i) => (
            <g key={i}>
              <rect x="289" y={y} width="7" height="10" fill={i % 3 === 0 ? 'rgba(255,200,100,0.3)' : 'rgba(255,200,100,0.1)'} rx="1" />
              <rect x="302" y={y} width="7" height="10" fill={i % 4 === 0 ? 'rgba(255,200,100,0.25)' : 'rgba(100,150,255,0.1)'} rx="1" />
              <rect x="315" y={y} width="7" height="10" fill={i % 5 === 0 ? 'rgba(255,200,100,0.2)' : 'rgba(255,200,100,0.08)'} rx="1" />
            </g>
          ))}

          {/* Times Tower */}
          <rect x="450" y="175" width="50" height="225" fill="#122030" />
          <rect x="458" y="162" width="34" height="15" fill="#162840" />
          <rect x="463" y="150" width="24" height="14" fill="#162840" />
          <line x1="475" y1="130" x2="475" y2="150" stroke="#1d9e75" strokeWidth="2" opacity="0.6" />
          {[185, 205, 225, 245, 265, 285, 305].map((y, i) => (
            <g key={i}>
              <rect x="459" y={y} width="7" height="10" fill={i % 2 === 0 ? 'rgba(100,180,255,0.25)' : 'rgba(255,200,100,0.1)'} rx="1" />
              <rect x="472" y={y} width="7" height="10" fill={i % 3 === 0 ? 'rgba(255,200,100,0.3)' : 'rgba(100,180,255,0.08)'} rx="1" />
              <rect x="485" y={y} width="7" height="10" fill={i % 4 === 0 ? 'rgba(255,200,100,0.2)' : 'rgba(100,180,255,0.1)'} rx="1" />
            </g>
          ))}

          {/* Britam Tower */}
          <rect x="200" y="200" width="45" height="200" fill="#0e1f2e" />
          <polygon points="200,200 245,200 222,178" fill="#122840" />
          {[210, 230, 250, 270, 290, 310].map((y, i) => (
            <g key={i}>
              <rect x="206" y={y} width="6" height="9" fill={i % 3 === 0 ? 'rgba(255,200,100,0.3)' : 'rgba(255,200,100,0.1)'} rx="1" />
              <rect x="218" y={y} width="6" height="9" fill={i % 4 === 0 ? 'rgba(100,200,150,0.3)' : 'rgba(255,200,100,0.1)'} rx="1" />
              <rect x="230" y={y} width="6" height="9" fill={i % 2 === 0 ? 'rgba(255,200,100,0.2)' : 'rgba(100,180,255,0.1)'} rx="1" />
            </g>
          ))}

          {/* Smaller buildings right */}
          <rect x="520" y="220" width="40" height="180" fill="#0d1e2c" />
          {[228, 248, 268, 288, 308].map((y, i) => (
            <g key={i}>
              <rect x="526" y={y} width="6" height="9" fill={i % 3 === 0 ? 'rgba(255,200,100,0.25)' : 'rgba(255,200,100,0.08)'} rx="1" />
              <rect x="538" y={y} width="6" height="9" fill={i % 2 === 0 ? 'rgba(100,180,255,0.2)' : 'rgba(255,200,100,0.1)'} rx="1" />
            </g>
          ))}

          <rect x="570" y="240" width="55" height="160" fill="#0c1c28" />
          {[248, 268, 288, 308].map((y, i) => (
            <g key={i}>
              <rect x="577" y={y} width="8" height="10" fill={i % 2 === 0 ? 'rgba(255,200,100,0.2)' : 'rgba(100,180,255,0.12)'} rx="1" />
              <rect x="592" y={y} width="8" height="10" fill={i % 3 === 0 ? 'rgba(255,200,100,0.25)' : 'rgba(255,200,100,0.08)'} rx="1" />
              <rect x="607" y={y} width="8" height="10" fill={i % 4 === 0 ? 'rgba(100,200,150,0.2)' : 'rgba(255,200,100,0.1)'} rx="1" />
            </g>
          ))}

          {/* Far left buildings */}
          <rect x="100" y="240" width="50" height="160" fill="#0d1d2a" />
          <rect x="140" y="260" width="40" height="140" fill="#0c1c28" />
          {[248, 268, 288, 308].map((y, i) => (
            <g key={i}>
              <rect x="107" y={y} width="7" height="9" fill={i % 3 === 0 ? 'rgba(255,200,100,0.2)' : 'rgba(100,180,255,0.1)'} rx="1" />
              <rect x="120" y={y} width="7" height="9" fill={i % 4 === 0 ? 'rgba(255,200,100,0.25)' : 'rgba(255,200,100,0.08)'} rx="1" />
              <rect x="133" y={y} width="7" height="9" fill={i % 2 === 0 ? 'rgba(100,200,150,0.2)' : 'rgba(255,200,100,0.1)'} rx="1" />
            </g>
          ))}

          {/* Far right buildings */}
          <rect x="640" y="255" width="45" height="145" fill="#0c1b26" />
          <rect x="695" y="270" width="60" height="130" fill="#0d1d2a" />

          {/* Ground / road */}
          <rect x="0" y="395" width="800" height="30" fill="#08141d" />
          <rect x="0" y="398" width="800" height="2" fill="rgba(29,158,117,0.15)" />

          {/* Street lights glow */}
          {[120, 220, 320, 420, 520, 620, 720].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="395" x2={x} y2="370" stroke="#2a3a30" strokeWidth="1.5" />
              <ellipse cx={x} cy="368" rx="12" ry="4" fill="rgba(255, 220, 100, 0.12)" />
              <circle cx={x} cy="368" r="2" fill="rgba(255,220,100,0.6)" />
            </g>
          ))}

          {/* Nairobi label */}
          <text x="400" y="30" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="system-ui" letterSpacing="6">NAIROBI</text>
        </svg>

        {/* Overlay text */}
        <div style={{
          position: 'absolute', bottom: 48, left: 48, right: 48, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, background: '#1d9e75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14 }}>N</div>
            <span style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>NyumbaVerified</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 700, lineHeight: 1.3, margin: '0 0 8px' }}>
            Trusted housing<br />across Kenya 🇰🇪
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
            Verified landlords · Escrow protection · Zero fraud
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0d1117', padding: '40px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          <h1 style={{ color: 'white', fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 32px' }}>
            Sign in to your NyumbaVerified account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1d9e75'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1d9e75'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(220, 60, 60, 0.1)', border: '1px solid rgba(220,60,60,0.2)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                color: '#ff8080', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                background: loading ? 'rgba(29,158,117,0.5)' : '#1d9e75',
                color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, transform 0.1s',
                boxShadow: '0 4px 20px rgba(29,158,117,0.3)',
              }}
              onMouseEnter={e => !loading && (e.target.style.background = '#178a65')}
              onMouseLeave={e => !loading && (e.target.style.background = '#1d9e75')}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1d9e75', textDecoration: 'none', fontWeight: 500 }}>
              Create one free
            </Link>
          </p>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              {['🔒 Escrow protected', '✅ Verified landlords', '🇰🇪 Made for Kenya'].map(badge => (
                <span key={badge} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
