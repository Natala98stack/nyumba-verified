import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { notify } from '../lib/notify'
import AdminLayout from '../components/shared/AdminLayout'
import { Calendar, MapPin, Wallet, Lock } from 'lucide-react'

export default function AdminViewings() {
  const [viewings, setViewings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchViewings() }, [])

  async function fetchViewings() {
    const { data } = await supabase
      .from('viewings')
      .select(`
        *,
        listings(title, location_name),
        tenant:tenant_id(full_name, phone),
        landlord:landlord_id(full_name, phone)
      `)
      .order('created_at', { ascending: false })
    setViewings(data || [])
    setLoading(false)
  }

  async function updateEscrow(id, status) {
    await supabase.from('viewings').update({ escrow_status: status }).eq('id', id)
    setViewings(v => v.map(x => x.id === id ? { ...x, escrow_status: status } : x))
  }

  async function updateStatus(id, status) {
    await supabase.from('viewings').update({ status }).eq('id', id)
    setViewings(v => v.map(x => x.id === id ? { ...x, status } : x))
    if (status === 'confirmed') notify('viewing_confirmed', { viewingId: id }) // emails the tenant
  }

  const STATUS_STYLE = {
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
    disputed:  'bg-red-100 text-red-700',
  }

  const ESCROW_STYLE = {
    held:     'bg-yellow-100 text-yellow-700',
    released: 'bg-green-100 text-green-700',
    refunded: 'bg-blue-100 text-blue-700',
    frozen:   'bg-red-100 text-red-700',
  }

  return (
    <AdminLayout title="Viewings & Escrow" count={viewings.length}>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading…</div>
      ) : viewings.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={44} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No viewings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {viewings.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-800">{v.listings?.title}</p>
                  {v.listings?.location_name && <p className="text-xs text-gray-400"><MapPin size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />{v.listings.location_name}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(v.scheduled_at).toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLE[v.status]}`}>{v.status}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${ESCROW_STYLE[v.escrow_status]}`}><Wallet size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />{v.escrow_status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-500">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Tenant</p>
                  <p>{v.tenant?.full_name}</p>
                  <p>{v.tenant?.phone}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Landlord</p>
                  <p>{v.landlord?.full_name}</p>
                  <p>{v.landlord?.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Fee: KSh {v.fee_amount?.toLocaleString()}</p>
                <div className="flex gap-2 flex-wrap">
                  {v.escrow_status === 'held' && (
                    <>
                      <button onClick={() => updateEscrow(v.id, 'released')}
                        className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors">
                        Release to landlord
                      </button>
                      <button onClick={() => updateEscrow(v.id, 'refunded')}
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                        Refund to tenant
                      </button>
                      <button onClick={() => updateEscrow(v.id, 'frozen')}
                        className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />Freeze
                      </button>
                    </>
                  )}
                  {v.status === 'pending' && (
                    <button onClick={() => updateStatus(v.id, 'confirmed')}
                      className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                      Confirm viewing
                    </button>
                  )}
                  {(v.status === 'pending' || v.status === 'confirmed') && (
                    <button onClick={() => updateStatus(v.id, 'completed')}
                      className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors">
                      Mark completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
