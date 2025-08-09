import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {sanityClient} from '@/lib/sanity.client'
import {checkerSettingsQuery} from '@/lib/queries'
import CheckerClient from '@/components/CheckerClient'

export default async function CheckerPage(){
  const data = await sanityClient.fetch(checkerSettingsQuery)
  const disclaimer = data?.disclaimer || '本ツールは一般情報の提供を目的とします。具体的な適応・出力の判断は医療機関で行われます。'

  return (
    <div>
      <Header/>
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">逆算チェッカー</h1>
        <CheckerClient/>
        <div className="mt-3 text-xs text-neutral-500">{disclaimer}</div>
      </main>
      <Footer/>
    </div>
  )
}
