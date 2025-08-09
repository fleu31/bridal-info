import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'
const token = process.env.SANITY_API_TOKEN

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_TO = process.env.CONTACT_TO
const CONTACT_FROM = process.env.CONTACT_FROM

const TURNSTILE_SITE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

function isEmail(v?: string) {
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      name = '',
      email = '',
      phone = '',
      category = '',
      message = '',
      consent = false,
      t = 0,               // 経過ミリ秒
      honey = '',          // ハニーポット
      cfToken = '',        // Turnstileトークン
      path = '',
      ref = ''
    } = body || {}

    // --- 基本バリデーション ---
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = '必須'
    if (!isEmail(email)) errors.email = 'メール形式が不正'
    if (!message || String(message).trim().length < 10) errors.message = '本文は10文字以上'
    if (!consent) errors.consent = '同意が必要です'
    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 })
    }

    // --- スパム対策 ---
    if (honey && String(honey).trim().length > 0) {
      // ハニーポット → 受理したふりをして終了
      return NextResponse.json({ ok: true })
    }
    if (typeof t === 'number' && t < 800) {
      return NextResponse.json({ ok: false, error: 'too_fast' }, { status: 429 })
    }

    // Turnstile 検証（設定されている場合のみ）
    if (TURNSTILE_SITE && TURNSTILE_SECRET) {
      if (!cfToken) {
        return NextResponse.json({ ok: false, error: 'captcha_required' }, { status: 400 })
      }
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      const form = new URLSearchParams()
      form.append('secret', TURNSTILE_SECRET)
      form.append('response', cfToken)
      if (ip) form.append('remoteip', ip)
      const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: form
      })
      const vr = await r.json()
      if (!vr.success) {
        return NextResponse.json({ ok: false, error: 'captcha_failed' }, { status: 400 })
      }
    }

    // --- Sanityに保存（任意） ---
    if (token && projectId) {
      const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })
      await client.create({
        _type: 'inquiry',
        name, email, phone, category, message, consent,
        path, ref,
        honey: !!honey,
        createdAt: new Date().toISOString()
      })
    }

    // --- Slack 通知（任意） ---
    if (SLACK_WEBHOOK_URL) {
      const text = [
        '*新しいお問い合わせ*',
        `名前: ${name}`,
        `メール: ${email}${phone ? `／電話: ${phone}` : ''}`,
        `カテゴリ: ${category || '-'}`,
        `本文: ${String(message).slice(0, 500)}`,
        `from: ${path || '-'} ref: ${ref || '-'}`
      ].join('\n')
      await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }).catch(()=>null)
    }

    // --- Resend メール送信（任意） ---
    if (RESEND_API_KEY && CONTACT_TO && CONTACT_FROM) {
      const subject = `お問い合わせ: ${name}`
      const html = `
        <h2>新しいお問い合わせ</h2>
        <p><strong>名前:</strong> ${escapeHtml(name)}</p>
        <p><strong>メール:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>電話:</strong> ${escapeHtml(phone)}</p>` : ''}
        ${category ? `<p><strong>カテゴリ:</strong> ${escapeHtml(category)}</p>` : ''}
        <p><strong>本文:</strong><br>${nl2br(escapeHtml(message))}</p>
        <hr />
        <p>path: ${escapeHtml(path||'')}</p>
        <p>ref: ${escapeHtml(ref||'')}</p>
      `
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: CONTACT_FROM,
          to: [CONTACT_TO],
          subject,
          html
        })
      }).catch(()=>null)
    }

    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'server_error' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] as string))
}
function nl2br(s: string) {
  return s.replace(/\n/g, '<br>')
}
