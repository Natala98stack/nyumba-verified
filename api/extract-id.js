// Vercel serverless function — runs on the server, NOT in the browser.
// Receives a base64 photo of a national ID and asks Claude to read the details.
// If no ANTHROPIC_API_KEY is set, it returns ok:false so the user can type details manually.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, reason: 'method_not_allowed' })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    // No key configured — let the front-end fall back to manual entry gracefully.
    return res.status(200).json({ ok: false, reason: 'no_key' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const { imageBase64, mediaType } = body
    if (!imageBase64) {
      return res.status(400).json({ ok: false, reason: 'no_image' })
    }

    const prompt =
      'This is a photo of a Kenyan national ID card. Read it and extract three fields: ' +
      'the full name, the ID number, and the date of birth. ' +
      'Respond with ONLY a JSON object and nothing else, in exactly this shape: ' +
      '{"full_name": string|null, "id_number": string|null, "dob": string|null}. ' +
      'Use null for any field you cannot read clearly. Do not include markdown or backticks.'

    const aiResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        // Haiku is cheap and reads IDs well. Switch to 'claude-sonnet-4-6' for higher accuracy.
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: imageBase64,
                },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    })

    if (!aiResp.ok) {
      const errText = await aiResp.text()
      console.error('Anthropic error:', aiResp.status, errText)
      return res.status(200).json({ ok: false, reason: 'ai_error' })
    }

    const data = await aiResp.json()
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()

    let parsed = {}
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    } catch {
      return res.status(200).json({ ok: false, reason: 'parse_error', raw: text })
    }

    return res.status(200).json({
      ok: true,
      fullName: parsed.full_name || '',
      idNumber: parsed.id_number || '',
      dob: parsed.dob || '',
    })
  } catch (err) {
    console.error('extract-id crashed:', err)
    return res.status(200).json({ ok: false, reason: 'server_error' })
  }
}
