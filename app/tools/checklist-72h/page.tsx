'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'

const ITEMS = [
  { k:'sleep', t:'睡眠を優先（6–8時間）' },
  { k:'salt', t:'塩分/アルコール控えめ' },
  { k:'care', t:'仕上げケア（導入・鎮静・保湿）のみ' },
  { k:'uv', t:'直射日光・長時間の屋外を避ける' },
  { k:'friction', t:'移動や衣装での擦れ対策（背中・二の腕）' },
  { k:'make', t:'当日メイクの相性確認（ベース/下地）' },
]

export default function Checklist72h(){
  const [done, setDone] = useState<Record<string, boolean>>({})
  const toggle = (k:string)=> setDone(p => ({...p, [k]: !p[k]}))
  const all = ITEMS.length
  const count = Object.values(done).filter(Boolean).length

  return (
    <div>
      <Header />
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">72時間前チェックリスト（一般情報）</h1>
        <p className="text-sm text-neutral-600">直前は<strong>仕上げ（導入・鎮静）</strong>に徹し、新規の侵襲的施術は避けます。体調不良や強い反応がある場合は医療機関に相談してください。</p>

        <section className="card">
          <div className="font-medium">チェック</div>
          <ul className="mt-3 space-y-2">
            {ITEMS.map(i => (
              <li key={i.k} className="flex items-center gap-3">
                <input type="checkbox" checked={!!done[i.k]} onChange={()=>toggle(i.k)} />
                <span className="text-sm">{i.t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm">達成：{count} / {all}</div>
          <button className="btn mt-3" onClick={()=>window.print()}>印刷/保存</button>
        </section>

        <p className="small">※本ページは一般情報の提供を目的とします。具体的な適応・出力の判断は医療機関で行われます。</p>
      </main>
      <Footer />
    </div>
  )
}
