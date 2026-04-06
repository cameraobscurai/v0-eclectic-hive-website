import { type NextRequest, NextResponse } from 'next/server'

// ─── Types ────────────────────────────────────────────────────────────────────

interface InquiryPayload {
  clientType: 'planner' | 'direct' | null
  name: string
  company: string
  eventType: 'wedding' | 'corporate' | 'social' | 'nonprofit' | null
  serviceType: 'full-design' | 'production' | 'rental' | null
  eventDate: string
  location: string
  budgetRange: string | null
  vision: string
  email: string
  phone: string
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const CLIENT: Record<string, string> = {
  planner: 'Event Planner / Creative Partner',
  direct: 'Direct Client',
}
const EVENT: Record<string, string> = {
  wedding: 'Wedding',
  corporate: 'Corporate / Incentive Travel',
  social: 'Social Celebration',
  nonprofit: 'Non-Profit / Fundraiser',
}
const SERVICE: Record<string, string> = {
  'full-design': 'Full Design + Production',
  production: 'Production Management Only',
  rental: 'Rental Collection Access',
}
const BUDGET: Record<string, string> = {
  'under-10k': 'Under $10,000',
  '10-25k': '$10,000 – $25,000',
  '25-50k': '$25,000 – $50,000',
  '50-100k': '$50,000 – $100,000',
  'over-100k': '$100,000+',
}

// ─── Email HTML ───────────────────────────────────────────────────────────────

function buildEmailHtml(d: InquiryPayload): string {
  const rows: [string, string][] = [
    ['Type', d.clientType ? CLIENT[d.clientType] : '—'],
    ['Name', d.name || '—'],
    ...(d.company ? [['Studio', d.company] as [string, string]] : []),
    ['Event', d.eventType ? EVENT[d.eventType] : '—'],
    ['Service', d.serviceType ? SERVICE[d.serviceType] : '—'],
    ['Date', d.eventDate || '—'],
    ['Location', d.location || '—'],
    ['Budget', d.budgetRange ? BUDGET[d.budgetRange] : '—'],
    ['Email', d.email || '—'],
    ...(d.phone ? [['Phone', d.phone] as [string, string]] : []),
  ]

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 20px 8px 0;color:#8a8a8a;font-size:11px;
                   letter-spacing:0.1em;text-transform:uppercase;
                   white-space:nowrap;vertical-align:top">${label}</td>
        <td style="padding:8px 0;color:#1a1a1a;font-size:14px;
                   vertical-align:top">${value}</td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:48px 24px">
    <table width="560" cellpadding="0" cellspacing="0"
           style="background:#fff;max-width:560px;width:100%">

      <!-- Header -->
      <tr>
        <td style="padding:40px 48px 32px;border-bottom:1px solid #e8e2da">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;
                    text-transform:uppercase;color:#8a8a8a">New Inquiry</p>
          <h1 style="margin:0;font-size:28px;font-weight:300;font-style:italic;
                     color:#1a1a1a;letter-spacing:-0.02em">Eclectic Hive</h1>
        </td>
      </tr>

      <!-- Details table -->
      <tr>
        <td style="padding:32px 48px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${tableRows}
          </table>
        </td>
      </tr>

      <!-- Vision block -->
      ${
        d.vision
          ? `<tr>
        <td style="padding:0 48px 32px">
          <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;
                    text-transform:uppercase;color:#8a8a8a">Vision</p>
          <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.8;
                    font-style:italic">"${d.vision}"</p>
        </td>
      </tr>`
          : ''
      }

      <!-- CTA -->
      <tr>
        <td style="padding:32px 48px 40px;border-top:1px solid #e8e2da">
          <a href="mailto:${d.email}?subject=Re: Your Eclectic Hive Inquiry"
             style="display:inline-block;padding:12px 24px;background:#1a1a1a;
                    color:#f5f2ed;font-size:11px;letter-spacing:0.2em;
                    text-transform:uppercase;text-decoration:none">
            Reply to ${d.name.split(' ')[0]}
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:16px 48px 32px;background:#f5f2ed">
          <p style="margin:0;font-size:11px;color:#8a8a8a;letter-spacing:0.05em">
            Eclectic Hive · 999 Tejon St, Denver, CO 80204
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValid(data: unknown): data is InquiryPayload {
  if (!data || typeof data !== 'object') return false
  const d = data as Partial<InquiryPayload>
  return (
    typeof d.name === 'string' &&
    d.name.trim().length > 1 &&
    typeof d.email === 'string' &&
    d.email.includes('@') &&
    typeof d.vision === 'string' &&
    d.vision.trim().length > 0
  )
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isValid(body)) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 422 }
    )
  }

  const data = body

  // ── Dev fallback ────────────────────────────────────────────────────────
  // If RESEND_API_KEY isn't set, log to console and return success.
  // You won't lose leads — check Vercel function logs.
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL =
    process.env.INQUIRY_TO_EMAIL ?? 'hello@eclectichive.com'

  if (!RESEND_API_KEY) {
    console.log(
      '[inquiry] No RESEND_API_KEY — logging submission:\n',
      JSON.stringify(data, null, 2)
    )
    return NextResponse.json({ ok: true, dev: true })
  }

  // ── Send via Resend ─────────────────────────────────────────────────────
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Eclectic Hive Website <noreply@eclectichive.com>',
      to: [TO_EMAIL],
      reply_to: data.email,
      subject: `New inquiry — ${data.name}${data.company ? ` · ${data.company}` : ''} · ${data.eventType ?? 'event'}`,
      html: buildEmailHtml(data),
    }),
  })

  if (!emailRes.ok) {
    const err = await emailRes.text()
    console.error('[inquiry] Resend error:', err)
    return NextResponse.json(
      { error: 'Email delivery failed' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
