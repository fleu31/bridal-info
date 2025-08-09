import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// --- ENV ---
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'
const token = process.env.SANITY_API_TOKEN || ''
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
const SLACK_MENTION = process.env.SLACK_MENTION || ''
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || ''
function isEmail(v?: string){return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function escapeHtml(s:string){return s.replace(/[&<>"']/g,(m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] as string))}
function nl2br(s:string){return s.replace(/\n/g,'<br>')}

// ---------- GET ----------
export async function GET() {
  return NextResponse.json({
    ok:true,
    env:{ hasSanity:!!projectId, canWriteSanity:!!token, hasSlack:!!(SLACK_WEBHOOK_URL||SLACK_BOT_TOKEN) }
  })
}

// ---------- POST ----------
export async function POST(req: NextRequest) {
  const diag:string[]=[]
  try{
    let body:any={}; try{ body = await req.json() }catch{ diag.push('bad_json') }
    const { name='', email='', phone='', category='', message='', consent=false, t=0, honey='', path='', ref='' } = body||{}

    if(!name?.trim() || !isEmail(email) || !message || message.trim().length<10 || !consent) diag.push('soft_validation')
    if(honey) return NextResponse.json({ok:true, diag:[...diag,'honeypot']})
    if(typeof t==='number' && t<800) return NextResponse.json({ok:true, diag:[...diag,'too_fast']})

    // Save to Sanity
    let docId=''
    if(token && projectId){
      try{
        const client = createClient({projectId,dataset,apiVersion,token,useCdn:false})
        const saved = await client.create({_type:'inquiry', name,email,phone,category,message,consent,path,ref,honey:Boolean(honey),createdAt:new Date().toISOString()})
        docId = saved?._id || ''
      }catch(e){ console.error('Sanity save error',e); diag.push('sanity_error') }
    }else diag.push('no_sanity_write')

    // Site URL
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
    const proto = req.headers.get('x-forwarded-proto') || 'https'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${proto}://${host}` : '')

    // Studio deep link（; をエンコードする）
    const studioDeepLink = (docId && siteUrl)
      ? `${siteUrl}/studio/intent/edit/${encodeURIComponent(`id=${docId};type=inquiry`)}`
      : (siteUrl ? `${siteUrl}/studio` : '')

    // メール返信用（HTTPS → /api/m → mailto）
    const subjectText = `ブライダル美容のお問い合わせ（${name || 'お客様'}様）`
    const bodyText =
`【${name || ''} 様】

お問い合わせありがとうございます。
こちらはブライダル美容医療の窓口です。以下の内容で承りました。
----------------
カテゴリ: ${category || '-'}
本文:
${message || '-'}
----------------

このメールにご返信ください。`
    const mailtoHttpUrl = (siteUrl && email)
      ? `${siteUrl}/api/m?to=${encodeURIComponent(email)}&s=${encodeURIComponent(subjectText)}&b=${encodeURIComponent(bodyText)}`
      : ''

    // Slack（Webhook）
    try{
      if(SLACK_WEBHOOK_URL){
        const payload = buildSlackBlocks({ mention:SLACK_MENTION, name,email,phone,category,message,path,ref, studioDeepLink, mailtoHttpUrl })
        await fetch(SLACK_WEBHOOK_URL, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ text: payload.fallbackText, blocks: payload.blocks })
        })
      } else if(!SLACK_BOT_TOKEN){ diag.push('no_slack') }
    }catch(e){ console.error('Slack error',e); diag.push('slack_error') }

    return NextResponse.json({ ok:true, diag, docId })
  }catch(e:any){
    console.error('contact api fatal', e)
    return NextResponse.json({ ok:true, diag:['fatal_catch'] }, { status:200 })
  }
}

// ---------- Block Kit（mailto は HTTPSリンクで） ----------
function buildSlackBlocks(input:{
  mention:string, name:string, email:string, phone:string, category:string,
  message:string, path:string, ref:string, studioDeepLink:string, mailtoHttpUrl:string
}){
  const header='新しいお問い合わせ'
  const mentionLine = input.mention ? `${input.mention} ` : ''
  const fallbackText = `${mentionLine}${header} - ${input.name} (${input.email})`

  const fields:string[]=[]
  if(input.name) fields.push(`*名前:*\n${input.name}`)
  if(input.email) fields.push(`*メール:*\n${input.email}`)
  if(input.phone) fields.push(`*電話:*\n${input.phone}`)
  if(input.category) fields.push(`*カテゴリ:*\n${input.category}`)
  if(input.path) fields.push(`*from:*\n${input.path}`)
  if(input.ref) fields.push(`*ref:*\n${input.ref}`)

  const blocks:any[]=[
    { type:'header', text:{ type:'plain_text', text:header } },
    ...(input.mention ? [{ type:'section', text:{ type:'mrkdwn', text: input.mention } }] : []),
    { type:'section', fields: fields.map(f=>({ type:'mrkdwn', text:f })) },
    { type:'section', text:{ type:'mrkdwn', text:`*本文:*\n${input.message || '-'}` } },
    ...(input.mailtoHttpUrl ? [{ type:'section', text:{ type:'mrkdwn', text:`✉️ *メール返信*: <${input.mailtoHttpUrl}|メールを作成>` } }] : []),
  ]
  if(input.studioDeepLink){
    blocks.push({ type:'actions', elements:[{ type:'button', text:{ type:'plain_text', text:'Studioで開く' }, url: input.studioDeepLink }] })
  }
  return { fallbackText, blocks }
}
