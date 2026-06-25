import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Clock, ScanLine } from 'lucide-react'

export default function NewListing() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', type: 'rental',
    price: '', bedrooms: '', bathrooms: '', location_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const verified = profile?.kyc_status === 'verified'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!verified) { setError('Please verify your identity before posting a listing.'); return }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.from('listings').insert({
      ...form,
      price: Number(form.price),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      owner_id: user.id,
      is_available: true,
      is_approved: true,
    })
    if (err) { setError(err.message); setLoading(false) }
    else navigate('/my-listings')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Post a new listing</h1>

        {!verified ? (
          profile?.kyc_status === 'submitted' ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center mb-4"><Clock size={30} className="text-amber-500" /></div>
              <h2 className="font-semibold text-gray-800 text-lg">Verification under review</h2>
              <p className="text-sm text-gray-500 mt-2">We're checking your ID. You'll be able to post listings as soon as you're approved — usually within 24 hours.</p>
              <Link to="/dashboard" className="mt-4 inline-block text-sm text-brand-600 underline">Back to dashboard</Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center mb-4"><ScanLine size={30} className="text-amber-500" /></div>
              <h2 className="font-semibold text-gray-800 text-lg">Verify to post a listing</h2>
              <p className="text-sm text-gray-500 mt-2 mb-5">NyumbaVerified is built on trust — landlords verify their identity before posting. It's quick, and your listings get a verified badge that earns more bookings.</p>
              <Link to="/verify-kyc" className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                Verify my identity →
              </Link>
              {profile?.kyc_status === 'rejected' && (
                <p className="text-xs text-red-500 mt-2">Your last submission was rejected — please re-upload a clear photo.</p>
              )}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing title</label>
                <input type="text" required placeholder="e.g. Spacious 2BR in Kilimani"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="rental">Long-term rental</option>
                  <option value="bnb">BnB / Staycation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (KSh) — {form.type === 'bnb' ? 'per night' : 'per month'}
                </label>
                <input type="number" required placeholder="e.g. 25000"
                  value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input type="number" placeholder="e.g. 2"
                    value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input type="number" placeholder="e.g. 1"
                    value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" placeholder="e.g. Kilimani, Nairobi"
                  value={form.location_name} onChange={e => setForm(f => ({ ...f, location_name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={4} placeholder="Describe the property, amenities, nearby facilities..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>

              {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors">
                {loading ? 'Posting…' : 'Post listing'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}