import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let s = null
    const step = (ts) => {
      if (!s) s = ts
      const p = Math.min((ts - s) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useMobile() {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

const G = '#1d9e75'
const GD = '#0f6e56'
const GL = '#e8f5f0'

export default function Landing() {
  const mobile = useMobile()
  const [statsRef, statsInView] = useInView()
  const [featRef, featInView] = useInView()
  const n1 = useCounter(2400, 2000, statsInView)
  const n2 = useCounter(8500, 2200, statsInView)
  const n3 = useCounter(99, 1800, statsInView)
  const n4 = useCounter(12, 1500, statsInView)
  const [hovered, setHovered] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  const px = mobile ? '20px' : '48px'
  const maxW = '900px'

  // Auto-cycle through steps
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000)
    return () => clearInterval(t)
  }, [])

  const FEATURES = [
    {
      icon: '🪪',
      title: 'Identity Verification',
      desc: 'Every landlord uploads their national ID before listing. You always know who you\'re dealing with — no ghosts, no fakes.',
      tag: 'KYC',
      gradient: 'linear-gradient(135deg, #e8f5f0 0%, #d0ede3 100%)',
      iconBg: '#1d9e75',
    },
    {
      icon: '🔒',
      title: 'Escrow Payments',
      desc: 'Your viewing fee is held safely until the viewing happens. Landlord no-show? You get a full automatic refund.',
      tag: 'Protected',
      gradient: 'linear-gradient(135deg, #eef3ff 0%, #dce8ff 100%)',
      iconBg: '#3b5bdb',
    },
    {
      icon: '⭐',
      title: 'Peer Reviews',
      desc: 'After every viewing both sides rate each other publicly. Bad actors are exposed fast. Good landlords rise to the top.',
      tag: 'Transparent',
      gradient: 'linear-gradient(135deg, #fff8e1 0%, #ffeebb 100%)',
      iconBg: '#e67700',
    },
    {
      icon: '🚨',
      title: 'Fraud Response',
      desc: 'One tap to report. Instant account suspension while we investigate. Confirmed fraudsters are permanently banned.',
      tag: 'Enforced',
      gradient: 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)',
      iconBg: '#c92a2a',
    },
    {
      icon: '🏠',
      title: 'Verified Listings',
      desc: 'Every property is reviewed before going live. Photos, price and location — all checked for accuracy.',
      tag: 'Curated',
      gradient: 'linear-gradient(135deg, #f3fff3 0%, #dcf5dc 100%)',
      iconBg: '#2f9e44',
    },
    {
      icon: '🌍',
      title: 'Pan-African',
      desc: 'Built for Kenya, expanding across Africa. One trusted platform for the entire continent and beyond.',
      tag: 'Global',
      gradient: 'linear-gradient(135deg, #f8f0ff 0%, #ecdcff 100%)',
      iconBg: '#7048e8',
    },
  ]

  const STEPS = [
    { n: '01', icon: '👤', title: 'Create account', desc: 'Sign up in under 2 minutes as tenant, landlord, or BnB host.' },
    { n: '02', icon: '🪪', title: 'Verify identity', desc: 'Upload your national ID. This one step protects everyone on the platform.' },
    { n: '03', icon: '🔍', title: 'Find or list', desc: 'Browse verified listings or post your property for review.' },
    { n: '04', icon: '🔒', title: 'Book safely', desc: 'Pay into escrow. Released only when the viewing is confirmed.' },
  ]

  const COUNTRIES = [
    { flag: '🇰🇪', name: 'Kenya', live: true },
    { flag: '🇳🇬', name: 'Nigeria', live: false },
    { flag: '🇬🇭', name: 'Ghana', live: false },
    { flag: '🇿🇦', name: 'S. Africa', live: false },
    { flag: '🇹🇿', name: 'Tanzania', live: false },
    { flag: '🇺🇬', name: 'Uganda', live: false },
  ]

  const LISTINGS = [
    { title: '2BR Apartment, Kilimani', loc: 'Nairobi, Kenya', price: 'KSh 35,000', per: '/mo', type: 'Rental', emoji: '🏢', bg: 'linear-gradient(135deg, #e8f5f0, #d0ede3)', verified: true, rating: 4.9 },
    { title: 'Luxury BnB, Westlands', loc: 'Nairobi, Kenya', price: 'KSh 8,500', per: '/night', type: 'BnB', emoji: '🛎️', bg: 'linear-gradient(135deg, #f0eeff, #e0d0ff)', verified: true, rating: 4.8 },
    { title: 'Studio Apartment, VI', loc: 'Lagos, Nigeria', price: '₦ 185,000', per: '/mo', type: 'Rental', emoji: '🏙️', bg: 'linear-gradient(135deg, #fff8e1, #ffeebb)', verified: false, rating: 4.7 },
  ]

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111', background: '#fff', overflowX: 'hidden' }}>

      {/* Global CSS */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important; }
        .card-hover:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(29,158,117,0.15) !important; border-color: #c3e6d8 !important; }
        .btn-primary { transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease !important; }
        .btn-primary:hover { transform: translateY(-1px) !important; box-shadow: 0 6px 24px rgba(29,158,117,0.45) !important; background: #189a6e !important; }
        .btn-secondary:hover { background: #f5f5f5 !important; }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: `0 ${px}`, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16, boxShadow: '0 2px 8px rgba(29,158,117,0.3)' }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.4, color: '#0a0a0a' }}>NyumbaVerified</span>
          {!mobile && <span style={{ background: GL, color: GD, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: 1.2, border: `1px solid ${G}30` }}>GLOBAL</span>}
        </Link>

        {!mobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#expand', 'Expansion']].map(([href, label]) => (
              <a key={href} href={href} style={{ color: '#555', fontSize: 14, textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = G} onMouseLeave={e => e.target.style.color = '#555'}>{label}</a>
            ))}
            <Link to="/login" style={{ color: '#444', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            <Link to="/signup" className="btn-primary" style={{ background: G, color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 12px rgba(29,158,117,0.3)' }}>Get started →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" style={{ color: '#444', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            <Link to="/signup" style={{ background: G, color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 9, textDecoration: 'none' }}>Sign up</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: mobile ? 88 : 108, paddingBottom: 0, background: 'linear-gradient(175deg, #f3fdf7 0%, #eaf9f2 40%, #fff 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -100, right: -150, width: 700, height: 700, background: 'radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 300, left: -200, width: 500, height: 500, background: 'radial-gradient(circle, rgba(29,158,117,0.05) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' }} />

        <div style={{ maxWidth: maxW, margin: '0 auto', padding: `0 ${px}`, textAlign: 'center', position: 'relative', animation: 'fadeUp 0.7s ease both' }}>

          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.9)', border: '1px solid #c8e6d4', borderRadius: 30, padding: '6px 16px 6px 8px', marginBottom: 28, boxShadow: '0 2px 12px rgba(29,158,117,0.12)', backdropFilter: 'blur(8px)' }}>
            <span style={{ background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 20, padding: '2px 10px', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.8 }}>NEW</span>
            <span style={{ color: '#333', fontSize: 13, fontWeight: 500 }}>Now live across East Africa</span>
            <span style={{ width: 7, height: 7, background: G, borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: mobile ? 38 : 62, fontWeight: 900, lineHeight: 1.08, letterSpacing: mobile ? -1.2 : -2.5, margin: '0 0 20px', color: '#0a0a0a' }}>
            Find a home you can<br />
            <span style={{ background: `linear-gradient(135deg, ${G} 0%, #0a8a60 50%, ${GD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              actually trust
            </span>
          </h1>

          <p style={{ fontSize: mobile ? 16 : 18, color: '#555', lineHeight: 1.75, maxWidth: 540, margin: `0 auto ${mobile ? '28px' : '36px'}`, fontWeight: 400 }}>
            Verified landlords. Escrow-protected payments. Zero fraud.
            The trusted housing platform built for Africa — and the world.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32, flexDirection: mobile ? 'column' : 'row', alignItems: 'center' }}>
            <Link to="/login?from=/listings" className="btn-primary" style={{ background: G, color: '#fff', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 20px rgba(29,158,117,0.35)', width: mobile ? '100%' : 'auto', textAlign: 'center', display: 'inline-block' }}>
              Browse listings →
            </Link>
            <Link to="/signup" className="btn-secondary" style={{ background: '#fff', color: '#222', fontWeight: 600, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid #e8e8e8', width: mobile ? '100%' : 'auto', textAlign: 'center', display: 'inline-block', transition: 'background 0.15s' }}>
              List your property
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: mobile ? 14 : 28, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
            {['✅ ID-verified landlords', '🔒 Escrow-protected', '⭐ Rated & reviewed', '🌍 Pan-African'].map(b => (
              <span key={b} style={{ color: '#999', fontSize: 12, fontWeight: 500 }}>{b}</span>
            ))}
          </div>

          {/* Hero listing cards — beautiful preview */}
          {!mobile && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 820, margin: '0 auto', textAlign: 'left' }}>
              {LISTINGS.map((l, i) => (
                <div key={i} className="card-hover" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #ebebeb', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', cursor: 'pointer', animation: `fadeUp 0.6s ease ${i * 0.1 + 0.3}s both` }}>
                  {/* Card image area */}
                  <div style={{ height: 100, background: l.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, position: 'relative' }}>
                    {l.emoji}
                    <span style={{ position: 'absolute', top: 10, right: 10, background: l.type === 'BnB' ? '#7048e8' : G, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>{l.type}</span>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 13, color: '#111', lineHeight: 1.3 }}>{l.title}</p>
                    <p style={{ margin: '0 0 10px', fontSize: 11, color: '#999' }}>📍 {l.loc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <span style={{ color: G, fontWeight: 800, fontSize: 15 }}>{l.price}</span>
                        <span style={{ color: '#bbb', fontSize: 11 }}>{l.per}</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#666' }}>⭐ {l.rating}</span>
                    </div>
                    {l.verified && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', background: GL, borderRadius: 8 }}>
                        <span style={{ fontSize: 10 }}>✅</span>
                        <span style={{ fontSize: 10, color: GD, fontWeight: 600 }}>Verified landlord</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: `linear-gradient(90deg, ${GL}, #d8f0e6, ${GL})`, borderTop: `1px solid ${G}25`, borderBottom: `1px solid ${G}25`, padding: '12px 0', overflow: 'hidden', marginTop: mobile ? 40 : 0 }}>
        <div style={{ display: 'flex', gap: 56, whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
          {[...Array(3)].flatMap(() => ['🇰🇪 Nairobi', '🇳🇬 Lagos', '🇬🇭 Accra', '🇿🇦 Johannesburg', '🇹🇿 Dar es Salaam', '🇺🇬 Kampala', '🇰🇪 Mombasa', '🇳🇬 Abuja', '🇸🇳 Dakar', '🌍 And growing']).map((c, i) => (
            <span key={i} style={{ color: GD, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: mobile ? '56px 20px' : '72px 48px', background: '#fff' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: 11, fontWeight: 700, letterSpacing: 2.5, marginBottom: 48, textTransform: 'uppercase' }}>Platform at a glance</p>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 0 }}>
            {[
              { val: n1.toLocaleString() + '+', label: 'Verified listings', sub: 'Active on platform', icon: '🏠' },
              { val: n2.toLocaleString() + '+', label: 'Registered users', sub: 'Across Africa', icon: '👥' },
              { val: n3 + '%', label: 'Fraud prevention', sub: 'Success rate', icon: '🛡️' },
              { val: n4 + '+', label: 'Cities covered', sub: 'And expanding', icon: '🌍' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: mobile ? '24px 12px' : '28px 24px', borderRight: (!mobile && i < 3) ? '1px solid #f0f0f0' : 'none', borderBottom: (mobile && i < 2) ? '1px solid #f0f0f0' : 'none', position: 'relative' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <p style={{ fontSize: mobile ? 34 : 44, fontWeight: 900, color: G, margin: '0 0 6px', letterSpacing: -1.5, lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: '0 0 3px' }}>{s.label}</p>
                <p style={{ fontSize: 11, color: '#bbb', margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #e0e0e0 30%, #e0e0e0 70%, transparent)', margin: `0 ${px}` }} />

      {/* ── PROBLEM ── */}
      <section style={{ padding: mobile ? '64px 20px' : '88px 48px', background: '#fff' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 72, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: '#fff0f0', color: '#c92a2a', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase', border: '1px solid #fdd' }}>The Problem</div>
              <h2 style={{ fontSize: mobile ? 28 : 34, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 16px' }}>
                House hunting in Africa is broken
              </h2>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.85, marginBottom: 16 }}>
                Millions of Africans lose money to fake agents every year. You pay a viewing fee, they disappear. No recourse. No protection.
              </p>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.85 }}>
                We built NyumbaVerified to permanently fix this — with verified identities, escrow payments, and a trust layer that makes fraud nearly impossible.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '😤', title: 'Fake agents', desc: 'Pay a viewing fee. They vanish with your money.', color: '#fff5f5', border: '#fdd' },
                { icon: '😰', title: 'No accountability', desc: 'Fraudsters create new accounts and keep scamming.', color: '#fff9f0', border: '#fde' },
                { icon: '😓', title: 'Zero protection', desc: 'No escrow, no verification, no safety net.', color: '#fff5f5', border: '#fdd' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '18px 20px', background: item.color, borderRadius: 14, border: `1px solid ${item.border}`, transition: 'transform 0.2s' }}>
                  <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>{item.icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 3px' }}>{item.title}</p>
                    <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: mobile ? '64px 20px' : '88px 48px', background: 'linear-gradient(180deg, #f8fffe 0%, #f3fdf7 100%)' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: GL, color: GD, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase', border: `1px solid ${G}30` }}>Why NyumbaVerified</div>
            <h2 style={{ fontSize: mobile ? 28 : 34, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 12px' }}>
              Everything you need to trust the process
            </h2>
            <p style={{ color: '#777', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>
              Six layers of protection that make NyumbaVerified the safest way to find a home in Africa.
            </p>
          </div>
          <div ref={featRef} style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card-hover"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${hovered === i ? '#c3e6d8' : '#ebebeb'}`, boxShadow: hovered === i ? '0 12px 40px rgba(29,158,117,0.12)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.25s', cursor: 'default', animation: featInView ? `fadeUp 0.5s ease ${i * 0.08}s both` : 'none' }}>
                {/* Gradient top strip */}
                <div style={{ height: 6, background: f.gradient }} />
                <div style={{ padding: '22px 22px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 46, height: 46, background: f.iconBg + '15', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{f.icon}</div>
                    <span style={{ background: f.gradient, color: '#555', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: 0.5, border: '1px solid rgba(0,0,0,0.06)' }}>{f.tag}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0a0a0a', margin: '0 0 8px', letterSpacing: -0.3 }}>{f.title}</h3>
                  <p style={{ color: '#777', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: mobile ? '64px 20px' : '88px 48px', background: '#fff' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: GL, color: GD, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase', border: `1px solid ${G}30` }}>Process</div>
            <h2 style={{ fontSize: mobile ? 28 : 34, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 12px' }}>Up and running in minutes</h2>
            <p style={{ color: '#777', fontSize: 15, maxWidth: 380, margin: '0 auto' }}>Four simple steps to find or list your property safely.</p>
          </div>

          {mobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '18px 20px', background: i === activeStep ? GL : '#fafafa', borderRadius: 14, border: `1px solid ${i === activeStep ? '#c3e6d8' : '#ebebeb'}`, transition: 'all 0.3s' }}>
                  <div style={{ width: 44, height: 44, background: i === activeStep ? G : '#eee', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transition: 'all 0.3s' }}>{s.icon}</div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 13, color: G, margin: '0 0 2px', letterSpacing: 1 }}>{s.n}</p>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 4px' }}>{s.title}</p>
                    <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, position: 'relative' }}>
              {/* Connector line */}
              <div style={{ position: 'absolute', top: 52, left: '12.5%', right: '12.5%', height: 2, background: `linear-gradient(90deg, ${G}40, ${G}40)`, backgroundSize: '8px 2px', backgroundRepeat: 'repeat-x', zIndex: 0 }} />
              {STEPS.map((s, i) => (
                <div key={i} className="card-hover"
                  onMouseEnter={() => setActiveStep(i)}
                  style={{ padding: '28px 20px 24px', background: activeStep === i ? GL : '#fafafa', borderRadius: 16, border: `1.5px solid ${activeStep === i ? '#b8dfd0' : '#ebebeb'}`, boxShadow: activeStep === i ? '0 8px 28px rgba(29,158,117,0.12)' : '0 2px 6px rgba(0,0,0,0.04)', transition: 'all 0.25s', position: 'relative', zIndex: 1, cursor: 'default' }}>
                  <div style={{ width: 48, height: 48, background: activeStep === i ? G : '#e0e0e0', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16, transition: 'all 0.25s', boxShadow: activeStep === i ? '0 4px 14px rgba(29,158,117,0.3)' : 'none' }}>{s.icon}</div>
                  <p style={{ fontSize: 24, fontWeight: 900, color: activeStep === i ? G : '#ccc', margin: '0 0 10px', letterSpacing: -1, transition: 'color 0.25s' }}>{s.n}</p>
                  <h3 style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 7px', letterSpacing: -0.2 }}>{s.title}</h3>
                  <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOR LANDLORDS ── */}
      <section style={{ padding: mobile ? '64px 20px' : '88px 48px', background: 'linear-gradient(135deg, #f7fdf9 0%, #edfaf3 100%)' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 72, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: GL, color: GD, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase', border: `1px solid ${G}30` }}>For landlords</div>
            <h2 style={{ fontSize: mobile ? 28 : 34, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 14px', lineHeight: 1.2 }}>List once.<br />Attract serious tenants.</h2>
            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.85, marginBottom: 22 }}>Post your property and connect with verified, committed tenants. No time-wasters. No fake enquiries.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['Free to list — no upfront costs', 'Only verified, serious tenants', 'Viewing fees ensure tenant commitment', 'Build your reputation with reviews', 'Full dashboard to manage bookings'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, background: G, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, flexShrink: 0, boxShadow: '0 2px 6px rgba(29,158,117,0.3)' }}>✓</div>
                  <span style={{ color: '#444', fontSize: 14, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
            <Link to="/signup" className="btn-primary" style={{ display: 'inline-block', background: G, color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 26px', borderRadius: 11, textDecoration: 'none', boxShadow: '0 4px 16px rgba(29,158,117,0.35)' }}>List your property →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: '🏠', t: 'Long-term rentals', d: 'Houses & apartments', bg: '#f0faf6', accent: G },
              { icon: '🛎️', t: 'BnB & Staycation', d: 'Short-stay units', bg: '#f5f0ff', accent: '#7048e8' },
              { icon: '📸', t: 'Rich listings', d: 'Photos & details', bg: '#fff8f0', accent: '#e67700' },
              { icon: '📊', t: 'Analytics', d: 'Track bookings', bg: '#f0f8ff', accent: '#1971c2' },
            ].map(c => (
              <div key={c.t} className="card-hover" style={{ background: c.bg, borderRadius: 16, padding: '20px 16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{c.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111', margin: '0 0 4px' }}>{c.t}</p>
                <p style={{ color: '#999', fontSize: 12, margin: 0 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPANSION ── */}
      <section id="expand" style={{ padding: mobile ? '64px 20px' : '88px 48px', background: '#fff' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: GL, color: GD, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase', border: `1px solid ${G}30` }}>Expansion</div>
          <h2 style={{ fontSize: mobile ? 28 : 34, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 12px' }}>Starting in Kenya. Built for Africa.</h2>
          <p style={{ color: '#777', fontSize: 15, maxWidth: 440, margin: '0 auto 44px' }}>Our mission is to make housing trustworthy across every African city — and then the world.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {COUNTRIES.map(c => (
              <div key={c.name} className="card-hover" style={{ background: c.live ? GL : '#fafafa', border: `1.5px solid ${c.live ? '#b8dfd0' : '#e8e8e8'}`, borderRadius: 16, padding: mobile ? '16px 14px' : '20px 22px', textAlign: 'center', minWidth: 100, boxShadow: c.live ? '0 4px 16px rgba(29,158,117,0.12)' : '0 2px 6px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 30, margin: '0 0 8px', animation: c.live ? 'float 3s ease-in-out infinite' : 'none' }}>{c.flag}</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111', margin: '0 0 5px' }}>{c.name}</p>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: c.live ? '#fff' : '#bbb', background: c.live ? G : 'transparent', padding: c.live ? '2px 8px' : '0', borderRadius: 20, letterSpacing: 0.5 }}>{c.live ? '● LIVE' : '○ SOON'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: mobile ? '64px 20px' : '80px 48px', background: 'linear-gradient(135deg, #f8fffe 0%, #f0faf6 100%)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 24px', boxShadow: '0 4px 16px rgba(29,158,117,0.3)' }}>❝</div>
          <p style={{ fontSize: mobile ? 17 : 20, color: '#222', lineHeight: 1.75, fontWeight: 500, margin: '0 0 24px', fontStyle: 'italic' }}>
            "I paid KSh 1,500 to an agent who disappeared the same day. NyumbaVerified would have protected me — the escrow system is exactly what this market needs."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, boxShadow: '0 3px 10px rgba(29,158,117,0.3)' }}>B</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: 0 }}>Beryl W.</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Tenant, Nairobi 🇰🇪</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: mobile ? '72px 20px' : '96px 48px', background: '#05100a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(29,158,117,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${G}40, transparent)` }} />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', background: `${G}20`, color: G, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 20, textTransform: 'uppercase', border: `1px solid ${G}30` }}>Get started today</div>
          <h2 style={{ fontSize: mobile ? 30 : 42, fontWeight: 900, color: '#fff', letterSpacing: mobile ? -0.8 : -1.5, margin: '0 0 14px', lineHeight: 1.15 }}>
            Ready to find your<br />
            <span style={{ background: `linear-gradient(135deg, ${G}, #0ab87a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              next home safely?
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of Africans who trust NyumbaVerified<br />to find safe, verified homes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', flexDirection: mobile ? 'column' : 'row', alignItems: 'center' }}>
            <Link to="/signup" className="btn-primary" style={{ background: G, color: '#fff', fontWeight: 700, fontSize: 16, padding: '15px 34px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 24px rgba(29,158,117,0.45)', width: mobile ? '100%' : 'auto', textAlign: 'center', display: 'inline-block' }}>Create free account →</Link>
            <Link to="/login?from=/listings" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: 15, padding: '15px 34px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', width: mobile ? '100%' : 'auto', textAlign: 'center', display: 'inline-block', transition: 'background 0.2s' }}>Browse listings</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#040a06', borderTop: '1px solid rgba(255,255,255,0.05)', padding: `24px ${px}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 12 }}>N</div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>NyumbaVerified — Trusted housing for Africa</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, margin: 0 }}>© 2026 · Zero fraud. Zero compromise.</p>
      </footer>
    </div>
  )
}
