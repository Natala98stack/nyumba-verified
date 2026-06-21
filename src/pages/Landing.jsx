import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-xl font-bold text-brand-600">NyumbaVerified</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">Sign in</Link>
          <Link to="/signup" className="text-sm bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🇰🇪 Built for Kenya
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Find a home you can<br />
          <span className="text-brand-600">actually trust</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          NyumbaVerified connects tenants with verified landlords. Every listing is checked,
          every payment is protected, and every fraudulent agent is blocked.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup" className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-8 py-3.5 rounded-xl text-lg transition-colors">
            Find a home →
          </Link>
          <Link to="/signup" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-8 py-3.5 rounded-xl text-lg transition-colors">
            List your property
          </Link>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="bg-red-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
            House hunting in Kenya is broken
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '😤', title: 'Fake agents', desc: 'You pay a viewing fee and they disappear with your money' },
              { icon: '😰', title: 'No accountability', desc: 'Fraudsters create new accounts and keep scamming people' },
              { icon: '😓', title: 'No protection', desc: 'Once you pay, you have no way to get your money back' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-red-100">
                <p className="text-3xl mb-3">{item.icon}</p>
                <p className="font-semibold text-gray-800 mb-2">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
            How NyumbaVerified protects you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🪪', title: 'Verified identities', desc: 'Every landlord uploads their national ID. You always know who you\'re dealing with.' },
              { icon: '🔒', title: 'Escrow payments', desc: 'Your viewing fee is held safely until the viewing happens. No viewing, full refund.' },
              { icon: '⭐', title: 'Ratings & reviews', desc: 'After every viewing, both sides rate each other. Bad actors are quickly exposed.' },
              { icon: '🚨', title: 'Fraud reporting', desc: 'Report a fraudulent agent and their account is suspended immediately while we investigate.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 p-6 bg-brand-50 rounded-xl">
                <span className="text-3xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-600 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your next home?</h2>
          <p className="text-brand-100 mb-8">Join thousands of Kenyans who house hunt safely on NyumbaVerified</p>
          <Link to="/signup" className="bg-white text-brand-600 hover:bg-brand-50 font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors inline-block">
            Create free account →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>© 2026 NyumbaVerified · Trusted housing for Kenya · Zero fraud.</p>
      </footer>
    </div>
  )
}
