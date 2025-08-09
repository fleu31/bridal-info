import {sanityClient} from '@/lib/sanity.client'
import {siteSettingsQuery} from '@/lib/queries'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

export default async function Header(){
  const data = await sanityClient.fetch(siteSettingsQuery)
  const name = data?.siteName || 'BRAND（仮）'
  const nav = data?.navItems ?? [
    {label:'考え方', href:'/#about'},
    {label:'逆算', href:'/#timeline'},
    {label:'チェッカー', href:'/tools/checker'},
    {label:'72時間前', href:'/tools/checklist-72h'},
    {label:'ディレクトリ', href:'/directory'},
    {label:'記事', href:'/articles'},
    {label:'編集ポリシー', href:'/policy'},
    {label:'FAQ', href:'/faq'},
  ]
  const logo = data?.logo
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logo
            ? <Image src={urlFor(logo).width(64).height(64).url()} alt={logo.alt || name} width={32} height={32} />
            : <div className="h-8 w-8 bg-neutral-900" />
          }
          <span className="font-medium tracking-wide no-underline">{name}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n:any)=>(
            <a key={n.href} className="no-underline hover:opacity-70" href={n.href}>{n.label}</a>
          ))}
        </nav>
        <div className="small">情報提供サイト</div>
      </div>
    </header>
  )
}
