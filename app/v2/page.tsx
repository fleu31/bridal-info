// app/v2/page.tsx
import Link from 'next/link'
import HeaderDIVE from '@/components/HeaderDIVE'

export const metadata = {
  title: 'ブライダル美容ナビ – V2a プレビュー',
  description: 'DIVE系ポータル風の見た目確認用（静的モック）',
}

// アクセント（DIVE系の赤み）
const ACCENT = 'rose-600' // 例: 'rose-600' | 'red-600'

function Chip({ children, href }: {children: React.ReactNode; href: string}) {
  return (
    <Link href={href} className="no-underline">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-neutral-800 border border-white/60 shadow-sm hover:bg-white">
        {children}
      </span>
    </Link>
  )
}

function FeatureCard({ tag, title, href }: {tag:string; title:string; href:string}) {
  return (
    <Link href={href} className="no-underline group">
      <article className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-lg transition">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-neutral-200 to-neutral-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition" />
        </div>
        <div className="p-4">
          <span className={`inline-block text-xs font-medium text-${ACCENT}`}>{tag}</span>
          <h3 className="mt-1 font-semibold text-neutral-900 leading-snug">{title}</h3>
        </div>
      </article>
    </Link>
  )
}

function MosaicCard({ title, lead, href }: {title:string; lead:string; href:string}) {
  return (
    <Link href={href} className="no-underline group">
      <article className="h-full rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-lg transition">
        <div className="aspect-[4/3] bg-neutral-100" />
        <div className="p-4">
          <h4 className="font-semibold text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{lead}</p>
        </div>
      </article>
    </Link>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen bg-stone-50 text-neutral-900">
      {/* DIVE風ヘッダー */}
      <HeaderDIVE active="features" />

      {/* ===== Hero（フルブリード画像＋暗めオーバーレイ） ===== */}
      <section className="relative border-b border-neutral-200">
        {/* /public/v2-hero.jpg を置けば背景画像に切り替わります */}
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/v2-hero.jpg')" }} />
        {/* 画像が無い時のグラデ */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-white" />
        {/* 暗めオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />

        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-${ACCENT}/10 text-${ACCENT} border border-${ACCENT}/20`}>BRIDAL EDITORIAL</div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-tight text-white drop-shadow">
              結婚式までを“逆算”して、<br className="hidden sm:block" />
              ベストな美容医療を選ぶ
            </h1>
            <p className="mt-4 text-stone-100/90 text-base sm:text-lg">
              期間・ダウンタイム・予算のバランスで、当日にベストコンディションを作るための特集＆ガイド。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/tools/checker" className={`no-underline inline-flex items-center px-5 py-2.5 rounded-full bg-${ACCENT} text-white hover:opacity-95`}>逆算チェッカー</Link>
              <Link href="/contact" className="no-underline inline-flex items-center px-5 py-2.5 rounded-full bg-white/95 text-neutral-900 border border-white/60 hover:bg-white">専門家に相談</Link>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-xs font-medium text-white/80">時期から探す</div>
              <div className="flex flex-wrap gap-2">
                <Chip href="/directory?when=6m">⏳ 半年前〜</Chip>
                <Chip href="/directory?when=3m">⏳ 3か月前</Chip>
                <Chip href="/directory?when=1m">⏳ 1か月前</Chip>
                <Chip href="/directory?when=2w">⏳ 2週間前</Chip>
                <Chip href="/directory?when=last">⚡ 直前</Chip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 特集 ===== */}
      <section id="features" className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold">特集</h2>
          <Link href="/faq" className="text-sm text-neutral-500 hover:underline">編集方針</Link>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <FeatureCard tag="半年〜"   title="時間を味方に。肌質改善の王道ロードマップ" href="/directory?when=6m" />
          <FeatureCard tag="1か月前" title="DT少なめで透明感UPの現実解"           href="/directory?when=1m" />
          <FeatureCard tag="直前"     title="前日〜当日にやる／やらない"           href="/faq#last-minute" />
        </div>
      </section>

      {/* ===== 期間別ガイド ===== */}
      <section id="timeline" className="bg-white border-y border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-semibold">期間別ガイド</h2>
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            {[
              {title:'半年〜',     pts:['角層リニューアル','色素沈着ケア','土台づくり'],         href:'/directory?when=6m'},
              {title:'3か月前',   pts:['毛穴・質感UP','ボディ調整','ホーム固定'],             href:'/directory?when=3m'},
              {title:'1か月前',   pts:['DT最小','くすみ対策','むくみケア'],                   href:'/directory?when=1m'},
              {title:'直前〜当日', pts:['強刺激は避ける','睡眠と水分','当日ルーティン'],         href:'/faq#last-minute'},
            ].map((b,i)=>(
              <Link key={i} href={b.href} className="no-underline">
                <div className="rounded-2xl border border-neutral-200 bg-stone-50 p-4 h-full hover:bg-stone-100 transition">
                  <div className={`text-sm font-semibold text-${ACCENT}`}>{b.title}</div>
                  <ul className="mt-2 text-sm text-neutral-700 space-y-1 list-disc pl-5">
                    {b.pts.map((p, idx)=> <li key={idx}>{p}</li>)}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 人気の施術 ===== */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold">人気の施術</h2>
          <Link href="/directory" className="text-sm text-neutral-500 hover:underline">すべて見る</Link>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MosaicCard title="ダーマペン＋成長因子" lead="質感と毛穴、ニキビ跡のベースアップ" href="/directory?tag=ダーマペン" />
          <MosaicCard title="IPL（フォト）" lead="くすみ・赤み・色むらをまとめて整える"     href="/directory?tag=IPL" />
          <MosaicCard title="ピーリング＋イオン導入" lead="DT控えめに透明感を底上げ"           href="/directory?tag=ピーリング" />
        </div>
      </section>

      {/* ===== 読みもの ===== */}
      <section className="bg-white border-t border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-semibold">編集部おすすめ</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i=>(
              <Link key={i} href="/faq" className="no-underline">
                <article className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-lg transition">
                  <div className="aspect-[16/9] bg-neutral-100" />
                  <div className="p-4">
                    <div className={`text-xs font-medium text-${ACCENT}`}>GUIDE</div>
                    <div className="font-semibold mt-1">失敗しない直前ケアのコツ {i}</div>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">赤み・むくみを避けつつ、写真で映える“艶”を出すための最小施術とホームケア。</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-neutral-200 p-6 md:p-8 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">いつが結婚式？逆算で最適な施術を提案します</div>
            <p className="text-sm text-neutral-600 mt-1">所要2分。ダウンタイムと効果の出方で自動判定。</p>
          </div>
          <div className="flex gap-3">
            <Link href="/tools/checker" className={`no-underline inline-flex items-center px-5 py-2.5 rounded-full bg-${ACCENT} text-white hover:opacity-95`}>逆算チェッカー</Link>
            <Link href="/contact" className="no-underline inline-flex items-center px-5 py-2.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100">無料で相談</Link>
          </div>
        </div>
        <div className="text-xs text-neutral-500 mt-3">※ 医療行為は提携クリニックで実施。最終適応・同意説明は各院で行います。</div>
      </section>
    </main>
  )
}
