import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Clinic = {
  id: string; kana: string; name: string; area: string;
  labels: string[];
  starts: Array<'6m'|'3m'|'8w'|'4w'|'lz'>;
  concerns: Array<'tone'|'texture'|'acne'|'back'>;
  dt: Array<'none'|'light'|'mid'>;
  lastMinute: boolean;
  notes: string;
  url?: string;
}

const START_LABEL: Record<string,string> = { '6m':'6か月〜', '3m':'3か月〜', '8w':'8週〜', '4w':'4週〜', 'lz':'直前のみ' }
const CONCERN_LABEL: Record<string,string> = { 'tone':'赤み・くすみ', 'texture':'毛穴・キメ', 'acne':'ニキビ・跡', 'back':'背中・二の腕' }
const DT_LABEL: Record<string,string> = { 'none':'ほぼ不可', 'light':'軽度（1–2日）', 'mid':'中等度（3–5日）' }

const SAMPLE: Clinic[] = [
  { id:'a01', kana:'あおい', name:'あおいスキンクリニック', area:'栄', labels:['トーン','質感(軽〜中)','仕上げ','直前：仕上げのみ'], starts:['6m','3m','8w','4w'], concerns:['tone','texture','acne'], dt:['light','mid'], lastMinute:true, notes:'前後比較の撮影規格あり。Pが近い場合はP優先の運用を明記。', url:'#' },
  { id:'a02', kana:'うつくし', name:'うつくし皮膚科', area:'名古屋駅', labels:['トーン','仕上げ'], starts:['8w','4w','lz'], concerns:['tone','back'], dt:['none','light'], lastMinute:true, notes:'直前は導入・鎮静のみ。試射はT-6週以前を推奨。', url:'#' },
  { id:'a03', kana:'かすみ', name:'かすみクリニック', area:'千種/今池', labels:['質感(軽〜中)','トーン','仕上げ'], starts:['6m','3m'], concerns:['texture','tone'], dt:['light','mid'], lastMinute:false, notes:'P/Tの4週前までに質感調整を完了する方針。', url:'#' },
]

export default function DirectoryPage(){
  const clinics = [...SAMPLE].sort((a,b)=> a.kana.localeCompare(b.kana, 'ja'))
  return (
    <div>
      <Header />
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">ブライダル美容医療ディレクトリ（ノンランキング）</h1>
        <p className="text-sm text-neutral-600">本ページは情報提供のみを目的としています。順位付け・おすすめ表現は行いません。適応判断・同意取得・価格の最終確認は医療機関で行われます。</p>
        <div className="text-xs text-neutral-600">表示順：五十音順（おすすめ度を意味しません）</div>
        <section className="grid md:grid-cols-3 gap-6">
          {clinics.map(c => (
            <article key={c.id} className="card">
              <div className="text-xs text-neutral-500">{c.area}</div>
              <h3 className="mt-1 text-lg font-semibold">{c.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                {c.labels.map(l => <span key={l} className="px-2 py-1 border">{l}</span>)}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-neutral-500">開始時期</dt><dd>{c.starts.map(s => START_LABEL[s]).join(' / ')}</dd></div>
                <div><dt className="text-neutral-500">悩み</dt><dd>{c.concerns.map(s => CONCERN_LABEL[s]).join(' / ')}</dd></div>
                <div><dt className="text-neutral-500">DT許容</dt><dd>{c.dt.map(s => DT_LABEL[s]).join(' / ')}</dd></div>
                <div><dt className="text-neutral-500">直前対応</dt><dd>{c.lastMinute ? '仕上げのみで対応' : '直前は非対応'}</dd></div>
              </dl>
              <p className="mt-3 text-sm text-neutral-700">{c.notes}</p>
              <a href={c.url || '#'} className="btn mt-4 no-underline w-full inline-flex items-center justify-center">外部サイトで詳細を見る</a>
            </article>
          ))}
        </section>
        <section className="card bg-neutral-50 text-sm text-neutral-700">
          <div className="font-medium">比較の観点（一般情報）</div>
          <ul className="mt-2 list-disc list-inside">
            <li>直前対応：T-2週以降は<strong>仕上げ（導入・鎮静）</strong>のみ。新規の強い施術は避ける方針か。</li>
            <li>試射の運用：初回は早期に。P（前撮り）が近い場合はP優先の設計か。</li>
            <li>撮影規格：前後比較は同条件の撮影・照明か（院内運用）。</li>
            <li>説明と同意：リスク説明が十分か。質問がしやすい体制か。</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}
