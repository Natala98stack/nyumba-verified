import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/shared/AdminLayout'

export default function AdminKyc() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [urls, setUrls] = useState({}) // profileId -> signed photo url

  useEffect(() => { load() }, [])

  async function load() {
    // Reuse the same admin RPC the rest of the admin panel uses, then filter.
    const { data } = await supabase.rpc('get_all_profiles')
    const submitted = (data || []).filter((u) => u.kyc_status === 'submitted')
    setSubs(submitted)
    setLoading(false)

    // Create short-lived signed URLs for each ID photo.
    const next = {}
    for (const u of submitted) {
      if (u.id_photo_path) {
        const { data: signed } = await supabase.storage
          .from('kyc-documents')
          .createSignedUrl(u.id_photo_path, 3600)
        if (signed?.signedUrl) next[u.id] = signed.signedUrl
      }
    }
    setUrls(next)
  }

  async function decide(id, status) {
    await supabase.from('profiles').update({ kyc_status: status }).eq('id', id)
    setSubs((s) => s.filter((u) => u.id !== id))
  }

  return (
    <AdminLayout title="KYC Review" count={subs.length} kycCount={subs.length}>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading…</div>
      ) : subs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🪪</p>
          <p className="text-gray-500 font-medium">No IDs waiting for review</p>
        </div>
      ) : (
        <div className="space-y-5">
          {subs.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  {urls[u.id] ? (
                    <a href={urls[u.id]} target="_blank" rel="noreferrer">
                      <img src={urls[u.id]} alt="Submitted ID"
                        className="w-full max-h-64 object-contain rounded-lg border border-gray-100 bg-gray-50" />
                    </a>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                      Photo unavailable
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Tap the image to open full size.</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Submitted details</p>
                  <Row label="Account name" value={u.full_name} />
                  <Row label="Name on ID" value={u.id_full_name} />
                  <Row label="ID number" value={u.id_number} />
                  <Row label="Date of birth" value={u.id_dob || '—'} />
                  <Row label="Role" value={u.role?.replace('_', ' ')} />
                  <Row label="Phone" value={u.phone || '—'} />

                  <div className="mt-auto pt-4 flex gap-2">
                    <button onClick={() => decide(u.id, 'verified')}
                      className="flex-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg font-medium transition-colors">
                      ✅ Approve
                    </button>
                    <button onClick={() => decide(u.id, 'rejected')}
                      className="flex-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg font-medium transition-colors">
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium capitalize text-right">{value}</span>
    </div>
  )
}
