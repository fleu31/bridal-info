import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {sanityClient} from '@/lib/sanity.client'
import {clinicsQuery} from '@/lib/queries'

export const revalidate = 60

const START_LABEL: Record<string,string> = { '6m':'6か月〜', '3m':'3か月〜', '8w':'8週〜', '4w':'4週〜', 'lz':'直前のみ' }
const CONCERN_LABEL: Record<string,string> = { 'tone':'赤み・くすみ', 'texture':'毛穴・キメ', 'acne':'ニキビ・跡', 'back':'背中・二の腕' }
const DT_LABEL: Record<string,string> = { 'none':'ほぼ不可', 'light':'軽度（1–2日）', 'mid':'中等度（3–5日）' }

export default async function DirectoryPage(){
  const clinics = await sanityClient.fetch(clinicsQuery)

  return (
    <div>
      <Header />
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">ブライダル美容医療ディレクトリ（ノンランキング）</h1>
        <p className="text-sm text-neutral-600">本ページは情報提供のみ。順位付けは行いません。</p>
        {clinics.length === 0 && <div className="text-sm text-neutral-600">まだ登録がありません。/studio から追加してください。</div>}
        <section className="grid md:grid-cols-3 gap-6">
          {clinics.map((c:any)=>(
            <article key={c.name} className="card">
              <div className="text-xs text-neutral-500">{c.area}</div>
              <h3 className="mt-1 text-lg font-semibold">{c.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                {(c.labels||[]).map((l:string)=><span key={l} className="px-2 py-1 border">{l}</span>)}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-neutral-500">開始時期</dt><dd>{(c.starts||[]).map((s:string)=>START_LABEL[s]).filter(Boolean).join(' / ')}</dd></div>
                <div><dt className="text-neutral-500">悩み</dt><dd>{(c.concerns||[]).map((s:string)=>CONCERN_LABEL[s]).filter(Boolean).join(' / ')}</dd></div>
                <div><dt className="text-neutral-500">DT許容</dt><dd>{(c.dt||[]).map((s:string)=>DT_LABEL[s]).filter(Boolean).join(' / ')}</dd></div>
                <div><dt className="text-neutral-500">直前対応</dt><dd>{c.lastMinute ? '仕上げのみで対応' : '直前は非対応'}</dd></div>
              </dl>
              {c.notes && <p className="mt-3 text-sm text-neutral-700">{c.notes}</p>}
              {c.url && <a href={c.url} className="btn mt-4 no-underline w-full inline-flex items-center justify-center">外部サイトで詳細を見る</a>}
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
