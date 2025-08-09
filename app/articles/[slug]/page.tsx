import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {sanityClient} from '@/lib/sanity.client'
import {articleBySlugQuery} from '@/lib/queries'
import {PortableText} from '@portabletext/react'
import {notFound} from 'next/navigation'

type Params = { params: { slug: string } }

export const revalidate = 60

export default async function ArticlePage({params}: Params){
  const data = await sanityClient.fetch(articleBySlugQuery, {slug: params.slug})
  if(!data) return notFound()
  return (
    <div>
      <Header/>
      <main className="container py-10 prose max-w-none">
        <div className="text-xs text-neutral-500">更新日：{data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('ja-JP') : ''}</div>
        <h1>{data.title}</h1>
        <PortableText value={data.body || []} />
      </main>
      <Footer/>
    </div>
  )
}
