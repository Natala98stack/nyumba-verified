import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth'
import ProtectedRoute from './shared/ProtectedRoute'

import Landing        from '../pages/Landing'
import Login          from '../pages/Login'
import SignUp         from '../pages/SignUp'
import Dashboard      from '../pages/Dashboard'
import Listings       from '../pages/Listings'
import ListingDetail  from '../pages/ListingDetail'
import NewListing     from '../pages/NewListing'
import MyListings     from '../pages/MyListings'
import MyBookings     from '../pages/MyBookings'
import VerifyKyc      from '../pages/VerifyKyc'
import AdminDashboard from '../pages/AdminDashboard'
import AdminKyc       from '../pages/AdminKyc'
import AdminUsers     from '../pages/AdminUsers'
import AdminListings  from '../pages/AdminListings'
import AdminReports   from '../pages/AdminReports'
import AdminViewings  from '../pages/AdminViewings'

const Soon = ({ name }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-400">
    <div className="text-center">
      <p className="text-2xl font-semibold text-gray-600 mb-2">{name}</p>
      <p className="text-sm">Coming soon</p>
    </div>
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"            element={<Landing />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"      element={<SignUp />} />
          <Route path="/verify-email" element={<Soon name="Check your email to confirm your account" />} />

          {/* User routes */}
          <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/listings"     element={<ProtectedRoute><Listings /></ProtectedRoute>} />
          <Route path="/listings/new" element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
          <Route path="/listings/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
          <Route path="/my-listings"  element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
          <Route path="/my-bookings"  element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/verify-kyc"   element={<ProtectedRoute><VerifyKyc /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"    element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/kyc"      element={<ProtectedRoute><AdminKyc /></ProtectedRoute>} />
          <Route path="/admin/listings" element={<ProtectedRoute><AdminListings /></ProtectedRoute>} />
          <Route path="/admin/reports"  element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/viewings" element={<ProtectedRoute><AdminViewings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
