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

function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function useMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
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
  const [sRef, sInView] = useInView()
  const n1 = useCounter(2400, 2000, sInView)
  const n2 = useCounter(8500, 2200, sInView)
  const n3 = useCounter(99, 1800, sInView)
  const n4 = useCounter(12, 1500, sInView)
  const [hovered, setHovered] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const px = mobile ? '20px' : '48px'
  const sectionPad = mobile ? '64px 20px' : '88px 48px'

  const FEATURES = [
    { icon: '🪪', title: 'Identity Verification', desc: 'Every landlord uploads their national ID before listing. Know exactly who you\'re dealing with.', tag: 'KYC' },
    { icon: '🔒', title: 'Escrow Payments', desc: 'Viewing fees held safely until the viewing happens. Landlord no-show? Automatic full refund.', tag: 'Protected' },
    { icon: '⭐', title: 'Peer Reviews', desc: 'After every viewing both sides rate each other publicly. Accountability built in by design.', tag: 'Transparent' },
    { icon: '🚨', title: 'Fraud Response', desc: 'One-click fraud reporting. Instant suspension during investigation. Permanent bans confirmed.', tag: 'Enforced' },
    { icon: '🏠', title: 'Verified Listings', desc: 'Every property reviewed before going live. Photos, location, price — all verified.', tag: 'Curated' },
    { icon: '🌍', title: 'Pan-African', desc: 'Built for Kenya, expanding across Africa. One trusted platform for the continent.', tag: 'Global' },
  ]

  const COUNTRIES = [
    { flag: '🇰🇪', name: 'Kenya', live: true },
    { flag: '🇳🇬', name: 'Nigeria', live: false },
    { flag: '🇬🇭', name: 'Ghana', live: false },
    { flag: '🇿🇦', name: 'S. Africa', live: false },
    { flag: '🇹🇿', name: 'Tanzania', live: false },
    { flag: '🇺🇬', name: 'Uganda', live: false },
  ]

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111', background: '#fff', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: `0 ${px}`, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: G, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15 }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3, color: '#111' }}>NyumbaVerified</span>
          {!mobile && <span style={{ background: GL, color: GD, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, letterSpacing: 1.2 }}>GLOBAL</span>}
        </Link>

        {/* Desktop nav links */}
        {!mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#features" style={{ color: '#666', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Features</a>
            <a href="#how-it-works" style={{ color: '#666', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>How it works</a>
            <a href="#expand" style={{ color: '#666', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Expansion</a>
            <Link to="/login" style={{ color: '#444', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
            <Link to="/signup" style={{ background: G, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: `0 2px 10px rgba(29,158,117,0.25)` }}>Get started →</Link>
          </div>
        )}

        {/* Mobile hamburger */}
        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{ color: '#444', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            <Link to="/signup" style={{ background: G, color: '#fff', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>Sign up</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: mobile ? 90 : 110, paddingBottom: 0, background: 'linear-gradient(180deg, #f7fdf9 0%, #ffffff 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -120, width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(29,158,117,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', padding: `0 ${px}`, textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #d4eddf', borderRadius: 30, padding: '5px 14px 5px 8px', marginBottom: 24, boxShadow: '0 1px 4px rgba(29,158,117,0.1)' }}>
            <span style={{ background: G, borderRadius: 20, padding: '2px 8px', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>NEW</span>
            <span style={{ color: '#444', fontSize: 13, fontWeight: 500 }}>Now live across East Africa 🌍</span>
          </div>

          <h1 style={{ fontSize: mobile ? 36 : 'clamp(38px, 5vw, 58px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: mobile ? -1 : -1.5, margin: '0 0 18px', color: '#0a0a0a' }}>
            Find a home you can<br />
            <span style={{ backgroundImage: `linear-gradient(135deg, ${G} 0%, #0a8a60 60%, #085041 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              actually trust
            </span>
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: '#666', lineHeight: 1.75, maxWidth: 520, margin: `0 auto ${mobile ? '28px' : '36px'}`, fontWeight: 400 }}>
            Verified landlords. Escrow-protected payments. Zero fraud.
            The trusted housing platform built for Africa — and the world.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28, flexDirection: mobile ? 'column' : 'row', alignItems: 'center' }}>
            <Link to="/login?from=/listings" style={{ background: G, color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: `0 4px 18px rgba(29,158,117,0.3)`, width: mobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>Browse listings →</Link>
            <Link to="/signup" style={{ background: '#fff', color: '#222', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', border: '1px solid #e0e0e0', width: mobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>List your property</Link>
          </div>

          <div style={{ display: 'flex', gap: mobile ? 12 : 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: mobile ? 40 : 56 }}>
            {['✅ ID-verified', '🔒 Escrow-protected', '⭐ Rated & reviewed', '🌍 Pan-African'].map(b => (
              <span key={b} style={{ color: '#999', fontSize: 12, fontWeight: 500 }}>{b}</span>
            ))}
          </div>

          {/* Product preview — hidden on mobile to keep hero clean */}
          {!mobile && (
            <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', border: '1px solid #eee', borderBottom: 'none', boxShadow: '0 -4px 40px rgba(0,0,0,0.06)', overflow: 'hidden', maxWidth: 780, margin: '0 auto' }}>
              <div style={{ background: '#f5f5f5', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e8e8e8' }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, background: '#fff', borderRadius: 5, padding: '3px 12px', marginLeft: 8, fontSize: 11, color: '#bbb', textAlign: 'left' }}>nyumba-verified.vercel.app</div>
              </div>
              <div style={{ background: '#fafafa', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {[
                  { title: '2BR apartment, Kilimani', loc: 'Nairobi, Kenya', price: 'KSh 35,000/mo', emoji: '🏢', bg: '#f0faf6' },
                  { title: 'Luxury BnB, Westlands', loc: 'Nairobi, Kenya', price: 'KSh 8,500/night', emoji: '🛎️', bg: '#f5f0ff' },
                  { title: 'Modern studio, VI', loc: 'Lagos, Nigeria', price: '₦ 185,000/mo', emoji: '🏠', bg: '#fff8f0' },
                ].map((c, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
                    <div style={{ height: 72, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.emoji}</div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 11, color: '#111' }}>{c.title}</p>
                      <p style={{ margin: '0 0 6px', fontSize: 10, color: '#999' }}>📍 {c.loc}</p>
                      <p style={{ margin: 0, color: G, fontWeight: 700, fontSize: 11 }}>{c.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: GL, borderTop: '1px solid #d4eddf', borderBottom: '1px solid #d4eddf', padding: '11px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'slide 25s linear infinite' }}>
          {[...Array(4)].flatMap(() => ['🇰🇪 Nairobi','🇳🇬 Lagos','🇬🇭 Accra','🇿🇦 Johannesburg','🇹🇿 Dar es Salaam','🇺🇬 Kampala','🇰🇪 Mombasa','🇳🇬 Abuja','🌍 And growing']).map((c, i) => (
            <span key={i} style={{ color: GD, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>{c}</span>
          ))}
        </div>
        <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }`}</style>
      </div>

      {/* ── STATS ── */}
      <section ref={sRef} style={{ padding: sectionPad, background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#999', fontSize: 11, fontWeight: 600, letterSpacing: 2, marginBottom: 40, textTransform: 'uppercase' }}>Platform at a glance</p>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: mobile ? 1 : 2 }}>
            {[
              { val: n1.toLocaleString() + '+', label: 'Verified listings', sub: 'Active on platform' },
              { val: n2.toLocaleString() + '+', label: 'Registered users', sub: 'Across Africa' },
              { val: n3 + '%', label: 'Fraud prevention', sub: 'Success rate' },
              { val: n4 + '+', label: 'Cities covered', sub: 'And expanding' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: mobile ? '24px 12px' : '32px 16px', borderRight: (!mobile && i < 3) ? '1px solid #f0f0f0' : 'none', borderBottom: (mobile && i < 2) ? '1px solid #f0f0f0' : 'none' }}>
                <p style={{ fontSize: mobile ? 32 : 40, fontWeight: 800, color: G, margin: '0 0 6px', letterSpacing: -1 }}>{s.val}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 3px' }}>{s.label}</p>
                <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #e8e8e8 20%, #e8e8e8 80%, transparent)', margin: `0 ${px}` }} />

      {/* ── PROBLEM ── */}
      <section style={{ padding: sectionPad, background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 80, alignItems: 'center' }}>
            <div>
              <p style={{ color: '#c0392b', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>The Problem</p>
              <h2 style={{ fontSize: mobile ? 26 : 32, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.6, color: '#0a0a0a', margin: '0 0 16px' }}>House hunting in Africa is broken</h2>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>Millions of Africans lose money to fake agents every year. You pay a viewing fee, they disappear. No recourse. No protection.</p>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8 }}>We built NyumbaVerified to permanently fix this — with verified identities, escrow payments, and a trust layer that makes fraud nearly impossible.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '😤', title: 'Fake agents', desc: 'Pay a viewing fee. They vanish. No way to get it back.' },
                { icon: '😰', title: 'No accountability', desc: 'Fraudsters create new accounts and keep scamming people.' },
                { icon: '😓', title: 'No protection', desc: 'No escrow, no verification, no safety net of any kind.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 18px', background: '#fff9f9', borderRadius: 12, border: '1px solid #fde8e8' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
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
      <section id="features" style={{ padding: sectionPad, background: '#f8fffe' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Why NyumbaVerified</p>
            <h2 style={{ fontSize: mobile ? 26 : 32, fontWeight: 800, letterSpacing: -0.6, color: '#0a0a0a', margin: '0 0 10px' }}>Everything you need to trust the process</h2>
            <p style={{ color: '#777', fontSize: 14, maxWidth: 420, margin: '0 auto' }}>Six pillars that make NyumbaVerified the most trusted housing platform in Africa.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ background: '#fff', borderRadius: 14, padding: '22px 20px', border: `1px solid ${hovered === i ? '#c3e6d8' : '#ececec'}`, boxShadow: hovered === i ? '0 6px 24px rgba(29,158,117,0.1)' : '0 1px 4px rgba(0,0,0,0.03)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 26 }}>{f.icon}</span>
                  <span style={{ background: GL, color: GD, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>{f.tag}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111', margin: '0 0 7px', letterSpacing: -0.2 }}>{f.title}</h3>
                <p style={{ color: '#777', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: sectionPad, background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Process</p>
            <h2 style={{ fontSize: mobile ? 26 : 32, fontWeight: 800, letterSpacing: -0.6, color: '#0a0a0a', margin: '0 0 10px' }}>Up and running in minutes</h2>
            <p style={{ color: '#777', fontSize: 14, maxWidth: 360, margin: '0 auto' }}>Four simple steps to find or list your property safely.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 12 }}>
            {[
              { n: '01', title: 'Create account', desc: 'Sign up as tenant, landlord, or BnB host.' },
              { n: '02', title: 'Verify identity', desc: 'Upload your national ID to protect everyone.' },
              { n: '03', title: 'Find or list', desc: 'Browse verified listings or post your property.' },
              { n: '04', title: 'Book safely', desc: 'Pay into escrow — released after viewing.' },
            ].map(s => (
              <div key={s.n} style={{ padding: '20px 16px', background: '#f8fffe', borderRadius: 14, border: '1px solid #e8f5f0' }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: G, margin: '0 0 12px', letterSpacing: -1 }}>{s.n}</p>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR LANDLORDS ── */}
      <section style={{ padding: sectionPad, background: 'linear-gradient(135deg, #f7fdf9 0%, #edfaf3 100%)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 36 : 64, alignItems: 'center' }}>
          <div>
            <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>For landlords</p>
            <h2 style={{ fontSize: mobile ? 26 : 32, fontWeight: 800, letterSpacing: -0.6, color: '#0a0a0a', margin: '0 0 12px', lineHeight: 1.2 }}>List once.<br />Attract serious tenants.</h2>
            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>Post your property and get matched with verified, committed tenants — not time-wasters.</p>
            {['Free to list — no upfront costs', 'Only verified, serious tenants', 'Viewing fees ensure commitment', 'Build your reputation with reviews', 'Full dashboard to manage bookings'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                <div style={{ width: 18, height: 18, background: G, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, flexShrink: 0 }}>✓</div>
                <span style={{ color: '#444', fontSize: 14 }}>{item}</span>
              </div>
            ))}
            <Link to="/signup" style={{ display: 'inline-block', marginTop: 22, background: G, color: '#fff', fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none', boxShadow: `0 3px 14px rgba(29,158,117,0.3)` }}>List your property →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '🏠', t: 'Long-term rentals', d: 'Houses & apartments', bg: '#f0faf6' },
              { icon: '🛎️', t: 'BnB & Staycation', d: 'Short-stay units', bg: '#f5f0ff' },
              { icon: '📸', t: 'Rich listings', d: 'Photos & details', bg: '#fff8f0' },
              { icon: '📊', t: 'Booking analytics', d: 'Track everything', bg: '#f0f8ff' },
            ].map(c => (
              <div key={c.t} style={{ background: c.bg, borderRadius: 12, padding: '16px 14px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 24, margin: '0 0 8px' }}>{c.icon}</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111', margin: '0 0 3px' }}>{c.t}</p>
                <p style={{ color: '#999', fontSize: 12, margin: 0 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPANSION ── */}
      <section id="expand" style={{ padding: sectionPad, background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Expansion</p>
          <h2 style={{ fontSize: mobile ? 26 : 32, fontWeight: 800, letterSpacing: -0.6, color: '#0a0a0a', margin: '0 0 10px' }}>Starting in Kenya. Built for Africa.</h2>
          <p style={{ color: '#777', fontSize: 14, maxWidth: 420, margin: '0 auto 36px' }}>Our mission is to make housing trustworthy across every African city — and beyond.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {COUNTRIES.map(c => (
              <div key={c.name} style={{ background: c.live ? GL : '#fafafa', border: `1px solid ${c.live ? '#c3e6d8' : '#ebebeb'}`, borderRadius: 12, padding: mobile ? '12px 14px' : '14px 18px', textAlign: 'center', minWidth: 90 }}>
                <p style={{ fontSize: 26, margin: '0 0 5px' }}>{c.flag}</p>
                <p style={{ fontWeight: 700, fontSize: 12, color: '#111', margin: '0 0 3px' }}>{c.name}</p>
                <span style={{ fontSize: 9, fontWeight: 700, color: c.live ? GD : '#bbb', letterSpacing: 0.5 }}>{c.live ? '● LIVE' : '○ SOON'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: sectionPad, background: '#f8fffe' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 16, color: G }}>❝</div>
          <p style={{ fontSize: mobile ? 16 : 18, color: '#222', lineHeight: 1.7, fontWeight: 500, margin: '0 0 18px', fontStyle: 'italic' }}>
            "I paid KSh 1,500 to an agent who disappeared the same day. NyumbaVerified would have protected me — the escrow system is exactly what this market needs."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: GL, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: GD, fontSize: 13 }}>B</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#111', margin: 0 }}>Beryl W.</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Tenant, Nairobi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: sectionPad, background: '#0a0f0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ color: 'rgba(29,158,117,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Get started today</p>
          <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 800, color: '#fff', letterSpacing: -0.8, margin: '0 0 12px', lineHeight: 1.2 }}>Ready to find your next home safely?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 32 }}>Join thousands of Africans who trust NyumbaVerified.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', flexDirection: mobile ? 'column' : 'row', alignItems: 'center' }}>
            <Link to="/signup" style={{ background: G, color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 20px rgba(29,158,117,0.4)', width: mobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>Create free account →</Link>
            <Link to="/login?from=/listings" style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 500, fontSize: 15, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', width: mobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>Browse listings</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#080c0a', borderTop: '1px solid rgba(255,255,255,0.05)', padding: `24px ${px}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: G, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 11 }}>N</div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>NyumbaVerified — Trusted housing for Africa</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, margin: 0 }}>© 2026 · Zero fraud.</p>
      </footer>
    </div>
  )
}
