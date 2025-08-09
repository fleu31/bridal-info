// app/v2/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'ブライダル美容ナビ – V2 プレビュー',
  description: '見た目確認用のV2ランディング（静的モック）',
}

function Chip({ children, href }: {children: React.ReactNode; href: string}) {
  return (
    <Link href={href} className="no-underline">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 text-sm bg-white hover:bg-neutral-50">
        {children}
      </span>
    </Link>
  )
}

function Card({ children }: {children: React.ReactNode}) {
  return (
    <div className="group rounded-xl border border-neutral-200 overflow-hidden bg-white hover:shadow-lg transition">
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-white to-neutral-50" />
        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                結婚式までの“逆算”で<br className="hidden sm:block" />
                ベストな美容医療を見つける
              </h1>
              <p className="mt-4 text-neutral-600 text-base sm:text-lg">
                半年前から直前まで。ダウンタイム・予算・効果の出方を踏まえ
                <span className="whitespace-nowrap">「当日が一番きれい」</span>を叶えるための編集ガイド。
              </p>

              {/* Quick actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/tools/checker" className="btn no-underline inline-flex items-center px-4 py-2 rounded-full bg-black text-white hover:opacity-90">
                  逆算チェッカー
                </Link>
                <Link href="/contact" className="no-underline inline-flex items-center px-4 py-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100">
                  専門家に相談
                </Link>
              </div>

              {/* Search chips */}
              <div className="mt-8 space-y-3">
                <div className="text-sm font-medium text-neutral-500">時期で見る</div>
                <div className="flex flex-wrap gap-2">
                  <Chip href="/directory?when=6m">⏳ 半年前〜</Chip>
                  <Chip href="/directory?when=3m">⏳ 3か月前</Chip>
                  <Chip href="/directory?when=1m">⏳ 1か月前</Chip>
                  <Chip href="/directory?when=2w">⏳ 2週間前</Chip>
                  <Chip href="/directory?when=last">⚡ 直前</Chip>
                </div>
                <div className="text-sm font-medium text-neutral-500 mt-4">悩みで見る</div>
                <div className="flex flex-wrap gap-2">
                  <Chip href="/directory?tag=肌質改善">💧 肌質改善</Chip>
                  <Chip href="/directory?tag=毛穴">🕳️ 毛穴</Chip>
                  <Chip href="/directory?tag=美白">✨ 美白</Chip>
                  <Chip href="/directory?tag=痩身">🏃 痩身</Chip>
                  <Chip href="/directory?tag=小顔">🙂 小顔</Chip>
                </div>
              </div>
            </div>

            {/* Visual area（プレースホルダ）*/}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-neutral-200 via-white to-neutral-100 border border-neutral-200" />
              <div className="absolute -bottom-6 -left-6 w-44 h-36 rounded-xl bg-white border border-neutral-200 shadow-sm hidden sm:block" />
              <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white border border-neutral-200 shadow-sm hidden sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* 特集 */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold">特集</h2>
          <Link href="/faq" className="text-sm text-neutral-500 hover:underline">編集方針を見る</Link>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { tag:'半年〜', title:'時間が味方。肌質改善の王道ロードマップ', href:'/directory?when=6m' },
            { tag:'1か月前', title:'ダウンタイム少なめで透明感を底上げ', href:'/directory?when=1m' },
            { tag:'直前', title:'前日〜当日できること・やってはいけないこと', href:'/faq#last-minute' },
          ].map((f, i) => (
            <Link key={i} href={f.href} className="no-underline">
              <Card>
                <div className="aspect-[16/9] bg-gradient-to-br from-neutral-200 to-neutral-100" />
                <div className="p-4">
                  <div className="text-xs text-neutral-500">{f.tag}</div>
                  <div className="mt-1 font-medium">{f.title}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 期間別ガイド */}
      <section className="bg-white border-y border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-semibold">期間別ガイド</h2>
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            {[
              {title:'半年〜', pts:['角層リニューアル','色素沈着ケア','ベースづくり'], href:'/directory?when=6m'},
              {title:'3か月前', pts:['毛穴・質感アップ','ボディ調整','ホームケア固定'], href:'/directory?when=3m'},
              {title:'1か月前', pts:['ダウンタイム最小','くすみ対策','むくみケア'], href:'/directory?when=1m'},
              {title:'直前〜当日', pts:['刺激の強い施術は×','睡眠と水分','当日ルーティン'], href:'/faq#last-minute'},
            ].map((b,i)=>(
              <Link key={i} href={b.href} className="no-underline">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 h-full hover:bg-neutral-100 transition">
                  <div className="font-medium">{b.title}</div>
                  <ul className="mt-2 text-sm text-neutral-600 space-y-1 list-disc pl-5">
                    {b.pts.map((p, idx)=> <li key={idx}>{p}</li>)}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 人気の施術 */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h2 className="text-2xl sm:text-3xl font-semibold">人気の施術</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {title:'ダーマペン＋成長因子', lead:'質感・毛穴・ニキビ跡のベースアップ', href:'/directory?tag=ダーマペン'},
            {title:'IPL（フォト）', lead:'くすみ・赤み・色むらをまとめて整える', href:'/directory?tag=IPL'},
            {title:'ピーリング＋イオン導入', lead:'ダウンタイム控えめに透明感UP', href:'/directory?tag=ピーリング'},
          ].map((c,i)=>(
            <Link key={i} href={c.href} className="no-underline">
              <Card>
                <div className="aspect-[4/3] bg-neutral-100" />
                <div className="p-4">
                  <div className="font-medium">{c.title}</div>
                  <p className="text-sm text-neutral-600 mt-1">{c.lead}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 体験談・読みもの（ダミー） */}
      <section className="bg-white border-t border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-semibold">編集部おすすめ</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i=>(
              <Link key={i} href="/faq" className="no-underline">
                <Card>
                  <div className="aspect-[16/9] bg-neutral-100" />
                  <div className="p-4">
                    <div className="text-xs text-neutral-500">GUIDE</div>
                    <div className="font-medium mt-1">失敗しない直前ケアのコツ {i}</div>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                      赤み・むくみを避けつつ、写真で映える“艶”を出すためのミニマム施術とホームケア。
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-neutral-200 p-6 md:p-8 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-medium">いつが結婚式？逆算で最適な施術を提案します</div>
            <p className="text-sm text-neutral-600 mt-1">所要2分。ダウンタイムと効果の出方で自動判定。</p>
          </div>
          <div className="flex gap-3">
            <Link href="/tools/checker" className="btn no-underline inline-flex items-center px-4 py-2 rounded-full bg-black text-white hover:opacity-90">
              逆算チェッカー
            </Link>
            <Link href="/contact" className="no-underline inline-flex items-center px-4 py-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100">
              無料で相談
            </Link>
          </div>
        </div>
        <div className="text-xs text-neutral-500 mt-3">※ 医療行為は提携クリニックで実施。最終的な適応・同意説明は各院で行います。</div>
      </section>
    </main>
  )
}
