'use client'
import Link from 'next/link'
import { useState } from 'react'

type Item = { key:string; label:string; href:string; icon:JSX.Element }

const ACCENT = {
  bg: 'bg-emerald-50',
  bd: 'border-emerald-100',
  ink: 'text-emerald-900',
  line: 'bg-emerald-600',
}

function IconBook(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M4 6a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2V6Z" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M8 6h8" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)}
function IconFlag(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M5 21V4m0 0h9l-1.5 3L20 7H5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
)}
function IconPin(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 22s7-6.1 7-12A7 7 0 1 0 5 10c0 5.9 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7"/>
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)}
function IconCal(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)}
function IconPaper(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M4 4h13l3 3v13a2 2 0 0 1-2 2H4V4Z" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M17 4v3h3" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)}
function IconBulb(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M12 3a7 7 0 0 1 4 12c-.5.5-.8 1.2-1 2H9c-.2-.8-.5-1.5-1-2A7 7 0 0 1 12 3Z" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)}
function IconStar(){ return (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 6-5.2-2.8L6.8 19l1-6L3.5 9.2l5.9-.9L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
)}

export default function HeaderDIVE({ active = 'features' }: { active?: string }) {
  const items: Item[] = [
    { key:'features', label:'特集',       href:'/v2#features',  icon:<IconBook/> },
    { key:'course',   label:'時期別ガイド', href:'/v2#timeline', icon:<IconFlag/> },
    { key:'spots',    label:'施術・体験',   href:'/directory',    icon:<IconPin/> },
    { key:'event',    label:'イベント',     href:'/faq#event',    icon:<IconCal/> },
    { key:'season',   label:'旬情報',       href:'/faq#topics',   icon:<IconPaper/> },
    { key:'tips',     label:'お役立ち',     href:'/faq',          icon:<IconBulb/> },
    { key:'bookmark', label:'はじめて',     href:'/policy',       icon:<IconStar/> },
  ]

  const [q, setQ] = useState('')

  return (
    <div className="border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
      {/* 上の細いバー */}
      <div className="hidden md:block text-xs text-neutral-500">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-end gap-6">
          <Link href="/faq" className="hover:underline">新着情報</Link>
          <Link href="/contact" className="hover:underline">お問い合わせ</Link>
          <Link href="/policy" className="hover:underline">事業者・学術関係の皆さま</Link>
        </div>
      </div>

      {/* ロゴ＋検索＋言語 */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="no-underline">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold tracking-tight">Bridal</div>
            <div className="text-xl font-semibold text-emerald-700">Guide</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* 検索（ダミー） */}
          <form action="/search" className="hidden sm:block">
            <div className="relative">
              <input
                name="q"
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="キーワードで探す"
                className="w-64 h-9 rounded-full border border-neutral-300 bg-white px-4 pr-9 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full grid place-items-center text-neutral-500 hover:text-neutral-700" aria-label="検索">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            </div>
          </form>

          {/* 言語（擬似ドロップダウン） */}
          <details className="relative">
            <summary className="list-none cursor-pointer inline-flex items-center gap-2 px-3 h-9 rounded-full border border-neutral-300 text-sm">
              LANGUAGE
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2"/></svg>
            </summary>
            <ul className="absolute right-0 mt-2 w-40 rounded-lg border border-neutral-200 bg-white shadow">
              <li><Link href="#" className="block px-3 py-2 text-sm hover:bg-neutral-50">日本語</Link></li>
              <li><Link href="#" className="block px-3 py-2 text-sm hover:bg-neutral-50">English</Link></li>
            </ul>
          </details>
        </div>
      </div>

      {/* 大きい丸みのカテゴリナビ */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-3">
        <div className={`overflow-x-auto ${ACCENT.bg} ${ACCENT.bd} rounded-[26px] border shadow-sm`}>
          <nav className="flex divide-x divide-emerald-100 min-w-[680px]">
            {items.map((it)=>(
              <Link key={it.key} href={it.href} className={`relative flex-1 min-w-[120px] flex items-center justify-center gap-2 px-5 py-4 text-sm no-underline ${ACCENT.ink} hover:bg-white/70`}>
                <span className="opacity-80">{it.icon}</span>
                <span className="font-medium">{it.label}</span>
                {active===it.key && (
                  <span className={`pointer-events-none absolute left-4 right-4 bottom-0 h-[3px] ${ACCENT.line} rounded-full`} />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
