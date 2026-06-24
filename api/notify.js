// Vercel serverless function — sends notification emails via Resend.
// SECURITY: the browser only sends a `type` + an id. We look up the real
// recipient email server-side using the Supabase service role, so this
// endpoint can never be abused to send mail to arbitrary addresses.

import { createClient } from '@supabase/supabase-js'

const FROM = process.env.FROM_EMAIL || 'NyumbaVerified <onboarding@resend.dev>'
const BRAND = '#1D9E75'

function shell(title, lines) {
  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1f2937">
    <div style="font-size:20px;font-weight:800;color:${BRAND};margin-bottom:16px">NyumbaVerified</div>
    <div style="background:#fff;border:1px solid #eef0f2;border-radius:14px;padding:24px">
      <h2 style="margin:0 0 12px;font-size:18px;color:#111827">${title}</h2>
      ${lines.map((l) => `<p style="margin:0 0 10px;font-size:14px;line-height:1.55;color:#4b5563">${l}</p>`).join('')}
      <a href="https://nyumba-verified.vercel.app/dashboard"
         style="display:inline-block;margin-top:14px;background:${BRAND};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:9px">
        Open NyumbaVerified
      </a>
    </div>
    <p style="font-size:11px;color:#9ca3af;margin-top:14px">You received this because you have an account on NyumbaVerified — trusted housing for Kenya.</p>
  </div>`
}

async function sendEmail(to, subject, html) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  if (!resp.ok) {
    const t = await resp.text()
    throw new Error(`Resend ${resp.status}: ${t}`)
  }
  return resp.json()
}

function fmtDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('en-KE', {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey || !process.env.RESEND_API_KEY) {
    console.error('notify: missing env vars')
    return res.status(200).json({ ok: false, reason: 'not_configured' })
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const { type, viewingId, reportId } = body

    async function emailFor(profileId) {
      const { data, error } = await admin.auth.admin.getUserById(profileId)
      if (error) throw error
      return data?.user?.email
    }

    if (type === 'viewing_created' || type === 'viewing_confirmed') {
      const { data: v, error } = await admin
        .from('viewings')
        .select('*, listings(title, location_name), tenant:tenant_id(full_name), landlord:landlord_id(full_name)')
        .eq('id', viewingId)
        .single()
      if (error || !v) return res.status(200).json({ ok: false, reason: 'viewing_not_found' })

      const place = v.listings?.title || 'your listing'
      const when = fmtDate(v.scheduled_at)

      if (type === 'viewing_created') {
        const to = await emailFor(v.landlord_id)
        if (!to) return res.status(200).json({ ok: false, reason: 'no_landlord_email' })
        await sendEmail(
          to,
          `New viewing request — ${place}`,
          shell('You have a new viewing request', [
            `<strong>${v.tenant?.full_name || 'A tenant'}</strong> requested to view <strong>${place}</strong>.`,
            `Requested time: <strong>${when}</strong>`,
            `The KSh ${v.fee_amount} viewing fee is held safely in escrow until the visit is confirmed.`,
          ])
        )
      } else {
        const to = await emailFor(v.tenant_id)
        if (!to) return res.status(200).json({ ok: false, reason: 'no_tenant_email' })
        await sendEmail(
          to,
          `Viewing confirmed — ${place}`,
          shell('Your viewing is confirmed', [
            `Good news — your viewing for <strong>${place}</strong> has been confirmed.`,
            `Time: <strong>${when}</strong>`,
            `Please arrive on time. Your escrow is released to the landlord only after you confirm the visit happened.`,
          ])
        )
      }
      return res.status(200).json({ ok: true })
    }

    if (type === 'fraud_reported') {
      const { data: r, error } = await admin
        .from('fraud_reports')
        .select('*, reported:reported_id(full_name), reporter:reporter_id(full_name)')
        .eq('id', reportId)
        .single()
      if (error || !r) return res.status(200).json({ ok: false, reason: 'report_not_found' })

      let to = process.env.ADMIN_EMAIL
      if (!to) {
        const { data: admins } = await admin.from('profiles').select('id').eq('role', 'admin').limit(1)
        if (admins?.[0]) to = await emailFor(admins[0].id)
      }
      if (!to) return res.status(200).json({ ok: false, reason: 'no_admin_email' })

      await sendEmail(
        to,
        '🚨 New fraud report',
        shell('A new fraud report was filed', [
          `Reported user: <strong>${r.reported?.full_name || 'Unknown'}</strong>`,
          `Filed by: <strong>${r.reporter?.full_name || 'Unknown'}</strong>`,
          `Reason: ${r.reason || '—'}`,
          `Review it in the admin Fraud Reports panel.`,
        ])
      )
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ ok: false, reason: 'unknown_type' })
  } catch (err) {
    console.error('notify crashed:', err)
    return res.status(200).json({ ok: false, reason: 'server_error', detail: String(err.message || err) })
  }
}
