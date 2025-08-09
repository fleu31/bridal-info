import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {sanityClient} from '@/lib/sanity.client'
import {pageBySlugQuery} from '@/lib/queries'
import {PortableText} from '@portabletext/react'

export default async function FAQ(){
  const data = await sanityClient.fetch(pageBySlugQuery, {slug:'faq'})
  return (
    <div>
      <Header/>
      <main className="container py-10 prose max-w-none">
        {data ? (
          <>
            <h1>{data.title}</h1>
            <PortableText value={data.body || []} />
          </>
        ) : (
          <>
            <h1>FAQ（一般情報）</h1>
            <p>当サイトは紹介・一般情報の提供のみ。診療・適応判断・同意取得は医療機関で行われます。</p>
          </>
        )}
      </main>
      <Footer/>
    </div>
  )
}
