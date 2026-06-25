import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Calendar, MapPin } from 'lucide-react'

const STATUS_STYLE = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
  disputed:  'bg-red-100 text-red-700',
}

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('viewings')
        .select('*, listings(title, location_name, type, price)')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    fetch()
  }, [user.id])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My bookings</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={44} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No bookings yet</p>
            <Link to="/listings" className="mt-3 inline-block text-brand-600 underline text-sm">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{booking.listings?.title}</h3>
                    {booking.listings?.location_name && (
                      <p className="text-xs text-gray-400 mt-0.5"><MapPin size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />{booking.listings.location_name}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Viewing: {new Date(booking.scheduled_at).toLocaleDateString('en-KE', {
                        weekday: 'short', year: 'numeric', month: 'short',
                        day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLE[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Viewing fee: <span className="font-medium text-gray-600">KSh {booking.fee_amount}</span>
                    {' '}— escrow: <span className="font-medium">{booking.escrow_status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
