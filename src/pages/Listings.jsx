import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Home, MapPin, BedDouble, ShowerHead, BadgeCheck } from 'lucide-react'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => { fetchListings() }, [])

  async function fetchListings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('*, profiles(full_name, kyc_status)')
      .eq('is_available', true)
      .eq('is_approved', true)
    if (!error) setListings(data || [])
    setLoading(false)
  }

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.location_name || '').toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || l.type === typeFilter
    const matchPrice = !maxPrice || l.price <= Number(maxPrice)
    return matchSearch && matchType && matchPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Find a home</h1>

        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
          <input type="text" placeholder="Search by name or location..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All types</option>
            <option value="rental">Long-term rental</option>
            <option value="bnb">BnB / Staycation</option>
          </select>
          <input type="number" placeholder="Max price (KSh)..."
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
            className="w-44 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading listings…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Home size={44} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(listing => (
              <Link key={listing.id} to={`/listings/${listing.id}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand-300 transition-all">
                <div className="h-48 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                  {listing.photos?.[0]
                    ? <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
                    : <Home size={48} className="text-gray-300" />}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight">{listing.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${listing.type === 'bnb' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-700'}`}>
                      {listing.type === 'bnb' ? 'BnB' : 'Rental'}
                    </span>
                  </div>
                  {listing.location_name && <p className="text-xs text-gray-400 mb-2"><MapPin size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />{listing.location_name}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-semibold text-brand-600">
                      KSh {listing.price?.toLocaleString()}
                      <span className="text-xs font-normal text-gray-400">/{listing.type === 'bnb' ? 'night' : 'month'}</span>
                    </p>
                    <div className="flex gap-2 text-xs text-gray-400">
                      {listing.bedrooms && <span><BedDouble size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />{listing.bedrooms}</span>}
                      {listing.bathrooms && <span><ShowerHead size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />{listing.bathrooms}</span>}
                    </div>
                  </div>
                  {listing.profiles?.kyc_status === 'verified' && (
                    <p className="text-xs text-green-600 mt-2"><BadgeCheck size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />Verified landlord</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
