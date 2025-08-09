import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// --- SANITY / SLACK / RESEND ENV ---
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'
const token = process.env.SANITY_API_TOKEN || ''

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
const SLACK_MENTION = process.env.SLACK_MENTION || ''
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || ''
const SLACK_CHANNEL_MAP = safeParseMap(process.env.SLACK_CHANNEL_MAP || '')

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const CONTACT_TO = process.env.CONTACT_TO || ''
const CONTACT_FROM = process.env.CONTACT_FROM || ''

// ---------- helpers ----------
function safeParseMap(json: string): Record<string,string> { try { return json ? JSON.parse(json) : {} } catch { return {} } }
function isEmail(v?: string) { return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] as string)) }
function nl2br(s: string) { return s.replace(/\n/g, '<br>') }

// ---------- GET ----------
export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      hasSanity: Boolean(projectId),
      canWriteSanity: Boolean(token),
      hasSlack: Boolean(SLACK_WEBHOOK_URL || SLACK_BOT_TOKEN),
      slackMode: SLACK_BOT_TOKEN ? 'bot' : (SLACK_WEBHOOK_URL ? 'webhook' : 'none'),
      hasResend: Boolean(RESEND_API_KEY && CONTACT_FROM && CONTACT_TO),
    }
  })
}

// ---------- POST ----------
export async function POST(req: NextRequest) {
  const diag: string[] = []
  try {
    let body: any = {}
    try { body = await req.json() } catch { body = {}; diag.push('bad_json') }

    const {
      name = '', email = '', phone = '', category = '',
      message = '', consent = false, t = 0, honey = '',
      path = '', ref = ''
    } = body || {}

    if (!name?.trim() || !isEmail(email) || !message || message.trim().length < 10 || !consent) {
      diag.push('soft_validation')
    }
    if (honey) return NextResponse.json({ ok: true, diag: [...diag, 'honeypot'] })
    if (typeof t === 'number' && t < 800) return NextResponse.json({ ok: true, diag: [...diag, 'too_fast'] })

    // save to Sanity
    let docId = ''
    if (token && projectId) {
      try {
        const client = createClient({ projectId, dataset, apiVersion, token, useCdn:false })
        const saved = await client.create({
          _type:'inquiry', name, email, phone, category, message, consent,
          path, ref, honey:Boolean(honey), createdAt:new Date().toISOString()
        })
        docId = saved?._id || ''
      } catch (e) { console.error('Sanity save error', e); diag.push('sanity_error') }
    } else {
      diag.push('no_sanity_write')
    }

    // studio deep link
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
    const proto = req.headers.get('x-forwarded-proto') || 'https'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${proto}://${host}` : '')
    const studioDeepLink = docId && siteUrl ? `${siteUrl}/studio/intent/edit/id=${docId};type=inquiry` : (siteUrl ? `${siteUrl}/studio` : '')

    // Slack notify (mailto は本文リンク)
    const slackPayload = buildSlackBlocks({ mention: SLACK_MENTION, name, email, phone, category, message, path, ref, studioDeepLink })
    let slackTs = '', slackChannel = ''
    try {
      if (SLACK_BOT_TOKEN) {
        const channel = (category && SLACK_CHANNEL_MAP[category]) || SLACK_CHANNEL_ID
        if (!channel) throw new Error('no_channel_for_bot')
        const r = await fetch('https://slack.com/api/chat.postMessage', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type':'application/json; charset=utf-8' },
          body: JSON.stringify({ channel, text: slackPayload.fallbackText, blocks: slackPayload.blocks })
        })
        const data = await r.json().catch(()=>({ok:false}))
        if (!data.ok) throw new Error('slack_api_error')
        slackTs = data.ts || ''; slackChannel = data.channel || channel
      } else if (SLACK_WEBHOOK_URL) {
        await fetch(SLACK_WEBHOOK_URL, {
          method:'POST', headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ text: slackPayload.fallbackText, blocks: slackPayload.blocks })
        })
        slackChannel = 'webhook'
      } else {
        diag.push('no_slack')
      }
    } catch (e) { console.error('Slack error', e); diag.push('slack_error') }

    // writeback (optional)
    if (docId && token && projectId) {
      try {
        const client = createClient({ projectId, dataset, apiVersion, token, useCdn:false })
        await client.patch(docId).set({ slackPosted: !!slackChannel, slackChannel, slackTs }).commit()
      } catch (e) { console.error('Sanity patch error', e) }
    }

    // email (optional)
    if (RESEND_API_KEY && CONTACT_FROM && CONTACT_TO) {
      try {
        const html = `
          <h2>新しいお問い合わせ</h2>
          <p><strong>名前:</strong> ${escapeHtml(name)}</p>
          <p><strong>メール:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>電話:</strong> ${escapeHtml(phone)}</p>` : ''}
          ${category ? `<p><strong>カテゴリ:</strong> ${escapeHtml(category)}</p>` : ''}
          <p><strong>本文:</strong><br>${nl2br(escapeHtml(message))}</p>
          ${studioDeepLink ? `<p><a href="${studioDeepLink}">Studioで開く</a></p>` : ''}
          <hr><p>path: ${escapeHtml(path||'')}</p><p>ref: ${escapeHtml(ref||'')}</p>`
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ from:CONTACT_FROM, to:[CONTACT_TO], subject:`お問い合わせ: ${name}`, html })
        })
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${RESEND_API_KEY}`, 'Content-Type':'application/json' },
          body: JSON.stringify({
            from: CONTACT_FROM, to: [email],
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

    return NextResponse.json({ ok: true, diag, docId, slack: { channel: slackChannel, ts: slackTs } })
  } catch (e:any) {
    console.error('contact api fatal', e)
    return NextResponse.json({ ok: true, diag: ['fatal_catch'] }, { status: 200 })
  }
}

