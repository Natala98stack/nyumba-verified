import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ROLES = [
  { id: 'tenant', label: 'Tenant', desc: 'Looking for a place to rent', icon: '🏠' },
  { id: 'landlord', label: 'Landlord', desc: 'Listing long-term rentals', icon: '🏢' },
  { id: 'bnb_host', label: 'BnB / Stay', desc: 'Short-stay & staycation host', icon: '🛎️' },
]

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp({ ...form, role })
      navigate('/verify-email')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600">NyumbaVerified</h1>
          <p className="text-gray-500 mt-1">Trusted housing. Zero fraud.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Create account</h2>
              <p className="text-gray-500 text-sm mb-6">Choose how you will use the platform</p>
              <div className="space-y-3">
                {ROLES.map(({ id, label, desc, icon }) => (
                  <button key={id} onClick={() => { setRole(id); setStep(2) }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-brand-500 hover:bg-brand-50 transition-all text-left">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="text-sm text-brand-600 mb-4 hover:underline">
                Back
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Sign up as {ROLES.find(r => r.id === role)?.label}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input type="text" required placeholder="Jane Wanjiku" value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Safaricom)</label>
                  <input type="tel" required placeholder="0712 345 678" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required placeholder="jane@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" required minLength={8} placeholder="At least 8 characters" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors">
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
