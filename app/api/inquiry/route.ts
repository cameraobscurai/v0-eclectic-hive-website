import { type NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { z } from 'zod'
import { escapeHtml, sanitizeEmailHeader } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { Redis } from '@upstash/redis'

// ─── Rate limiting with Upstash Redis ─────────────────────────────────────────

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Rate limit: 5 inquiries per IP per hour, 10 per email per day
const RATE_LIMIT_IP_MAX = 5
const RATE_LIMIT_IP_WINDOW = 60 * 60 // 1 hour in seconds
const RATE_LIMIT_EMAIL_MAX = 10
const RATE_LIMIT_EMAIL_WINDOW = 60 * 60 * 24 // 24 hours in seconds

async function checkRateLimit(ip: string, email: string): Promise<{ allowed: boolean; reason?: string }> {
  const ipKey = `inquiry:ip:${ip}`
  const emailKey = `inquiry:email:${email.toLowerCase()}`

  // Check IP rate limit
  const ipCount = await redis.incr(ipKey)
  if (ipCount === 1) {
    await redis.expire(ipKey, RATE_LIMIT_IP_WINDOW)
  }
  if (ipCount > RATE_LIMIT_IP_MAX) {
    return { allowed: false, reason: 'Too many inquiries. Please try again later.' }
  }

  // Check email rate limit
  const emailCount = await redis.incr(emailKey)
  if (emailCount === 1) {
    await redis.expire(emailKey, RATE_LIMIT_EMAIL_WINDOW)
  }
  if (emailCount > RATE_LIMIT_EMAIL_MAX) {
    return { allowed: false, reason: 'Too many inquiries from this email. Please try again tomorrow.' }
  }

  return { allowed: true }
}

// ─── Zod schema with length limits ────────────────────────────────────────────

const InquirySchema = z.object({
  clientType:  z.enum(['planner', 'direct']).nullable(),
  name:        z.string().min(2).max(100),
  company:     z.string().max(100).default(''),
  eventType:   z.enum(['wedding', 'corporate', 'social', 'nonprofit']).nullable(),
  serviceType: z.enum(['full-design', 'production', 'rental']).nullable(),
  eventDate:   z.string().max(50).default(''),
  location:    z.string().max(200).default(''),
  budgetRange: z.enum(['under-10k', '10-25k', '25-50k', '50-100k', 'over-100k']).nullable(),
  vision:      z.string().min(1).max(2000),
  email:       z.string().email().max(254),
  phone:       z.string().max(30).default(''),
})

type InquiryPayload = z.infer<typeof InquirySchema>

// ─── Label maps ───────────────────────────────────────────────────────────────

const CLIENT: Record<string, string> = {
  planner: 'Event Planner / Creative Partner',
  direct:  'Direct Client',
}
const EVENT: Record<string, string> = {
  wedding:   'Wedding',
  corporate: 'Corporate / Incentive Travel',
  social:    'Social Celebration',
  nonprofit: 'Non-Profit / Fundraiser',
}
const SERVICE: Record<string, string> = {
  'full-design': 'Full Design + Production',
  production:    'Production Management Only',
  rental:        'Rental Collection Access',
}
const BUDGET: Record<string, string> = {
  'under-10k':  'Under $10,000',
  '10-25k':     '$10,000 – $25,000',
  '25-50k':     '$25,000 – $50,000',
  '50-100k':    '$50,000 – $100,000',
  'over-100k':  '$100,000+',
}

// ─── Email HTML ───────────────────────────────────────────────────────────────

function buildEmailHtml(d: InquiryPayload): string {
  // All user values are HTML-escaped before interpolation
  const safeName     = escapeHtml(d.name)
  const safeCompany  = escapeHtml(d.company)
  const safeDate     = escapeHtml(d.eventDate)
  const safeLocation = escapeHtml(d.location)
  const safeVision   = escapeHtml(d.vision)
  const safePhone    = escapeHtml(d.phone)

  // Email address: HTML-escaped for display in the table row,
  // URL-encoded for the mailto: href (two different contexts, two helpers)
  const safeEmailDisplay = escapeHtml(d.email)
  const safeEmailHref    = encodeURIComponent(d.email)
  const safeFirstName    = escapeHtml(d.name.split(' ')[0])

  const rows: [string, string][] = [
    ['Type',     d.clientType  ? CLIENT[d.clientType]   : '—'],
    ['Name',     safeName      || '—'],
    ...(safeCompany ? [['Studio',   safeCompany]  as [string, string]] : []),
    ['Event',    d.eventType   ? EVENT[d.eventType]     : '—'],
    ['Service',  d.serviceType ? SERVICE[d.serviceType] : '—'],
    ['Date',     safeDate      || '—'],
    ['Location', safeLocation  || '—'],
    ['Budget',   d.budgetRange ? BUDGET[d.budgetRange]  : '—'],
    ['Email',    safeEmailDisplay || '—'],
    ...(safePhone ? [['Phone', safePhone] as [string, string]] : []),
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
<body style="margin:0;padding:0;background:#f5f2ed;font-family:'Saol Display',Georgia,serif">
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
      ${d.vision ? `<tr>
        <td style="padding:0 48px 32px">
          <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;
                    text-transform:uppercase;color:#8a8a8a">Vision</p>
          <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.8;
                    font-style:italic">&ldquo;${safeVision}&rdquo;</p>
        </td>
      </tr>` : ''}

      <!-- CTA -->
      <tr>
        <td style="padding:32px 48px 40px;border-top:1px solid #e8e2da">
          <a href="mailto:${safeEmailHref}?subject=${encodeURIComponent('Re: Your Eclectic Hive Inquiry')}"
             style="display:inline-block;padding:12px 24px;background:#1a1a1a;
                    color:#f5f2ed;font-size:11px;letter-spacing:0.2em;
                    text-transform:uppercase;text-decoration:none">
            Reply to ${safeFirstName}
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

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = InquirySchema.safeParse(body)
  if (!parsed.success) {
    // Return a generic message to the client — never expose Zod internals
    return NextResponse.json({ error: 'Invalid inquiry' }, { status: 422 })
  }

  const data = parsed.data

  // ─── Rate limiting ────────────────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    ?? request.headers.get('x-real-ip') 
    ?? 'unknown'
  
  const rateLimit = await checkRateLimit(ip, data.email)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: rateLimit.reason }, 
      { status: 429 }
    )
  }

  // ─── Save to database first ───────────────────────────────────────────────
  const supabase = await createClient()
  
  const { data: inquiry, error: dbError } = await supabase
    .from('inquiries')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      event_type: data.eventType,
      event_date: data.eventDate || null,
      guest_count: null, // Not in current form
      location: data.location || null,
      budget: data.budgetRange,
      message: data.vision,
      referral_source: data.clientType,
      status: 'new',
      email_sent: false,
    })
    .select('id')
    .single()

  if (dbError) {
    console.error('[inquiry] Database error:', dbError)
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
  }

  // ─── Send email in background using waitUntil ─────────────────────────────
  // This returns the 200 immediately so the user doesn't wait for Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL       = process.env.INQUIRY_TO_EMAIL ?? 'hello@eclectichive.com'

  if (RESEND_API_KEY) {
    // Fire off email in background - user sees success immediately
    waitUntil(sendInquiryEmail(data, inquiry.id, RESEND_API_KEY, TO_EMAIL))
  } else {
    console.log('[inquiry] No RESEND_API_KEY - inquiry saved to database only')
  }

  return NextResponse.json({ 
    ok: true, 
    id: inquiry.id,
  })
}

