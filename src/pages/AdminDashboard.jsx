import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ users: 0, listings: 0, viewings: 0, reports: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchStats()
  }, [profile])

  async function fetchStats() {
    const [users, listings, viewings, reports] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('listings').select('id', { count: 'exact', head: true }),
      supabase.from('viewings').select('id', { count: 'exact', head: true }),
      supabase.from('fraud_reports').select('id', { count: 'exact', head: true }),
    ])
    setStats({
      users: users.count || 0,
      listings: listings.count || 0,
      viewings: viewings.count || 0,
      reports: reports.count || 0,
    })
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>

  const STAT_CARDS = [
    { label: 'Total users', value: stats.users, icon: '👥', link: '/admin/users', color: 'bg-blue-50 text-blue-600' },
    { label: 'Listings', value: stats.listings, icon: '🏠', link: '/admin/listings', color: 'bg-brand-50 text-brand-600' },
    { label: 'Viewings booked', value: stats.viewings, icon: '📅', link: '/admin/viewings', color: 'bg-purple-50 text-purple-600' },
    { label: 'Fraud reports', value: stats.reports, icon: '🚨', link: '/admin/reports', color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-brand-600">NyumbaVerified</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">User view</Link>
          <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-800">Sign out</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Platform overview and management</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(card => (
            <Link key={card.label} to={card.link}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-brand-200 transition-all">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-xl mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/users" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-brand-200 transition-all flex items-center gap-4">
            <span className="text-3xl">👥</span>
            <div>
              <p className="font-medium text-gray-800">Manage users</p>
              <p className="text-sm text-gray-500">View, verify or ban users</p>
            </div>
          </Link>
          <Link to="/admin/listings" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-brand-200 transition-all flex items-center gap-4">
            <span className="text-3xl">🏠</span>
            <div>
              <p className="font-medium text-gray-800">Manage listings</p>
              <p className="text-sm text-gray-500">Approve or reject listings</p>
            </div>
          </Link>
          <Link to="/admin/reports" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-brand-200 transition-all flex items-center gap-4">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="font-medium text-gray-800">Fraud reports</p>
              <p className="text-sm text-gray-500">Investigate and resolve</p>
            </div>
          </Link>
          <Link to="/admin/viewings" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-brand-200 transition-all flex items-center gap-4">
            <span className="text-3xl">📅</span>
            <div>
              <p className="font-medium text-gray-800">Viewings</p>
              <p className="text-sm text-gray-500">Monitor bookings and escrow</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
