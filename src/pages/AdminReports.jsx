import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchReports() }, [])

  async function fetchReports() {
    const { data } = await supabase
      .from('fraud_reports')
      .select(`
        *,
        reporter:reporter_id(full_name, phone),
        reported:reported_id(full_name, phone, role)
      `)
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('fraud_reports').update({ status }).eq('id', id)
    setReports(r => r.map(x => x.id === id ? { ...x, status } : x))

    // If fraud confirmed, flag the reported user
    if (status === 'resolved_fraud') {
      const report = reports.find(r => r.id === id)
      if (report) {
        await supabase.from('profiles')
          .update({ is_flagged: true, flag_reason: report.reason })
          .eq('id', report.reported_id)
      }
    }
  }

  const STATUS_STYLE = {
    open:             'bg-yellow-100 text-yellow-700',
    investigating:    'bg-blue-100 text-blue-700',
    resolved_fraud:   'bg-red-100 text-red-700',
    resolved_false:   'bg-green-100 text-green-700',
  }

  const STATUS_LABEL = {
    open:             '⏳ Open',
    investigating:    '🔍 Investigating',
    resolved_fraud:   '🚨 Fraud confirmed',
    resolved_false:   '✅ False report',
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Fraud Reports ({reports.length})</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading…</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-gray-500 font-medium">No fraud reports yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">
                        Report against: <span className="text-red-600">{report.reported?.full_name}</span>
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[report.status]}`}>
                        {STATUS_LABEL[report.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Reported by: {report.reporter?.full_name} · {new Date(report.created_at).toLocaleDateString('en-KE')}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Reason: </span>{report.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-500">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Reported person</p>
                    <p>{report.reported?.full_name}</p>
                    <p>{report.reported?.phone}</p>
                    <p className="capitalize">{report.reported?.role?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Reporter</p>
                    <p>{report.reporter?.full_name}</p>
                    <p>{report.reporter?.phone}</p>
                  </div>
                </div>

                {report.status === 'open' && (
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => updateStatus(report.id, 'investigating')}
                      className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                      🔍 Start investigating
                    </button>
                    <button onClick={() => updateStatus(report.id, 'resolved_fraud')}
                      className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
                      🚨 Confirm fraud + ban user
                    </button>
                    <button onClick={() => updateStatus(report.id, 'resolved_false')}
                      className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors">
                      ✅ Mark as false report
                    </button>
                  </div>
                )}

                {report.status === 'investigating' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(report.id, 'resolved_fraud')}
                      className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
                      🚨 Confirm fraud + ban user
                    </button>
                    <button onClick={() => updateStatus(report.id, 'resolved_false')}
                      className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors">
                      ✅ Mark as false report
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
