import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// Animated counter hook
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

// Intersection observer hook
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

  const [activeFeature, setActiveFeature] = useState(0)

  const FEATURES = [
    {
      icon: '🪪',
      title: 'Verified Identities',
      desc: 'Every landlord uploads their national ID before listing. You always know exactly who you\'re dealing with — no anonymous agents, no fake accounts.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: '🔒',
      title: 'Escrow Protection',
      desc: 'Your viewing fee is held safely in escrow until the viewing is confirmed. If the landlord disappears, you get an automatic refund. Zero risk.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: '⭐',
      title: 'Trust Ratings',
      desc: 'After every viewing, both tenant and landlord rate each other. Bad actors are quickly exposed and removed. Good landlords rise to the top.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: '🚨',
      title: 'Fraud Reporting',
      desc: 'Report a suspicious agent and their account is suspended immediately while we investigate. Confirmed fraudsters are permanently banned and blacklisted.',
      color: 'from-rose-500 to-red-600',
    },
  ]

  const HOW_IT_WORKS = [
    { step: '01', title: 'Create your account', desc: 'Sign up as a tenant, landlord, or BnB host. Takes less than 2 minutes.' },
    { step: '02', title: 'Verify your identity', desc: 'Upload your national ID. This is what makes the platform safe for everyone.' },
    { step: '03', title: 'Find or list a property', desc: 'Browse verified listings or post your own. Every listing is reviewed before going live.' },
    { step: '04', title: 'Book with confidence', desc: 'Pay your viewing fee into escrow. It\'s only released when the viewing happens.' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f0d]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">N</div>
            <span className="text-lg font-bold text-white">NyumbaVerified</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link to="/signup" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            🇰🇪 Built for Kenya — Zero fraud, guaranteed
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Find a home you can
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              actually trust
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            NyumbaVerified connects tenants with verified landlords across Kenya.
            Every listing is checked, every payment is protected, every fraudster is blocked.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/25">
              Find a home →
            </Link>
            <Link to="/signup" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all">
              List your property
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            {['🔒 Escrow protected', '✅ ID verified landlords', '⭐ Rated & reviewed'].map(badge => (
              <span key={badge} className="text-sm text-gray-500">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div ref={statsRef} id="stats" className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: listingsCount.toLocaleString() + '+', label: 'Verified listings' },
            { value: usersCount.toLocaleString() + '+', label: 'Registered users' },
            { value: fraudsCount + '%', label: 'Fraud prevention rate' },
            { value: citiesCount + '+', label: 'Cities covered' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">The Problem</p>
            <h2 className="text-4xl font-bold text-white mb-4">House hunting in Kenya is broken</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Thousands of Kenyans lose money to fake agents every year. We built NyumbaVerified to end this.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '😤', title: 'Fake agents', desc: 'You pay a viewing fee. They take the money and disappear. You have no recourse.' },
              { icon: '😰', title: 'No accountability', desc: 'Fraudsters create new accounts and keep scamming new victims with no consequences.' },
              { icon: '😓', title: 'No protection', desc: 'Once you pay, the money is gone. There\'s no escrow, no verification, no safety net.' },
            ].map(item => (
              <div key={item.title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-rose-500/20 transition-colors">
                <p className="text-4xl mb-4">{item.icon}</p>
                <p className="font-semibold text-white mb-2">{item.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">The Solution</p>
            <h2 className="text-4xl font-bold text-white mb-4">How we protect you</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four layers of protection that make NyumbaVerified the safest way to find a home in Kenya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <div key={feature.title}
                className={`bg-white/[0.03] border rounded-2xl p-6 cursor-pointer transition-all ${activeFeature === i ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.06] hover:border-white/10'}`}
                onClick={() => setActiveFeature(i)}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">Process</p>
            <h2 className="text-4xl font-bold text-white mb-4">Get started in minutes</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four simple steps to find your next verified home safely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent z-10" />
                )}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
                  <p className="text-emerald-400 text-3xl font-bold mb-4">{step.step}</p>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOR LANDLORDS */}
      <div className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">For Landlords</p>
            <h2 className="text-4xl font-bold text-white mb-6">List once. Rent faster.</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Post your property, get verified, and attract serious tenants who have skin in the game.
              No time-wasters. No fake enquiries. Just real people ready to move.
            </p>
            <div className="space-y-4">
              {[
                '✅ Free to list your property',
                '✅ Only serious tenants with verified accounts',
                '✅ Viewing fees ensure tenants are committed',
                '✅ Build your reputation with reviews',
              ].map(item => (
                <p key={item} className="text-gray-300 text-sm">{item}</p>
              ))}
            </div>
            <Link to="/signup" className="inline-block mt-8 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              List your property →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🏠', title: 'Long-term rentals', desc: 'Houses, apartments, bedsitters' },
              { icon: '🛎️', title: 'BnB & staycations', desc: 'Short-stay and holiday units' },
              { icon: '📸', title: 'Photo listings', desc: 'Showcase your property beautifully' },
              { icon: '📊', title: 'Booking analytics', desc: 'Track views and enquiries' },
            ].map(card => (
              <div key={card.title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-emerald-500/20 transition-colors">
                <p className="text-2xl mb-2">{card.icon}</p>
                <p className="font-medium text-white text-sm mb-1">{card.title}</p>
                <p className="text-gray-500 text-xs">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIAL */}
      <div className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-5xl mb-6">💬</p>
          <blockquote className="text-2xl font-medium text-white mb-6 leading-relaxed">
            "I paid KSh 1,500 to an agent who disappeared the same day. NyumbaVerified would have protected me — I wish it existed back then."
          </blockquote>
          <p className="text-gray-500">— Nairobi tenant, 2024</p>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <h2 className="text-4xl font-bold text-white mb-4 relative">Ready to house hunt safely?</h2>
            <p className="text-gray-400 mb-8 text-lg relative">Join thousands of Kenyans who find homes without the fear of being scammed.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap relative">
              <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/25">
                Create free account →
              </Link>
              <Link to="/listings" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all">
                Browse listings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-xs font-bold">N</div>
            <span className="text-sm text-gray-500">NyumbaVerified — Trusted housing for Kenya</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 · Zero fraud. Zero compromise.</p>
        </div>
      </footer>
    </div>
  )
}
