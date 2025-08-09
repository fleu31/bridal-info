import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MiniChecker from '@/components/MiniChecker'
import {sanityClient} from '@/lib/sanity.client'
import {homeQuery} from '@/lib/queries'

export const revalidate = 60

export default async function Home(){
  const data = await sanityClient.fetch(homeQuery)

  const d = data ?? {
    heroTitle: '結婚式までの美容医療情報サイト',
    heroLead: '本サイトは医療機関ではありません。掲載内容は一般情報であり、個別の診断・治療の提案ではありません。適応判断・同意取得は医療機関で行われます。',
    bullets: ['挙式/前撮りから逆算した「やる/やらない」を明確化','直前は仕上げケア（導入・鎮静）中心','悩み別の読み物を体系化'],
    heroButtons: [{label:'逆算チェッカー', url:'/tools/checker'},{label:'FAQ', url:'/faq'},{label:'編集ポリシー', url:'/policy'}],
    timeline: [
      {title:'T−6〜3か月', points:['トーン/質感の土台づくり','強い施術は早期に試射','毎回の仕上げで安定化']},
      {title:'T−8〜4週',   points:['出力を控えめに','新規は避ける','Pが近い場合はP優先']},
      {title:'T−2〜1週',   points:['仕上げ（導入・鎮静）のみ','刺激は避ける','メイクとの相性を確認']},
      {title:'T−1〜3日',   points:['施術は行わない','睡眠・塩分・飲酒を整える','移動や衣装での擦れに注意']},
    ],
    concerns: [
      {tag:'赤み・くすみ', title:'トーンを整える', points:['早期に試射→反応を確認','直前は仕上げのみ','生活：紫外線/睡眠/塩分']},
      {tag:'毛穴・質感',   title:'凹凸の扱い方', points:['ピークはT-4週以前に','Pが近い場合はP優先','メイクとの相性も確認']},
      {tag:'ニキビ',       title:'炎症があるとき', points:['無理はしない','刺激を避ける','医療機関の判断を優先']},
    ],
    disclaimer: '※本サイトは一般情報の提供を目的とします。具体的な適応・出力の判断は医療機関で行われます。'
  }

  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="border-b">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-end">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">{d.heroTitle}</h1>
            {d.heroLead && <p className="mt-3 text-sm text-neutral-600">{d.heroLead}</p>}
            <ul className="mt-6 space-y-2 text-sm text-neutral-700">
              {(d.bullets||[]).map((b:string,i:number)=>(<li key={i}>・{b}</li>))}
            </ul>
            <div className="mt-8 grid md:grid-cols-3 gap-3 text-sm">
              {(d.heroButtons||[]).map((btn:any,i:number)=>(
                <a key={i} href={btn.url} className="btn no-underline">{btn.label}</a>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-md bg-neutral-100" />
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="container py-16 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold">逆算カレンダー（一般情報）</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-6 text-sm">
          {(d.timeline||[]).map((s:any)=>(
            <div key={s.title} className="card">
              <div className="font-medium">{s.title}</div>
              <ul className="mt-2 text-neutral-700 space-y-1">
                {(s.points||[]).map((p:string,i:number)=>(<li key={i}>・{p}</li>))}
              </ul>
            </div>
          ))}
        </div>
        <MiniChecker />
      </section>

      {/* Concern */}
      <section id="concern" className="container py-16 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold">悩み別の読み物</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {(d.concerns||[]).map((a:any)=>(
            <article key={a.title} className="card">
              <div className="text-xs text-neutral-500">{a.tag}</div>
              <div className="mt-1 text-lg font-semibold">{a.title}</div>
              <ul className="mt-3 text-sm text-neutral-700 space-y-1">
                {(a.points||[]).map((p:string,i:number)=>(<li key={i}>・{p}</li>))}
              </ul>
              <a href="/articles" className="mt-4 inline-block text-sm">続きを読む</a>
            </article>
          ))}
        </div>
      </section>

      {d.disclaimer && <div className="container text-xs text-neutral-500">{d.disclaimer}</div>}

      <Footer />
    </div>
  )
}
