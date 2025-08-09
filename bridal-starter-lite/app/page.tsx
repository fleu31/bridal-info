'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
export default function Home(){
  return (<div>
    <Header/>
    <section className="border-b">
      <div className="container py-16 grid md:grid-cols-2 gap-10 items-end">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">結婚式までの美容医療情報サイト</h1>
          <p className="mt-3 text-sm text-neutral-600">本サイトは医療機関ではありません。掲載内容は一般情報であり、個別の診断・治療の提案ではありません。適応判断・同意取得は医療機関で行われます。</p>
          <ul className="mt-6 space-y-2 text-sm text-neutral-700">
            <li>・挙式/前撮りから逆算した「やる/やらない」を明確化</li>
            <li>・直前は<strong>仕上げケア（導入・鎮静）</strong>中心</li>
            <li>・赤み/毛穴/ニキビ/背中など悩み別の読み物</li>
          </ul>
          <div className="mt-8 grid md:grid-cols-3 gap-3 text-sm">
            <Link href="/tools/checker" className="btn no-underline">逆算チェッカー</Link>
            <Link href="/faq" className="btn no-underline">FAQ</Link>
            <Link href="/policy" className="btn no-underline">編集ポリシー</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-md bg-neutral-100"/>
      </div>
    </section>
    <section id="timeline" className="container py-16 border-t">
      <h2 className="text-2xl md:text-3xl font-semibold">逆算カレンダー（一般情報）</h2>
      <div className="mt-6 grid md:grid-cols-4 gap-6 text-sm">
        {['T−6〜3か月','T−8〜4週','T−2〜1週','T−1〜3日'].map((t)=>(
          <div key={t} className="card"><div className="font-medium">{t}</div></div>
        ))}
      </div>
    </section>
    <section id="tools" className="container py-16 border-t">
      <h2 className="text-2xl md:text-3xl font-semibold">ツール</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm">
        <div className="card"><div className="font-medium">逆算チェッカー</div><p className="mt-2 text-neutral-700">挙式/前撮り日からできる/避けるを整理。</p><a className="btn mt-3 no-underline" href="/tools/checker">開く</a></div>
        <div className="card"><div className="font-medium">72時間前チェック</div><p className="mt-2 text-neutral-700">仕上げに徹するための覚え書き。</p></div>
        <div className="card"><div className="font-medium">編集ポリシー</div><p className="mt-2 text-neutral-700">体験談/断定表現なし、収益開示あり。</p><a className="btn mt-3 no-underline" href="/policy">読む</a></div>
      </div>
    </section>
    <Footer/>
  </div>)
}
