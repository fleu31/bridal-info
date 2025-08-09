import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {sanityClient} from '@/lib/sanity.client'
import {checklist72hQuery} from '@/lib/queries'
import Checklist72hClient from '@/components/Checklist72hClient'

export default async function ChecklistPage(){
  const data = await sanityClient.fetch(checklist72hQuery)
  const intro = data?.intro || '直前は仕上げ（導入・鎮静）に徹し、新規の侵襲的施術は避けます。体調不良や強い反応がある場合は医療機関に相談してください。'
  const items = data?.items || [
    '睡眠を優先（6–8時間）',
    '塩分/アルコール控えめ',
    '仕上げケア（導入・鎮静・保湿）のみ',
    '直射日光・長時間の屋外を避ける',
    '移動や衣装での擦れ対策（背中・二の腕）',
    '当日メイクの相性確認（ベース/下地）'
  ]

  return (
    <div>
      <Header/>
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">72時間前チェックリスト（一般情報）</h1>
        <p className="text-sm text-neutral-600">{intro}</p>
        <Checklist72hClient items={items}/>
        <p className="small">※本ページは一般情報の提供を目的とします。具体的な適応・出力の判断は医療機関で行われます。</p>
      </main>
      <Footer/>
    </div>
  )
}
