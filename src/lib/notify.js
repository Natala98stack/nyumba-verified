// Fire-and-forget email trigger. Never blocks or breaks the UI if email fails.
export async function notify(type, payload = {}) {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...payload }),
    })
  } catch (err) {
    console.error('notify failed (non-blocking):', err)
  }
}
