'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type FieldErrors = Partial<Record<'name'|'email'|'message'|'consent'|'_global', string>>

export default function ContactForm(){
  const [state, setState] = useState<'idle'|'sending'|'ok'|'err'>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [cfToken, setCfToken] = useState<string>('')
  const start = useRef<number>(Date.now())

  useEffect(()=>{
    if (!SITE_KEY) return
    ;(window as any).__onTurnstile = (token: string)=> setCfToken(token)
    return () => { delete (window as any).__onTurnstile }
  }, [])

  function validateLocal(fd: FormData): FieldErrors {
    const e: FieldErrors = {}
    const name = String(fd.get('name')||'').trim()
    const email = String(fd.get('email')||'').trim()
    const msg = String(fd.get('message')||'').trim()
    const consent = fd.get('consent') === 'on'
    if (!name) e.name = '必須'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'メール形式が不正'
    if (msg.length < 10) e.message = '本文は10文字以上'
    if (!consent) e.consent = '同意が必要です'
    return e
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setState('sending')

    const fd = new FormData(e.currentTarget)
    const local = validateLocal(fd)
    if (Object.keys(local).length) {
      setErrors(local)
      setState('err')
      return
    }

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
        headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
        cache: 'no-store',
        body: JSON.stringify(payload)
      })
      const raw = await r.text()
      let data: any = null
      try { data = raw ? JSON.parse(raw) : null } catch { data = null }

      // 200 は原則成功扱い（サーバーが保存・通知に失敗してもユーザー体験優先）
      if (r.status === 200) {
        if (data?.errors) {
          setErrors(data.errors)
          setState('err')
          return
        }
        if (data?.ok === false) {
          setErrors({_global: String(data.error || '送信に失敗しました。')})
          setState('err')
          return
        }
        setState('ok')
        e.currentTarget.reset()
        setCfToken('')
        start.current = Date.now()
        return
      }

      // 200以外はメッセージを出す
      if (data?.errors) {
        setErrors(data.errors)
      } else if (data?.error) {
        setErrors({_global: String(data.error)})
      } else {
        setErrors({_global: `送信に失敗しました（${r.status}）`})
      }
      setState('err')
    } catch {
      setErrors({_global:'通信エラーが発生しました。'})
      setState('err')
    }
  }

  if (state === 'ok') {
    return (
      <div className="card">
        <div className="font-medium">送信完了</div>
        <p className="mt-2 text-sm text-neutral-700">お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。</p>
        <button className="btn mt-3" onClick={()=>{ setState('idle'); setErrors({}); start.current = Date.now() }}>戻る</button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">お名前 *</label>
          <input name="name" className="mt-1 w-full border p-2 rounded-none" aria-invalid={!!errors.name} />
          {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
        </div>
        <div>
          <label className="text-sm">メールアドレス *</label>
          <input name="email" type="email" className="mt-1 w-full border p-2 rounded-none" aria-invalid={!!errors.email} />
          {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
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
        <textarea name="message" rows={6} className="mt-1 w-full border p-2 rounded-none" aria-invalid={!!errors.message} />
        {errors.message && <div className="text-xs text-red-600 mt-1">{errors.message}</div>}
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

      {errors._global && <div className="text-sm text-red-600">{errors._global}</div>}

      <button className="btn" disabled={state==='sending'}>
        {state==='sending' ? '送信中…' : '送信する'}
      </button>
    </form>
  )
}
