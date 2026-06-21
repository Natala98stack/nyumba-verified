import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
   const { data } = await supabase.rpc('get_all_profiles')
    setUsers(data || [])
    setLoading(false)
  }

  async function updateKyc(id, status) {
    await supabase.from('profiles').update({ kyc_status: status }).eq('id', id)
    setUsers(u => u.map(x => x.id === id ? { ...x, kyc_status: status } : x))
  }

  async function toggleFlag(id, current) {
    await supabase.from('profiles').update({ is_flagged: !current }).eq('id', id)
    setUsers(u => u.map(x => x.id === id ? { ...x, is_flagged: !current } : x))
  }

  const filtered = users.filter(u => {
    const matchSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
    const matchFilter = filter === 'all' || u.role === filter ||
      (filter === 'flagged' && u.is_flagged) ||
      (filter === 'unverified' && u.kyc_status === 'pending')
    return matchSearch && matchFilter
  })

  const KYC_STYLE = {
    pending:  'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Users ({users.length})</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" placeholder="Search by name or phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All users</option>
            <option value="tenant">Tenants</option>
            <option value="landlord">Landlords</option>
            <option value="bnb_host">BnB hosts</option>
            <option value="unverified">Unverified</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(user => (
              <div key={user.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-4 ${user.is_flagged ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">{user.full_name}</p>
                    {user.is_flagged && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">⚠️ Flagged</span>}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-400 capitalize">{user.role?.replace('_', ' ')}</span>
                    {user.phone && <span className="text-xs text-gray-400">📱 {user.phone}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${KYC_STYLE[user.kyc_status]}`}>
                      {user.kyc_status}
                    </span>
                    <span className="text-xs text-gray-300">
                      Joined {new Date(user.created_at).toLocaleDateString('en-KE')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {user.kyc_status === 'pending' && (
                    <>
                      <button onClick={() => updateKyc(user.id, 'verified')}
                        className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors">
                        ✅ Verify
                      </button>
                      <button onClick={() => updateKyc(user.id, 'rejected')}
                        className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {user.kyc_status === 'verified' && (
                    <button onClick={() => updateKyc(user.id, 'pending')}
                      className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1.5 rounded-lg transition-colors">
                      Revoke
                    </button>
                  )}
                  <button onClick={() => toggleFlag(user.id, user.is_flagged)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${user.is_flagged ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                    {user.is_flagged ? 'Unflag' : '🚩 Flag'}
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
