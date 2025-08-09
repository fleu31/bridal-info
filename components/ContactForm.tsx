'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function ContactForm(){
  const [state, setState] = useState<'idle'|'sending'|'ok'|'err'>('idle')
  const [msg, setMsg] = useState<string>('') // エラー/案内の表示
  const [cfToken, setCfToken] = useState<string>('')
  const start = useRef<number>(Date.now())

  useEffect(()=>{
    if (!SITE_KEY) return
    ;(window as any).__onTurnstile = (token: string)=> setCfToken(token)
    return () => { delete (window as any).__onTurnstile }
  }, [])

  function validate(fd: FormData){
    const name = String(fd.get('name')||'').trim()
    const email = String(fd.get('email')||'').trim()
    const text = String(fd.get('message')||'').trim()
    const consent = fd.get('consent') === 'on'
    if (!name) return 'お名前は必須です'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'メール形式が不正です'
    if (text.length < 10) return '本文は10文字以上で入力してください'
    if (!consent) return '同意にチェックしてください'
    return ''
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setMsg('')
    setState('sending')

    const fd = new FormData(e.currentTarget)
    const v = validate(fd)
    if (v) { setMsg(v); setState('err'); return }

    const payload = {
      name: String(fd.get('name')||'').trim(),
      email: String(fd.get('email')||'').trim(),
      phone: String(fd.get('phone')||'').trim(),
      category: String(fd.get('category')||'').trim(),
      message: String(fd.get('message')||'').trim(),
      consent: fd.get('consent') === 'on',
      honey: String(fd.get('company')||'').trim(),
      t: Date.now() - start.current,
      cfToken,
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      ref: typeof document !== 'undefined' ? document.referrer : ''
    }

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        cache: 'no-store',
        body: JSON.stringify(payload)
      })

      // ★ 本質：200 系なら問答無用で成功扱いにする（レスポンス本文は見ない）
      if (r.ok) {
        setState('ok')
        e.currentTarget.reset()
        setCfToken('')
        start.current = Date.now()
        return
      }

      // 200 以外だけメッセージ表示（本文がJSONでなくてもOK）
      const text = await r.text().catch(()=> '')
      setMsg(text || `送信に失敗しました（${r.status}）`)
      setState('err')
    } catch {
      setMsg('通信エラーが発生しました。')
      setState('err')
    }
  }

  if (state === 'ok') {
    return (
      <div className="card">
        <div className="font-medium">送信完了</div>
        <p className="mt-2 text-sm text-neutral-700">
          お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。
        </p>
        <div className="text-xs text-neutral-400 mt-2">form v4</div>
        <button className="btn mt-3" onClick={()=>{ setState('idle'); setMsg(''); start.current = Date.now() }}>戻る</button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {/* honeypot */}
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">お名前 *</label>
          <input name="name" className="mt-1 w-full border p-2 rounded-none" />
        </div>
        <div>
          <label className="text-sm">メールアドレス *</label>
          <input name="email" type="email" className="mt-1 w-full border p-2 rounded-none" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">電話番号（任意）</label>
          <input name="phone" type="tel" className="mt-1 w-full border p-2 rounded-none" />
        </div>
        <div>
          <label className="text-sm">ご相談カテゴリ（任意）</label>
          <select name="category" className="mt-1 w-full border p-2 rounded-none">
            <option value="">未選択</option>
            <option>逆算の相談</option>
            <option>施術の可否</option>
            <option>スケジュール相談</option>
            <option>その他</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm">本文 *</label>
        <textarea name="message" rows={6} className="mt-1 w-full border p-2 rounded-none" />
      </div>

      <div className="text-xs text-neutral-600">
        送信前に <a className="underline" href="/policy" target="_blank" rel="noreferrer">編集ポリシー</a> をご確認ください。
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input name="consent" type="checkbox" />
        この内容をサイト運営者へ送信し、返信を受け取ることに同意します
      </label>

      {SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={SITE_KEY} data-callback="__onTurnstile" />
        </>
      )}

      {msg && <div className="text-sm text-red-600">{msg}</div>}

      <button className="btn" disabled={state==='sending'}>
        {state==='sending' ? '送信中…' : '送信する'}
      </button>

      {/* 現在のビルドが反映されたか確認用 */}
      <div className="text-xs text-neutral-400 mt-2">form v4</div>
    </form>
  )
}
