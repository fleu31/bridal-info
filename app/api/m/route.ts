import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const to = url.searchParams.get('to') || ''
  const s = url.searchParams.get('s') || ''   // subject (raw)
  const b = url.searchParams.get('b') || ''   // body (raw)

  const mailto = `mailto:${to}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`
  const html = `<!doctype html><meta charset="utf-8">
<title>メールを作成します…</title>
<p>メール作成を開いています。開かない場合は <a id="link" href="${mailto}">こちら</a> をクリックしてください。</p>
<script>location.href=${JSON.stringify(mailto)};</script>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' }})
}
