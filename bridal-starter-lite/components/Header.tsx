'use client'
import Link from 'next/link'
export default function Header(){
  return (<header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
    <div className="container py-3 flex items-center justify-between">
      <div className="flex items-center gap-3"><div className="h-8 w-8 bg-neutral-900"/><span className="font-medium no-underline">BRAND（仮）</span></div>
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link className="no-underline hover:opacity-70" href="/#about">考え方</Link>
        <Link className="no-underline hover:opacity-70" href="/#timeline">逆算</Link>
        <Link className="no-underline hover:opacity-70" href="/#tools">ツール</Link>
        <Link className="no-underline hover:opacity-70" href="/policy">編集ポリシー</Link>
        <Link className="no-underline hover:opacity-70" href="/tools/checker">チェッカー</Link>
      </nav>
      <div className="small">情報提供サイト</div>
    </div>
  </header>)
}
