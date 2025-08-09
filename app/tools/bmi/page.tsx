'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BMICalculatorPage(){
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const h = parseFloat(height)
  const w = parseFloat(weight)
  const bmi = h > 0 ? w / ((h/100) * (h/100)) : NaN

  let category = ''
  if(!isNaN(bmi)){
    if(bmi < 18.5) category = '低体重'
    else if(bmi < 25) category = '普通体重'
    else category = '肥満'
  }

  return (
    <div>
      <Header/>
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">BMI計算ツール</h1>
        <div className="grid md:grid-cols-2 gap-3 max-w-md">
          <div>
            <label className="text-sm">身長（cm）</label>
            <input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="mt-1 w-full border p-2 rounded-none"/>
          </div>
          <div>
            <label className="text-sm">体重（kg）</label>
            <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="mt-1 w-full border p-2 rounded-none"/>
          </div>
        </div>
        {height && weight && !isNaN(bmi) && (
          <div className="card max-w-md">
            <div className="font-medium">結果</div>
            <p className="mt-2">BMI: {bmi.toFixed(1)}（{category}）</p>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  )
}