// ---------- Block Kit（mailto は本文リンクで出す） ----------
function buildSlackBlocks(input: {
  mention: string, name: string, email: string, phone: string, category: string,
  message: string, path: string, ref: string, studioDeepLink: string
}) {
  const header = '新しいお問い合わせ'
  const mentionLine = input.mention ? `${input.mention} ` : ''
  const fallbackText = `${mentionLine}${header} - ${input.name} (${input.email})`

  const fields: string[] = []
  if (input.name) fields.push(`*名前:*\n${input.name}`)
  if (input.email) fields.push(`*メール:*\n${input.email}`)
  if (input.phone) fields.push(`*電話:*\n${input.phone}`)
  if (input.category) fields.push(`*カテゴリ:*\n${input.category}`)
  if (input.path) fields.push(`*from:*\n${input.path}`)
  if (input.ref) fields.push(`*ref:*\n${input.ref}`)

  // mailto（件名・本文プリセット）
  const subject = encodeURIComponent(`ブライダル美容のお問い合わせ（${input.name || 'お客様'}様）`)
  const body = encodeURIComponent(
`【${input.name || ''} 様】

お問い合わせありがとうございます。
こちらはブライダル美容医療の窓口です。以下の内容で承りました。
----------------
カテゴリ: ${input.category || '-'}
本文:
${input.message || '-'}
----------------

このメールにご返信ください。`
  )
  const mailto = input.email ? `mailto:${input.email}?subject=${subject}&body=${body}` : ''

  const blocks: any[] = [
    { type: 'header', text: { type: 'plain_text', text: header } },
    ...(input.mention ? [{ type: 'section', text: { type:'mrkdwn', text: input.mention } }] : []),
    { type: 'section', fields: fields.map(f => ({ type:'mrkdwn', text:f })) },
    { type: 'section', text: { type: 'mrkdwn', text: `*本文:*\n${input.message || '-'}` } },
    ...(mailto ? [{ type:'section', text:{ type:'mrkdwn', text:`✉️ *メール返信*: <${mailto}|メールを作成>` } }] : []),
  ]

  const actions:any[] = []
  if (input.studioDeepLink) {
    actions.push({ type:'button', text:{ type:'plain_text', text:'Studioで開く' }, url: input.studioDeepLink })
  }
  if (actions.length) blocks.push({ type:'actions', elements: actions })

  return { fallbackText, blocks }
}
