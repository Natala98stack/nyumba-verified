import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchListings() }, [])

  async function fetchListings() {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(full_name, kyc_status)')
      .order('created_at', { ascending: false })
    setListings(data || [])
    setLoading(false)
  }

  async function toggleApproved(id, current) {
    await supabase.from('listings').update({ is_approved: !current }).eq('id', id)
    setListings(l => l.map(x => x.id === id ? { ...x, is_approved: !current } : x))
  }

  async function deleteListing(id) {
    if (!confirm('Delete this listing permanently?')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(l => l.filter(x => x.id !== id))
  }

  const filtered = listings.filter(l => {
    if (filter === 'approved') return l.is_approved
    if (filter === 'pending') return !l.is_approved
    if (filter === 'rental') return l.type === 'rental'
    if (filter === 'bnb') return l.type === 'bnb'
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>
        <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Listings ({listings.length})</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'approved', 'rental', 'bnb'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors capitalize ${filter === f ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}>
              {f === 'all' ? 'All' : f === 'pending' ? '⏳ Pending' : f === 'approved' ? '✅ Approved' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(listing => (
              <div key={listing.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-4 ${!listing.is_approved ? 'border-yellow-200' : 'border-gray-100'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">{listing.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${listing.type === 'bnb' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-700'}`}>
                      {listing.type === 'bnb' ? 'BnB' : 'Rental'}
                    </span>
                    {!listing.is_approved && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⏳ Pending approval</span>}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400">
                    {listing.location_name && <span>📍 {listing.location_name}</span>}
                    <span>KSh {listing.price?.toLocaleString()}/{listing.type === 'bnb' ? 'night' : 'month'}</span>
                    <span>By: {listing.profiles?.full_name}</span>
                    {listing.profiles?.kyc_status === 'verified' && <span className="text-green-600">✅ Verified owner</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleApproved(listing.id, listing.is_approved)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${listing.is_approved ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {listing.is_approved ? 'Unapprove' : '✅ Approve'}
                  </button>
                  <button onClick={() => deleteListing(listing.id)}
                    className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
