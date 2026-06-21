import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const KYC_BADGE = {
  pending:  { label: 'ID not verified', color: 'bg-yellow-100 text-yellow-800' },
  verified: { label: 'Verified', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Verification failed', color: 'bg-red-100 text-red-800' },
}

export default function Dashboard() {
  const { profile, signOut } = useAuth()
  if (!profile) return <div className="p-8 text-gray-400">Loading…</div>

  const kyc = KYC_BADGE[profile.kyc_status] || KYC_BADGE.pending
  const isTenant = profile.role === 'tenant'
  const isLandlord = profile.role === 'landlord' || profile.role === 'bnb_host'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-brand-600">NyumbaVerified</span>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${kyc.color}`}>{kyc.label}</span>
          <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-800">Sign out</button>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Good day, {profile.full_name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 mb-8 capitalize">Account type: {profile.role?.replace('_', ' ')}</p>
        {profile.kyc_status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <p className="font-medium text-yellow-800 text-sm">Verify your identity</p>
            <p className="text-yellow-700 text-sm mt-0.5">Upload your national ID to unlock all features.</p>
            <Link to="/verify-kyc" className="text-sm font-medium text-yellow-800 underline mt-1 inline-block">Verify now</Link>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isTenant && (
            <>
              <Link to="/listings" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4">
                <span className="text-3xl">🔍</span>
                <div><p className="font-medium text-gray-800">Find a home</p><p className="text-sm text-gray-500">Browse verified listings</p></div>
              </Link>
              <Link to="/my-bookings" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4">
                <span className="text-3xl">📅</span>
                <div><p className="font-medium text-gray-800">My bookings</p><p className="text-sm text-gray-500">Viewings and BnB stays</p></div>
              </Link>
            </>
          )}
          {isLandlord && (
            <>
              <Link to="/listings/new" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4">
                <span className="text-3xl">➕</span>
                <div><p className="font-medium text-gray-800">Add listing</p><p className="text-sm text-gray-500">Post a vacant unit</p></div>
              </Link>
              <Link to="/my-listings" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4">
                <span className="text-3xl">🏠</span>
                <div><p className="font-medium text-gray-800">My listings</p><p className="text-sm text-gray-500">Manage your properties</p></div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
