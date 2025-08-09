import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'
const token = process.env.SANITY_API_TOKEN || ''

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const CONTACT_TO = process.env.CONTACT_TO || ''
const CONTACT_FROM = process.env.CONTACT_FROM || ''
const TURNSTILE_SITE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''

// ---- 診断用 GET（ブラウザで /api/contact を開くと状態が見える） ----
export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      hasSanity: Boolean(projectId),
      canWriteSanity: Boolean(token),
      hasResend: Boolean(RESEND_API_KEY && CONTACT_FROM && CONTACT_TO),
      hasSlack: Boolean(SLACK_WEBHOOK_URL),
      hasTurnstile: Boolean(TURNSTILE_SITE && TURNSTILE_SECRET),
    }
  })
}

function isEmail(v?: string) {
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] as string))
}
function nl2br(s: string) { return s.replace(/\n/g, '<br>') }

export async function POST(req: NextRequest) {
  try {
    let body: any = {}
    try { body = await req.json() } catch { body = {} }

    const {
      name = '', email = '', phone = '', category = '',
      message = '', consent = false, t = 0, honey = '',
      cfToken = '', path = '', ref = ''
    } = body || {}

    // 基本バリデーション
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = '必須'
    if (!isEmail(email)) errors.email = 'メール形式が不正'
    if (!message || String(message).trim().length < 10) errors.message = '本文は10文字以上'
    if (!consent) errors.consent = '同意が必要です'
    if (Object.keys(errors).length) return NextResponse.json({ ok:false, errors }, { status:400 })

    // スパム対策
    if (honey) return NextResponse.json({ ok:true }) // 受理した体で終了
    if (typeof t === 'number' && t < 800) return NextResponse.json({ ok:false, error:'too_fast' }, { status:429 })

    // Turnstile（設定されている時だけ）
    if (TURNSTILE_SITE && TURNSTILE_SECRET) {
      try {
        if (!cfToken) return NextResponse.json({ ok:false, error:'captcha_required' }, { status:400 })
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        const form = new URLSearchParams()
        form.append('secret', TURNSTILE_SECRET)
        form.append('response', cfToken)
        if (ip) form.append('remoteip', ip)
        const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method:'POST', body:form })
        const vr = await r.json().catch(()=>({success:false}))
        if (!vr.success) return NextResponse.json({ ok:false, error:'captcha_failed' }, { status:400 })
      } catch { return NextResponse.json({ ok:false, error:'captcha_verify_error' }, { status:400 }) }
    }

    // Sanity保存（失敗しても続行）
    if (token && projectId) {
      try {
        const client = createClient({ projectId, dataset, apiVersion, token, useCdn:false })
        await client.create({
          _type:'inquiry', name, email, phone, category, message, consent,
          path, ref, honey:Boolean(honey), createdAt:new Date().toISOString()
        })
      } catch (e) { console.error('Sanity save error', e) }
    }

    // Slack（任意）
    if (SLACK_WEBHOOK_URL) {
      try {
        const text = [
          '*新しいお問い合わせ*',
          `名前: ${name}`,
          `メール: ${email}${phone?`／電話:${phone}`:''}`,
          `カテゴリ: ${category || '-'}`,
          `本文: ${String(message).slice(0, 1000)}`,
          `from: ${path || '-'} ref: ${ref || '-'}`
        ].join('\n')
        await fetch(SLACK_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ text }) })
      } catch (e) { console.error('Slack error', e) }
    }

    // メール（任意）
    if (RESEND_API_KEY && CONTACT_FROM && CONTACT_TO) {
      try {
        const html = `
          <h2>新しいお問い合わせ</h2>
          <p><strong>名前:</strong> ${escapeHtml(name)}</p>
          <p><strong>メール:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>電話:</strong> ${escapeHtml(phone)}</p>` : ''}
          ${category ? `<p><strong>カテゴリ:</strong> ${escapeHtml(category)}</p>` : ''}
          <p><strong>本文:</strong><br>${nl2br(escapeHtml(message))}</p>
          <hr><p>path: ${escapeHtml(path||'')}</p><p>ref: ${escapeHtml(ref||'')}</p>`
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
          body:JSON.stringify({ from:CONTACT_FROM, to:[CONTACT_TO], subject:`お問い合わせ: ${name}`, html })
        })
      } catch (e) { console.error('Resend error', e) }
    }

    // 何があってもOKを返す
    return NextResponse.json({ ok:true })
  } catch (e:any) {
    console.error('contact api fatal', e)
    // 絶対にJSONで返す
    return NextResponse.json({ ok:false, error:'server_error' }, { status:200 })
  }
}
