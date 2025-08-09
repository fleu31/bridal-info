'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY // ある場合のみ使う

export default function ContactForm(){
  const [state, setState] = useState<'idle'|'sending'|'ok'|'err'>('idle')
  const [errMsg, setErrMsg] = useState<string>('')
  const [cfToken, setCfToken] = useState<string>('')
  const start = useRef<number>(Date.now())
  const honeyRef = useRef<HTMLInputElement>(null)

  // Turnstile callback
  useEffect(()=>{
    if (!SITE_KEY) return
    ;(window as any).__onTurnstile = (token: string)=> setCfToken(token)
    return () => { delete (window as any).__onTurnstile }
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrMsg('')
    setState('sending')

    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get('name')||'').trim(),
      email: String(fd.get('email')||'').trim(),
      phone: String(fd.get('phone')||'').trim(),
      category: String(fd.get('category')||'').trim(),
      message: String(fd.get('message')||'').trim(),
      consent: fd.get('consent') === 'on',
      honey: String(fd.get('company')||'').trim(),  // ハニーポット
      t: Date.now() - start.current,
      cfToken,
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      ref: typeof document !== 'undefined' ? document.referrer : ''
    }

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await r.json()
      if (!r.ok || !data.ok) {
        setErrMsg(data?.error || '送信に失敗しました。時間をおいてお試しください。')
        setState('err')
        return
      }
      setState('ok')
      e.currentTarget.reset()
      setCfToken('')
    } catch {
      setErrMsg('通信エラーが発生しました。')
      setState('err')
    }
  }

  if (state === 'ok') {
    return (
      <div className="card">
        <div className="font-medium">送信完了</div>
        <p className="mt-2 text-sm text-neutral-700">お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。</p>
        <button className="btn mt-3" onClick={()=>setState('idle')}>戻る</button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* honeypot */}
      <input ref={honeyRef} type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">お名前 *</label>
          <input name="name" required className="mt-1 w-full border p-2 rounded-none" />
        </div>
        <div>
          <label className="text-sm">メールアドレス *</label>
          <input name="email" type="email" required className="mt-1 w-full border p-2 rounded-none" />
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
        <textarea name="message" required rows={6} className="mt-1 w-full border p-2 rounded-none" />
      </div>

      <div className="text-xs text-neutral-600">
        送信前に <a className="underline" href="/policy" target="_blank" rel="noreferrer">編集ポリシー</a> をご確認ください。
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input name="consent" type="checkbox" required />
        この内容をサイト運営者へ送信し、返信を受け取ることに同意します
      </label>

      {SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={SITE_KEY} data-callback="__onTurnstile" />
        </>
      )}

      {state === 'err' && <div className="text-sm text-red-600">{errMsg}</div>}

      <button className="btn" disabled={state==='sending'}>
        {state==='sending' ? '送信中…' : '送信する'}
      </button>
    </form>
  )
}
