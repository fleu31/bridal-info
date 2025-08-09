'use client'
import {useState} from 'react'

export default function Checklist72hClient({items}:{items:string[]}){
  const [done, setDone] = useState<Record<number, boolean>>({})
  const toggle = (i:number)=> setDone(p=>({...p, [i]: !p[i]}))
  const count = Object.values(done).filter(Boolean).length
  return (
    <section className="card">
      <div className="font-medium">チェック</div>
      <ul className="mt-3 space-y-2">
        {items.map((t, i)=>(
          <li key={i} className="flex items-center gap-3">
            <input type="checkbox" checked={!!done[i]} onChange={()=>toggle(i)} />
            <span className="text-sm">{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm">達成：{count} / {items.length}</div>
      <button className="btn mt-3" onClick={()=>window.print()}>印刷/保存</button>
    </section>
  )
}
