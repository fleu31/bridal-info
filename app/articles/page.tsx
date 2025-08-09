import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {sanityClient} from '@/lib/sanity.client'
import {articlesListQuery} from '@/lib/queries'

export const revalidate = 60

export default async function ArticlesIndex(){
  const items: {title:string; slug:string; category:string; updatedAt:string}[] =
    await sanityClient.fetch(articlesListQuery)

  return (
    <div>
      <Header/>
      <main className="container py-10">
        <h1 className="text-2xl md:text-3xl font-semibold">記事</h1>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {items.map(i=>(
            <article key={i.slug} className="card">
              <div className="text-xs text-neutral-500">{i.category}／{new Date(i.updatedAt).toLocaleDateString('ja-JP')}</div>
              <div className="mt-1 text-lg font-semibold">{i.title}</div>
              {/* typedRoutes回避のため a でOK */}
              <a className="mt-3 inline-block text-sm underline" href={`/articles/${i.slug}`}>続きを読む</a>
            </article>
          ))}
          {items.length===0 && <div className="text-sm text-neutral-600">まだ記事がありません。/studio から新規作成してください。</div>}
        </div>
      </main>
      <Footer/>
    </div>
  )
}
