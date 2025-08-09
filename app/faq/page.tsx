import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FAQPage() {
  return (
    <div>
      <Header />
      <main className="container py-10">
        <h1 className="text-2xl md:text-3xl font-semibold">FAQ（一般情報）</h1>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[
            { q: '医療機関ではないのですか？', a: '当サイトは紹介・一般情報の提供のみ。診療・適応判断・同意取得は医療機関で行われます。' },
            { q: '直前（2週間以内）からでも可能？', a: '安全のため「仕上げ（導入・鎮静）」のみをご案内。新規の侵襲的施術は推奨しません。' },
            { q: 'おすすめのクリニックは？', a: '推薦・順位付けは行いません。比較は観点の提示のみです。' },
            { q: '問い合わせは？', a: '一般情報の範囲で回答します。必要に応じて医療機関の受診をご案内します。' },
          ].map((i) => (
            <div key={i.q} className="card">
              <div className="font-medium">{i.q}</div>
              <div className="text-neutral-700 mt-2">{i.a}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
