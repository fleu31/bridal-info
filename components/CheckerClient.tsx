'use client'
import { useMemo, useState } from 'react'

export default function CheckerClient(){
  const [wedding, setWedding] = useState('')
  const [photos, setPhotos] = useState('')
  const [dt, setDt] = useState('ほぼ不可')
  const now = new Date()
  const weeksTo = (d?:string) => { if(!d) return NaN; const x = new Date(d); return Math.floor((x.getTime()-now.getTime())/(1000*60*60*24*7)); }
  const pivot = Math.min(...[wedding,photos].map(weeksTo).map(v=>isNaN(v)?Infinity:v))

  const advice = useMemo(()=>{
    const can:string[] = [], avoid:string[] = []
    if (pivot >= 20) can.push('トーン/質感の調整（試射含む）')
    if (pivot >= 12 && pivot < 20) { can.push('トーン/質感（控えめ設定）'); avoid.push('強い施術の新規開始') }
    if (pivot >= 7 && pivot < 12) { can.push('トーン少量＋仕上げ'); avoid.push('強い質感調整') }
    if (pivot >= 4 && pivot < 7) { can.push('既知機器の弱いトーン＋仕上げ'); avoid.push('新規の侵襲施術') }
    if (pivot < 4) { can.push('仕上げ（導入・鎮静）'); avoid.push('新規の侵襲施術全般') }
    if (dt === 'ほぼ不可') avoid.push('赤み・ダウンタイムを伴う施術')
    return {can, avoid}
  }, [pivot, dt])

  return (
    <>
      <div className="grid md:grid-cols-3 gap-3">
        <div><label className="text-sm">挙式日</label><input type="date" value={wedding} onChange={e=>setWedding(e.target.value)} className="mt-1 w-full border p-2 rounded-none"/></div>
        <div><label className="text-sm">前撮り日（任意）</label><input type="date" value={photos} onChange={e=>setPhotos(e.target.value)} className="mt-1 w-full border p-2 rounded-none"/></div>
        <div><label className="text-sm">ダウンタイム許容</label>
          <select value={dt} onChange={e=>setDt(e.target.value)} className="mt-1 w-full border p-2 rounded-none">
            <option>ほぼ不可</option><option>軽度なら可（1–2日）</option><option>中等度まで可（3–5日）</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 text-sm mt-4">
        <div className="card"><div className="font-medium">今できること</div><ul className="mt-2 list-disc list-inside text-neutral-700">{advice.can.map((x,i)=>(<li key={i}>{x}</li>))}</ul></div>
        <div className="card"><div className="font-medium">避けたいこと</div><ul className="mt-2 list-disc list-inside text-neutral-700">{advice.avoid.map((x,i)=>(<li key={i}>{x}</li>))}</ul></div>
      </div>
    </>
  )
}
