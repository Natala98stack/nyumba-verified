import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

// Reads a File as a base64 string (without the data: prefix)
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function VerifyKyc() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [dob, setDob] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const status = profile?.kyc_status

  // Already verified or awaiting review — show status instead of the form.
  if (status === 'verified') {
    return (
      <Shell>
        <div className="text-center py-10">
          <p className="text-5xl mb-3">✅</p>
          <h2 className="text-xl font-semibold text-gray-800">You're verified</h2>
          <p className="text-gray-500 text-sm mt-2">Your identity has been confirmed. The verified badge now shows on your profile and listings.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-brand-600 underline text-sm">Back to dashboard</Link>
        </div>
      </Shell>
    )
  }
  if (status === 'submitted' && !done) {
    return (
      <Shell>
        <div className="text-center py-10">
          <p className="text-5xl mb-3">⏳</p>
          <h2 className="text-xl font-semibold text-gray-800">Under review</h2>
          <p className="text-gray-500 text-sm mt-2">We've received your ID. Our team usually reviews submissions within 24 hours. You'll get an update on your dashboard.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-brand-600 underline text-sm">Back to dashboard</Link>
        </div>
      </Shell>
    )
  }

  function onPick(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('Please choose an image file (photo of your ID).'); return }
    if (f.size > 8 * 1024 * 1024) { setError('Image is too large — please use one under 8MB.'); return }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setScanned(false)
  }

  async function scan() {
    if (!file) return
    setScanning(true)
    setError('')
    try {
      const imageBase64 = await toBase64(file)
      const resp = await fetch('/api/extract-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mediaType: file.type }),
      })
      const data = await resp.json()
      if (data.ok) {
        setFullName(data.fullName || '')
        setIdNumber(data.idNumber || '')
        setDob(data.dob || '')
      }
      // Whether or not AI worked, reveal the (editable) fields so the user can confirm/fill.
      setScanned(true)
    } catch {
      setScanned(true) // fall back to manual entry
    } finally {
      setScanning(false)
    }
  }

  async function submit() {
    if (!file) { setError('Please upload a photo of your ID first.'); return }
    if (!fullName.trim() || !idNumber.trim()) { setError('Please fill in your full name and ID number.'); return }
    setSubmitting(true)
    setError('')
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${user.id}/id-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('kyc-documents')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr

      const { error: pErr } = await supabase.from('profiles').update({
        id_photo_path: path,
        id_full_name: fullName.trim(),
        id_number: idNumber.trim(),
        id_dob: dob.trim() || null,
        kyc_status: 'submitted',
        kyc_submitted_at: new Date().toISOString(),
      }).eq('id', user.id)
      if (pErr) throw pErr

      setDone(true)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Shell>
        <div className="text-center py-10">
          <p className="text-5xl mb-3">🎉</p>
          <h2 className="text-xl font-semibold text-gray-800">Submitted for review</h2>
          <p className="text-gray-500 text-sm mt-2">Thanks! We'll verify your ID shortly. Redirecting you to your dashboard…</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Verify your identity</h1>
      <p className="text-gray-500 text-sm mb-6">
        Upload a clear photo of your national ID. Verified accounts get a ✅ badge that builds trust with
        {profile?.role === 'tenant' ? ' landlords.' : ' tenants.'}
      </p>

      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
        {/* Upload / preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo of your national ID</label>
          {preview ? (
            <div className="relative">
              <img src={preview} alt="ID preview" className="w-full max-h-64 object-contain rounded-lg border border-gray-100 bg-gray-50" />
              <button onClick={() => fileRef.current?.click()}
                className="absolute top-2 right-2 text-xs bg-white/90 border border-gray-200 px-2 py-1 rounded-md text-gray-600 hover:bg-white">
                Change
              </button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-lg py-10 text-center hover:border-brand-300 transition-colors">
              <p className="text-3xl mb-1">🪪</p>
              <p className="text-sm text-gray-500">Tap to upload a photo of your ID</p>
              <p className="text-xs text-gray-400 mt-1">JPG or PNG, up to 8MB</p>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onPick} className="hidden" />
        </div>

        {/* Scan button */}
        {file && !scanned && (
          <button onClick={scan} disabled={scanning}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
            {scanning ? 'Reading your ID…' : '✨ Scan ID & auto-fill details'}
          </button>
        )}

        {/* Editable details */}
        {scanned && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">Please check these details match your ID and correct anything if needed.</p>
            <Field label="Full name (as on ID)" value={fullName} onChange={setFullName} placeholder="e.g. Jane Wanjiru Kamau" />
            <Field label="ID number" value={idNumber} onChange={setIdNumber} placeholder="e.g. 12345678" />
            <Field label="Date of birth" value={dob} onChange={setDob} placeholder="e.g. 1995-04-12 (optional)" />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {scanned && (
          <button onClick={submit} disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
            {submitting ? 'Submitting…' : 'Submit for verification'}
          </button>
        )}

        <p className="text-xs text-gray-400 text-center">🔒 Your ID is stored securely and only seen by our verification team.</p>
      </div>
    </Shell>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
    </div>
  )
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-brand-600">NyumbaVerified</Link>
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">← Dashboard</Link>
      </nav>
      <div className="max-w-xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}
