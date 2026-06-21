import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

const G = '#1d9e75'   // brand green
const GD = '#0f6e56'  // dark green
const GL = '#e8f5f0'  // light green tint

export default function Landing() {
  const [sRef, sInView] = useInView()
  const n1 = useCounter(2400, 2000, sInView)
  const n2 = useCounter(8500, 2200, sInView)
  const n3 = useCounter(99, 1800, sInView)
  const n4 = useCounter(12, 1500, sInView)
  const [hovered, setHovered] = useState(null)

  const FEATURES = [
    { icon: '🪪', title: 'Identity Verification', desc: 'Every landlord is verified with their national ID before listing. Know exactly who you\'re dealing with — always.', tag: 'KYC' },
    { icon: '🔒', title: 'Escrow Payments', desc: 'Viewing fees held safely until the viewing happens. Landlord no-show? Automatic full refund.', tag: 'Protected' },
    { icon: '⭐', title: 'Peer Reviews', desc: 'After every viewing both parties rate each other publicly. Accountability built in by design.', tag: 'Transparent' },
    { icon: '🚨', title: 'Fraud Response', desc: 'One-click fraud reporting. Instant account suspension during investigation. Permanent bans for confirmed fraudsters.', tag: 'Enforced' },
    { icon: '🏠', title: 'Verified Listings', desc: 'Every property reviewed before going live. Photos, location, price — all verified for accuracy.', tag: 'Curated' },
    { icon: '🌍', title: 'Pan-African', desc: 'Built for Kenya, expanding across Africa. One trusted platform for the entire continent.', tag: 'Global' },
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
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111', background: '#fff', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '0 48px', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, background: G, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15 }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.4 }}>NyumbaVerified</span>
          <span style={{ background: GL, color: GD, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, letterSpacing: 1.2, marginLeft: 2 }}>GLOBAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Features', 'How it works', 'Expand'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ color: '#666', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{item}</a>
          ))}
          <Link to="/login" style={{ color: '#444', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          <Link to="/signup" style={{ background: G, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: `0 2px 10px rgba(29,158,117,0.25)` }}>Get started →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 110, paddingBottom: 0, background: 'linear-gradient(180deg, #f7fdf9 0%, #ffffff 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Soft background mesh */}
        <div style={{ position: 'absolute', top: -80, right: -120, width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(29,158,117,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 200, left: -200, width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(29,158,117,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative' }}>
          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #d4eddf', borderRadius: 30, padding: '5px 14px 5px 8px', marginBottom: 28, boxShadow: '0 1px 4px rgba(29,158,117,0.1)' }}>
            <span style={{ background: G, borderRadius: 20, padding: '2px 8px', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>NEW</span>
            <span style={{ color: '#444', fontSize: 13, fontWeight: 500 }}>Now live across East Africa 🌍</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -1.5, margin: '0 0 20px', color: '#0a0a0a' }}>
            Find a home you can<br />
            <span style={{ backgroundImage: `linear-gradient(135deg, ${G} 0%, #0a8a60 60%, #085041 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              actually trust
            </span>
          </h1>

          <p style={{ fontSize: 17, color: '#666', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 36px', fontWeight: 400 }}>
            Verified landlords. Escrow-protected payments. Zero fraud.
            The trusted housing platform built for Africa — and the world.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            <Link to="/listings" style={{ background: G, color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: `0 4px 18px rgba(29,158,117,0.3)`, letterSpacing: -0.2 }}>Browse listings →</Link>
            <Link to="/signup" style={{ background: '#fff', color: '#222', fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', border: '1px solid #e0e0e0', letterSpacing: -0.2 }}>List your property</Link>
          </div>

          {/* Micro trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 56 }}>
            {['✅ ID-verified landlords', '🔒 Escrow-protected', '⭐ Rated & reviewed', '🌍 Pan-African'].map(b => (
              <span key={b} style={{ color: '#999', fontSize: 12, fontWeight: 500 }}>{b}</span>
            ))}
          </div>

          {/* Product screenshot */}
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', border: '1px solid #eee', borderBottom: 'none', boxShadow: '0 -4px 40px rgba(0,0,0,0.06)', overflow: 'hidden', maxWidth: 780, margin: '0 auto' }}>
            {/* Browser chrome */}
            <div style={{ background: '#f5f5f5', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e8e8e8' }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <div style={{ flex: 1, background: '#fff', borderRadius: 5, padding: '3px 12px', marginLeft: 8, fontSize: 11, color: '#bbb', textAlign: 'left' }}>nyumba-verified.vercel.app</div>
            </div>
            {/* Listings preview */}
            <div style={{ background: '#fafafa', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { title: '2BR apartment, Kilimani', loc: 'Nairobi, Kenya', price: 'KSh 35,000/mo', emoji: '🏢', bg: '#f0faf6', verified: true },
                { title: 'Luxury BnB, Westlands', loc: 'Nairobi, Kenya', price: 'KSh 8,500/night', emoji: '🛎️', bg: '#f5f0ff', verified: true },
                { title: 'Modern studio, VI', loc: 'Lagos, Nigeria', price: '₦ 185,000/mo', emoji: '🏠', bg: '#fff8f0', verified: false },
              ].map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #eee' }}>
                  <div style={{ height: 72, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.emoji}</div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 11, color: '#111', lineHeight: 1.3 }}>{c.title}</p>
                    <p style={{ margin: '0 0 6px', fontSize: 10, color: '#999' }}>📍 {c.loc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: G, fontWeight: 700, fontSize: 11 }}>{c.price}</span>
                      {c.verified && <span style={{ fontSize: 9, color: GD, background: GL, padding: '1px 5px', borderRadius: 8, fontWeight: 600 }}>✓ Verified</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ background: GL, borderTop: '1px solid #d4eddf', borderBottom: '1px solid #d4eddf', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'slide 25s linear infinite' }}>
          {[...Array(4)].flatMap(() => ['🇰🇪 Nairobi', '🇳🇬 Lagos', '🇬🇭 Accra', '🇿🇦 Johannesburg', '🇹🇿 Dar es Salaam', '🇺🇬 Kampala', '🇰🇪 Mombasa', '🇳🇬 Abuja', '🌍 And growing']).map((c, i) => (
            <span key={i} style={{ color: GD, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>{c}</span>
          ))}
        </div>
        <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }`}</style>
      </div>

      {/* ── STATS ── */}
      <section ref={sRef} id="stats" style={{ padding: '80px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#999', fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 48, textTransform: 'uppercase' }}>Platform at a glance</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {[
              { val: n1.toLocaleString() + '+', label: 'Verified listings', sub: 'Active on platform' },
              { val: n2.toLocaleString() + '+', label: 'Registered users', sub: 'Across Africa' },
              { val: n3 + '%', label: 'Fraud prevention', sub: 'Success rate' },
              { val: n4 + '+', label: 'Cities covered', sub: 'And expanding' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 16px', borderRight: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
                <p style={{ fontSize: 40, fontWeight: 800, color: G, margin: '0 0 6px', letterSpacing: -1.5 }}>{s.val}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 3px' }}>{s.label}</p>
                <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #e8e8e8 20%, #e8e8e8 80%, transparent)', margin: '0 48px' }} />

      {/* ── PROBLEM ── */}
      <section style={{ padding: '88px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <p style={{ color: '#c0392b', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>The Problem</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 18px' }}>
                House hunting in Africa is broken
              </h2>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Millions of Africans lose money to fake agents every year. You pay a viewing fee, they disappear. No recourse. No protection. No accountability.
              </p>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: 0 }}>
                We built NyumbaVerified to permanently fix this — with verified identities, escrow payments, and a trust layer that makes fraud nearly impossible.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '😤', title: 'Fake agents', desc: 'Pay a viewing fee. They vanish. No way to get it back.' },
                { icon: '😰', title: 'No accountability', desc: 'Fraudsters create new accounts and keep scamming people.' },
                { icon: '😓', title: 'No protection', desc: 'No escrow, no verification, no safety net of any kind.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 20px', background: '#fff9f9', borderRadius: 12, border: '1px solid #fde8e8' }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '88px 48px', background: '#f8fffe' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Why NyumbaVerified</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 12px' }}>Everything you need to trust the process</h2>
            <p style={{ color: '#777', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>Six pillars that make NyumbaVerified the most trusted housing platform in Africa.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: '#fff', borderRadius: 14, padding: '24px 22px',
                  border: `1px solid ${hovered === i ? '#c3e6d8' : '#ececec'}`,
                  boxShadow: hovered === i ? '0 6px 24px rgba(29,158,117,0.1)' : '0 1px 4px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s', cursor: 'default',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{f.icon}</span>
                  <span style={{ background: GL, color: GD, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, letterSpacing: 0.5 }}>{f.tag}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111', margin: '0 0 8px', letterSpacing: -0.3 }}>{f.title}</h3>
                <p style={{ color: '#777', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '88px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Process</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 12px' }}>Up and running in minutes</h2>
            <p style={{ color: '#777', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>Four simple steps to find or list your property safely.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { n: '01', title: 'Create account', desc: 'Sign up as tenant, landlord, or BnB host in under 2 minutes.' },
              { n: '02', title: 'Verify identity', desc: 'Upload your national ID. This protects everyone on the platform.' },
              { n: '03', title: 'Find or list', desc: 'Browse verified listings or post your property for review.' },
              { n: '04', title: 'Book safely', desc: 'Pay into escrow — released only when the viewing is confirmed.' },
            ].map((s, i) => (
              <div key={s.n} style={{ padding: '22px 18px', background: '#f8fffe', borderRadius: 14, border: '1px solid #e8f5f0', position: 'relative' }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: G, margin: '0 0 14px', letterSpacing: -1 }}>{s.n}</p>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 8px', letterSpacing: -0.2 }}>{s.title}</h3>
                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR LANDLORDS ── */}
      <section style={{ padding: '88px 48px', background: 'linear-gradient(135deg, #f7fdf9 0%, #edfaf3 100%)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>For landlords</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 14px', lineHeight: 1.2 }}>List once.<br />Attract serious tenants.</h2>
            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: 22 }}>Post your property and get matched with verified, committed tenants — not time-wasters.</p>
            {['Free to list — no upfront costs', 'Only verified, serious tenants', 'Viewing fees ensure commitment', 'Build your reputation with reviews', 'Full dashboard to manage bookings'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <div style={{ width: 18, height: 18, background: G, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, flexShrink: 0 }}>✓</div>
                <span style={{ color: '#444', fontSize: 14 }}>{item}</span>
              </div>
            ))}
            <Link to="/signup" style={{ display: 'inline-block', marginTop: 24, background: G, color: '#fff', fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 9, textDecoration: 'none', boxShadow: `0 3px 14px rgba(29,158,117,0.3)` }}>List your property →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '🏠', t: 'Long-term rentals', d: 'Houses & apartments', bg: '#f0faf6' },
              { icon: '🛎️', t: 'BnB & Staycation', d: 'Short-stay units', bg: '#f5f0ff' },
              { icon: '📸', t: 'Rich listings', d: 'Photos & details', bg: '#fff8f0' },
              { icon: '📊', t: 'Booking analytics', d: 'Track everything', bg: '#f0f8ff' },
            ].map(c => (
              <div key={c.t} style={{ background: c.bg, borderRadius: 12, padding: '18px 14px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 26, margin: '0 0 8px' }}>{c.icon}</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111', margin: '0 0 3px' }}>{c.t}</p>
                <p style={{ color: '#999', fontSize: 12, margin: 0 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPANSION ── */}
      <section id="expand" style={{ padding: '88px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: GD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Expansion</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: '#0a0a0a', margin: '0 0 12px' }}>Starting in Kenya. Built for Africa.</h2>
          <p style={{ color: '#777', fontSize: 15, maxWidth: 460, margin: '0 auto 44px' }}>Our mission is to make housing trustworthy across every African city — and then the world.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {COUNTRIES.map(c => (
              <div key={c.name} style={{
                background: c.live ? GL : '#fafafa',
                border: `1px solid ${c.live ? '#c3e6d8' : '#ebebeb'}`,
                borderRadius: 12, padding: '14px 18px', textAlign: 'center', minWidth: 100,
              }}>
                <p style={{ fontSize: 28, margin: '0 0 6px' }}>{c.flag}</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#111', margin: '0 0 4px' }}>{c.name}</p>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.live ? GD : '#bbb', letterSpacing: 0.5 }}>{c.live ? '● LIVE' : '○ SOON'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: '80px 48px', background: '#f8fffe' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 20, color: G }}>❝</div>
          <p style={{ fontSize: 18, color: '#222', lineHeight: 1.7, fontWeight: 500, margin: '0 0 20px', fontStyle: 'italic' }}>
            "I paid KSh 1,500 to an agent who disappeared the same day. NyumbaVerified would have protected me — the escrow system is exactly what this market needs."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: GL, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: GD, fontSize: 14 }}>B</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#111', margin: 0 }}>Beryl W.</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>Tenant, Nairobi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '88px 48px', background: '#0a0f0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ color: 'rgba(29,158,117,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Get started today</p>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -1, margin: '0 0 14px', lineHeight: 1.2 }}>
            Ready to find your<br />next home safely?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 36 }}>Join thousands of Africans who trust NyumbaVerified to find safe, verified homes.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ background: G, color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 20px rgba(29,158,117,0.4)' }}>Create free account →</Link>
            <Link to="/listings" style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 500, fontSize: 15, padding: '13px 30px', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>Browse listings</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#080c0a', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, background: G, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 12 }}>N</div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>NyumbaVerified — Trusted housing for Africa</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, margin: 0 }}>© 2026 · Zero fraud. Zero compromise.</p>
      </footer>
    </div>
  )
}
