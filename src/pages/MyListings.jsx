import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function MyListings() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('listings').select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
      setListings(data || [])
      setLoading(false)
    }
    fetch()
  }, [user.id])

  async function toggleAvailable(id, current) {
    await supabase.from('listings').update({ is_available: !current }).eq('id', id)
    setListings(l => l.map(x => x.id === id ? { ...x, is_available: !current } : x))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">My listings</h1>
          <Link to="/listings/new"
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Add new
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏠</p>
            <p className="text-gray-500 font-medium">No listings yet</p>
            <Link to="/listings/new" className="mt-3 inline-block text-brand-600 underline text-sm">
              Post your first listing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-800">{listing.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${listing.type === 'bnb' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-700'}`}>
                      {listing.type === 'bnb' ? 'BnB' : 'Rental'}
                    </span>
                  </div>
                  {listing.location_name && <p className="text-xs text-gray-400">📍 {listing.location_name}</p>}
                  <p className="text-sm font-semibold text-brand-600 mt-1">
                    KSh {listing.price?.toLocaleString()}/{listing.type === 'bnb' ? 'night' : 'month'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${listing.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {listing.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <button onClick={() => toggleAvailable(listing.id, listing.is_available)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline">
                    {listing.is_available ? 'Mark unavailable' : 'Mark available'}
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
