import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { notify } from '../lib/notify'

export default function ListingDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('listings')
        .select('*, profiles(full_name, kyc_status, phone)')
        .eq('id', id)
        .single()
      setListing(data)
      setLoading(false)
    }
    fetch()
  }, [id])

  async function handleBook() {
    if (!date) { setError('Please pick a date and time'); return }
    setError('')
    setBooking(true)
    const { data: created, error: err } = await supabase.from('viewings').insert({
      listing_id: listing.id,
      tenant_id: profile.id,
      landlord_id: listing.owner_id,
      scheduled_at: new Date(date).toISOString(),
      fee_amount: 500,
    }).select().single()
    if (err) setError(err.message)
    else {
      notify('viewing_created', { viewingId: created.id }) // emails the landlord (non-blocking)
      setBooked(true)
    }
    setBooking(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
  if (!listing) return <div className="min-h-screen flex items-center justify-center text-gray-400">Listing not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
        <Link to="/listings" className="text-sm text-gray-500 hover:text-gray-800">← Back to listings</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="h-64 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
          {listing.photos?.[0]
            ? <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
            : <span className="text-7xl">🏠</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-semibold text-gray-800">{listing.title}</h1>
                <span className={`text-xs px-2 py-1 rounded-full ${listing.type === 'bnb' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-700'}`}>
                  {listing.type === 'bnb' ? 'BnB' : 'Rental'}
                </span>
              </div>
              {listing.location_name && <p className="text-gray-400 text-sm">📍 {listing.location_name}</p>}
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-600">KSh {listing.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-400">per {listing.type === 'bnb' ? 'night' : 'month'}</p>
              </div>
              {listing.bedrooms && <div className="text-center"><p className="text-2xl">🛏</p><p className="text-xs text-gray-400">{listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</p></div>}
              {listing.bathrooms && <div className="text-center"><p className="text-2xl">🚿</p><p className="text-xs text-gray-400">{listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}</p></div>}
            </div>

            {listing.description && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-medium text-gray-700 mb-2">About this place</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-medium text-gray-700 mb-2">Listed by</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                  {listing.profiles?.full_name?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{listing.profiles?.full_name}</p>
                  {listing.profiles?.kyc_status === 'verified'
                    ? <p className="text-xs text-green-600">✅ Identity verified</p>
                    : <p className="text-xs text-yellow-600">⚠️ Not yet verified</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 h-fit">
            {booked ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-semibold text-gray-800">Viewing booked!</p>
                <p className="text-sm text-gray-500 mt-1">KSh 500 viewing fee held in escrow until your visit is confirmed.</p>
                <Link to="/my-bookings" className="mt-3 inline-block text-sm text-brand-600 underline">View my bookings</Link>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-gray-700 mb-3">Book a viewing</h3>
                <p className="text-xs text-gray-400 mb-3">KSh 500 viewing fee — held in escrow, refunded if viewing does not happen.</p>
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                <button onClick={handleBook} disabled={booking}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                  {booking ? 'Booking…' : 'Book viewing — KSh 500'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">🔒 Payment held safely in escrow</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