// ─── Background email sender ──────────────────────────────────────────────────
async function sendInquiryEmail(
  data: InquiryPayload, 
  inquiryId: string, 
  apiKey: string, 
  toEmail: string
) {
  const supabase = await createClient()
  
  // Subject sanitised to remove CR/LF (email header injection prevention)
  const subject = [
    'New inquiry —',
    sanitizeEmailHeader(data.name),
    data.company ? `· ${sanitizeEmailHeader(data.company)}` : '',
    `· ${data.eventType ?? 'event'}`,
  ].filter(Boolean).join(' ')

  let emailSent = false
  let emailError: string | null = null

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     'Eclectic Hive Website <noreply@eclectichive.com>',
        to:       [toEmail],
        reply_to: data.email,
        subject,
        html:     buildEmailHtml(data),
      }),
    })

    if (emailRes.ok) {
      emailSent = true
    } else {
      emailError = await emailRes.text()
      console.error('[inquiry] Resend error:', emailError)
    }
  } catch (e) {
    emailError = e instanceof Error ? e.message : 'Email send failed'
    console.error('[inquiry] Email exception:', emailError)
  }

  // Update the inquiry record with email status
  await supabase
    .from('inquiries')
    .update({ email_sent: emailSent, email_error: emailError })
    .eq('id', inquiryId)
}
