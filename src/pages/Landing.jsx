import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function Landing() {
  const [statsRef, statsInView] = useInView()
  const listingsCount = useCounter(2400, 2000, statsInView)
  const usersCount = useCounter(8500, 2200, statsInView)
  const fraudsCount = useCounter(99, 1800, statsInView)
  const citiesCount = useCounter(12, 1500, statsInView)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ background: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: '#1d9e75', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: 'white', fontSize: 16,
          }}>N</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#111', letterSpacing: -0.3 }}>NyumbaVerified</span>
          <span style={{
            background: '#e8f5f0', color: '#0f6e56', fontSize: 10,
            fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: 1,
          }}>GLOBAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ color: '#555', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#how" style={{ color: '#555', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>How it works</a>
          <a href="#stats" style={{ color: '#555', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>About</a>
          <Link to="/login" style={{ color: '#555', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          <Link to="/signup" style={{
            background: '#1d9e75', color: 'white', fontSize: 14,
            fontWeight: 600, padding: '9px 20px', borderRadius: 10,
            textDecoration: 'none', boxShadow: '0 2px 12px rgba(29,158,117,0.3)',
          }}>Get started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 32, paddingRight: 32, position: 'relative', overflow: 'hidden' }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: 60, right: -100, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 200, left: -150, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(29,158,117,0.05) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#f0faf6', border: '1px solid #c3e6d8',
            borderRadius: 30, padding: '6px 16px', marginBottom: 32,
          }}>
            <span style={{ width: 7, height: 7, background: '#1d9e75', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#0f6e56', fontSize: 13, fontWeight: 600 }}>Now live across Africa 🌍</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: -2, margin: '0 0 24px',
            color: '#0a0a0a',
          }}>
            Find a home you can{' '}
            <span style={{
              background: 'linear-gradient(135deg, #1d9e75, #0f6e56)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              actually trust
            </span>
          </h1>

          <p style={{
            fontSize: 20, color: '#555', lineHeight: 1.7,
            maxWidth: 580, margin: '0 auto 40px', fontWeight: 400,
          }}>
            Verified landlords. Escrow payments. Zero fraud.
            The trusted way to find and list properties across Africa.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link to="/listings" style={{
              background: '#1d9e75', color: 'white', fontWeight: 700,
              fontSize: 16, padding: '14px 32px', borderRadius: 12,
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(29,158,117,0.3)',
              transition: 'transform 0.2s',
            }}>
              Browse listings →
            </Link>
            <Link to="/signup" style={{
              background: 'white', color: '#111', fontWeight: 600,
              fontSize: 16, padding: '14px 32px', borderRadius: 12,
              textDecoration: 'none', border: '1.5px solid #e5e5e5',
            }}>
              List your property
            </Link>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              '✅ ID-verified landlords',
              '🔒 Escrow-protected payments',
              '⭐ Rated & reviewed',
              '🌍 Pan-African platform',
            ].map(item => (
              <span key={item} style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Hero cards preview */}
        <div style={{ maxWidth: 900, margin: '64px auto 0', position: 'relative' }}>
          <div style={{
            background: 'white', borderRadius: 20, overflow: 'hidden',
            border: '1px solid #e8e8e8', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          }}>
            {/* Fake browser bar */}
            <div style={{ background: '#f5f5f5', borderBottom: '1px solid #eee', padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              <div style={{ flex: 1, background: 'white', borderRadius: 6, padding: '4px 12px', marginLeft: 8, fontSize: 11, color: '#999' }}>
                nyumba-verified.vercel.app/listings
              </div>
            </div>
            {/* Fake listings grid */}
            <div style={{ padding: 24, background: '#fafafa', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { title: 'Modern 2BR in Kilimani', location: 'Nairobi, Kenya', price: 'KSh 35,000', type: 'Rental', color: '#e8f5f0' },
                { title: 'Luxury BnB Westlands', location: 'Nairobi, Kenya', price: 'KSh 8,500', type: 'BnB', color: '#f0f0ff' },
                { title: 'Spacious Studio VI', location: 'Lagos, Nigeria', price: '₦ 180,000', type: 'Rental', color: '#fff5e8' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: 80, background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏠</div>
                  <div style={{ padding: 12 }}>
                    <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 12, color: '#111' }}>{card.title}</p>
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#888' }}>📍 {card.location}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#1d9e75', fontWeight: 700, fontSize: 13 }}>{card.price}</span>
                      <span style={{ background: '#f0faf6', color: '#0f6e56', fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600 }}>{card.type}</span>
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 14, height: 14, background: '#e8f5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>✅</div>
                      <span style={{ fontSize: 10, color: '#1d9e75', fontWeight: 500 }}>Verified landlord</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div ref={statsRef} id="stats" style={{
        background: '#0a0f0d', padding: '72px 32px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { value: listingsCount.toLocaleString() + '+', label: 'Verified listings', sub: 'Across Africa' },
            { value: usersCount.toLocaleString() + '+', label: 'Registered users', sub: 'And growing fast' },
            { value: fraudsCount + '%', label: 'Fraud prevention', sub: 'Rate guaranteed' },
            { value: citiesCount + '+', label: 'Cities covered', sub: 'More coming soon' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 42, fontWeight: 800, color: '#1d9e75', margin: '0 0 6px', letterSpacing: -1 }}>{stat.value}</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: '0 0 4px' }}>{stat.label}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <div style={{ padding: '96px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ background: '#fff0f0', color: '#c0392b', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>THE PROBLEM</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: '#0a0a0a', margin: '16px 0 12px' }}>
              House hunting is broken
            </h2>
            <p style={{ color: '#666', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>Millions of Africans lose money to fake agents every year. We built NyumbaVerified to fix this — permanently.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: '😤', title: 'Fake agents', desc: 'You pay a viewing fee. They take the money and vanish. You have no way to get it back.', color: '#fff5f5', border: '#fdd' },
              { icon: '😰', title: 'No accountability', desc: 'Fraudsters open new accounts and keep scamming new victims. Nobody stops them.', color: '#fff9f0', border: '#fde' },
              { icon: '😓', title: 'Zero protection', desc: 'Once you pay, the money is gone. No escrow, no verification, no safety net.', color: '#fff5f5', border: '#fdd' },
            ].map(item => (
              <div key={item.title} style={{
                background: item.color, border: `1px solid ${item.border}`,
                borderRadius: 16, padding: 28,
              }}>
                <p style={{ fontSize: 40, margin: '0 0 16px' }}>{item.icon}</p>
                <p style={{ fontWeight: 700, fontSize: 18, color: '#111', margin: '0 0 8px' }}>{item.title}</p>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ padding: '96px 32px', background: '#f8fffe' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ background: '#e8f5f0', color: '#0f6e56', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>THE SOLUTION</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: '#0a0a0a', margin: '16px 0 12px' }}>Four layers of protection</h2>
            <p style={{ color: '#666', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>Everything we built points to one goal — making housing safe for everyone.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              { icon: '🪪', title: 'Verified Identities', desc: 'Every landlord uploads their national ID before listing anything. You always know exactly who you\'re dealing with — no anonymous agents, no ghost listings.', tag: 'KYC Verified', tagColor: '#e8f5f0', tagText: '#0f6e56' },
              { icon: '🔒', title: 'Escrow Payments', desc: 'Your viewing fee is held safely in escrow until the viewing is confirmed. If the landlord disappears — automatic full refund. Every time.', tag: 'Zero risk', tagColor: '#eef3ff', tagText: '#3b5bdb' },
              { icon: '⭐', title: 'Ratings & Reviews', desc: 'After every viewing, both sides rate each other publicly. Bad actors are exposed quickly. Good landlords rise to the top and get more bookings.', tag: 'Peer rated', tagColor: '#fff8e1', tagText: '#b7791f' },
              { icon: '🚨', title: 'Fraud Reporting', desc: 'One click to report a suspicious agent. Their account is suspended immediately while we investigate. Confirmed fraudsters are permanently banned.', tag: 'Instant action', tagColor: '#fff0f0', tagText: '#c0392b' },
            ].map((f, i) => (
              <div key={f.title}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: hoveredFeature === i ? 'white' : 'white',
                  border: `1.5px solid ${hoveredFeature === i ? '#1d9e75' : '#eee'}`,
                  borderRadius: 20, padding: 32,
                  transition: 'all 0.2s',
                  boxShadow: hoveredFeature === i ? '0 8px 32px rgba(29,158,117,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'default',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span style={{ fontSize: 36 }}>{f.icon}</span>
                  <span style={{ background: f.tagColor, color: f.tagText, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{f.tag}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: '#111', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ padding: '96px 32px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ background: '#e8f5f0', color: '#0f6e56', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>PROCESS</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: '#0a0a0a', margin: '16px 0 12px' }}>Up and running in minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { n: '01', title: 'Create account', desc: 'Sign up as tenant, landlord, or BnB host in under 2 minutes.' },
              { n: '02', title: 'Verify identity', desc: 'Upload your national ID. This protects everyone on the platform.' },
              { n: '03', title: 'Find or list', desc: 'Browse verified listings or post your property for review.' },
              { n: '04', title: 'Book safely', desc: 'Pay into escrow. Released only when viewing is confirmed.' },
            ].map((step, i) => (
              <div key={step.n} style={{ position: 'relative' }}>
                {i < 3 && (
                  <div style={{
                    position: 'absolute', top: 20, left: '60%', right: '-40%',
                    height: 2,
                    background: 'linear-gradient(90deg, #1d9e75, #e8f5f0)',
                    zIndex: 0,
                  }} />
                )}
                <div style={{
                  background: '#f8fffe', border: '1.5px solid #e8f5f0',
                  borderRadius: 16, padding: 24, position: 'relative', zIndex: 1,
                }}>
                  <div style={{
                    width: 40, height: 40, background: '#1d9e75', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: 'white', fontSize: 14, marginBottom: 16,
                  }}>{step.n}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111', margin: '0 0 8px' }}>{step.title}</h3>
                  <p style={{ color: '#777', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOR LANDLORDS */}
      <div style={{ padding: '96px 32px', background: '#f8fffe' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ background: '#e8f5f0', color: '#0f6e56', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>FOR LANDLORDS</span>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1, color: '#0a0a0a', margin: '16px 0 12px', lineHeight: 1.2 }}>
              List once.<br />Rent smarter.
            </h2>
            <p style={{ color: '#666', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Post your property, attract serious verified tenants, and get paid safely — all in one place.
            </p>
            {[
              'Free to list — no upfront costs',
              'Only verified, serious tenants',
              'Viewing fees ensure tenant commitment',
              'Build your reputation with reviews',
              'Manage everything from your dashboard',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, background: '#e8f5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>✅</div>
                <span style={{ color: '#444', fontSize: 14, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
            <Link to="/signup" style={{
              display: 'inline-block', marginTop: 24,
              background: '#1d9e75', color: 'white', fontWeight: 700,
              fontSize: 15, padding: '13px 28px', borderRadius: 12,
              textDecoration: 'none', boxShadow: '0 4px 16px rgba(29,158,117,0.3)',
            }}>
              List your property →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: '🏠', title: 'Long-term rentals', desc: 'Houses & apartments', bg: '#f0faf6' },
              { icon: '🛎️', title: 'BnB & Staycation', desc: 'Short-stay units', bg: '#f5f0ff' },
              { icon: '📸', title: 'Photo listings', desc: 'Showcase beautifully', bg: '#fff8f0' },
              { icon: '📊', title: 'Analytics', desc: 'Track your bookings', bg: '#f0f8ff' },
            ].map(card => (
              <div key={card.title} style={{
                background: card.bg, borderRadius: 14, padding: '20px 16px',
                border: '1px solid rgba(0,0,0,0.04)',
              }}>
                <p style={{ fontSize: 28, margin: '0 0 10px' }}>{card.icon}</p>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 4px' }}>{card.title}</p>
                <p style={{ color: '#888', fontSize: 12, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GLOBAL EXPANSION */}
      <div style={{ padding: '96px 32px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ background: '#e8f5f0', color: '#0f6e56', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>EXPANSION</span>
          <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, color: '#0a0a0a', margin: '16px 0 12px' }}>
            Starting in Kenya.<br />Built for Africa.
          </h2>
          <p style={{ color: '#666', fontSize: 17, maxWidth: 520, margin: '0 auto 48px' }}>
            Our mission is to make housing trustworthy across the entire continent — and beyond.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {[
              { flag: '🇰🇪', country: 'Kenya', status: 'Live', bg: '#e8f5f0', color: '#0f6e56' },
              { flag: '🇳🇬', country: 'Nigeria', status: 'Coming soon', bg: '#fff8e1', color: '#b7791f' },
              { flag: '🇬🇭', country: 'Ghana', status: 'Coming soon', bg: '#fff8e1', color: '#b7791f' },
              { flag: '🇿🇦', country: 'South Africa', status: 'Coming soon', bg: '#fff8e1', color: '#b7791f' },
              { flag: '🇹🇿', country: 'Tanzania', status: 'Coming soon', bg: '#fff8e1', color: '#b7791f' },
              { flag: '🇺🇬', country: 'Uganda', status: 'Coming soon', bg: '#fff8e1', color: '#b7791f' },
            ].map(c => (
              <div key={c.country} style={{
                background: c.bg, borderRadius: 14, padding: '16px 20px',
                textAlign: 'center', minWidth: 120, border: '1px solid rgba(0,0,0,0.05)',
              }}>
                <p style={{ fontSize: 32, margin: '0 0 6px' }}>{c.flag}</p>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#111', margin: '0 0 4px' }}>{c.country}</p>
                <span style={{ background: c.bg, color: c.color, fontSize: 10, fontWeight: 700 }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '96px 32px', background: '#0a0f0d' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, color: 'white', letterSpacing: -1.5, margin: '0 0 16px', lineHeight: 1.15 }}>
            Ready to find your<br />
            <span style={{ color: '#1d9e75' }}>next home safely?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17, marginBottom: 40 }}>
            Join thousands of Kenyans who house hunt without fear of being scammed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              background: '#1d9e75', color: 'white', fontWeight: 700,
              fontSize: 16, padding: '16px 36px', borderRadius: 12,
              textDecoration: 'none', boxShadow: '0 4px 24px rgba(29,158,117,0.4)',
            }}>
              Create free account →
            </Link>
            <Link to="/listings" style={{
              background: 'rgba(255,255,255,0.07)', color: 'white', fontWeight: 600,
              fontSize: 16, padding: '16px 36px', borderRadius: 12,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              Browse listings
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#080c0a', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#1d9e75', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 13 }}>N</div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>NyumbaVerified — Trusted housing for Africa</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, margin: 0 }}>© 2026 · Zero fraud. Zero compromise.</p>
      </div>
    </div>
  )
}
