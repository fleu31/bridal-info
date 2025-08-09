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

// GETで状態確認
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

function isEmail(v?: string) { return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] as string)) }
function nl2br(s: string) { return s.replace(/\n/g, '<br>') }

export async function POST(req: NextRequest) {
  const diag: string[] = []
  try {
    let body: any = {}
    try { body = await req.json() } catch { body = {}; diag.push('bad_json') }

    const {
      name = '', email = '', phone = '', category = '',
      message = '', consent = false, t = 0, honey = '',
      cfToken = '', path = '', ref = ''
    } = body || {}

    // クライアントでも検証しているが、サーバ側でも軽く診断だけ加える
    if (!name?.trim() || !isEmail(email) || !message || message.trim().length < 10 || !consent) {
      diag.push('soft_validation')
    }

    // スパム対策
    if (honey) { diag.push('honeypot'); return NextResponse.json({ ok: true, diag }) }
    if (typeof t === 'number' && t < 800) { diag.push('too_fast'); return NextResponse.json({ ok: true, diag }) }

    // Turnstile（設定時のみ。失敗しても成功で返す）
    if (TURNSTILE_SITE && TURNSTILE_SECRET) {
      try {
        if (!cfToken) diag.push('captcha_required')
        else {
          const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          const form = new URLSearchParams()
          form.append('secret', TURNSTILE_SECRET)
          form.append('response', cfToken)
          if (ip) form.append('remoteip', ip)
          const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method:'POST', body:form })
          const vr = await r.json().catch(()=>({success:false}))
          if (!vr.success) diag.push('captcha_failed')
        }
      } catch { diag.push('captcha_verify_error') }
    }

    // Sanity保存（ある場合のみ）
    if (token && projectId) {
      try {
        const client = createClient({ projectId, dataset, apiVersion, token, useCdn:false })
        await client.create({
          _type:'inquiry', name, email, phone, category, message, consent,
          path, ref, honey:Boolean(honey), createdAt:new Date().toISOString()
        })
      } catch (e) { console.error('Sanity save error', e); diag.push('sanity_error') }
    } else {
      diag.push('no_sanity_write')
    }

    // Slack通知（任意）
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
      } catch (e) { console.error('Slack error', e); diag.push('slack_error') }
    }

    // メール通知＋自動返信（任意）
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
        // 管理者宛
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
          body:JSON.stringify({ from:CONTACT_FROM, to:[CONTACT_TO], subject:`お問い合わせ: ${name}`, html })
        })
        // 自動返信（ユーザー宛）
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
          body:JSON.stringify({
            from: CONTACT_FROM,
            to: [email],
            subject: '【自動返信】お問い合わせありがとうございます',
            html: `<p>${escapeHtml(name)} 様</p>
                   <p>お問い合わせを受け付けました。担当よりご連絡いたします。</p>
                   <hr><p>内容</p><p>${nl2br(escapeHtml(message))}</p>`
          })
        })
      } catch (e) { console.error('Resend error', e); diag.push('resend_error') }
    } else {
      diag.push('no_email')
    }

    // 常に成功として返す
    return NextResponse.json({ ok: true, diag })
  } catch (e:any) {
    console.error('contact api fatal', e)
    return NextResponse.json({ ok: true, diag: ['fatal_catch'] }, { status: 200 })
  }
}
