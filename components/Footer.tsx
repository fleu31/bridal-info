import {sanityClient} from '@/lib/sanity.client'
import {siteSettingsQuery} from '@/lib/queries'

export default async function Footer(){
  const data = await sanityClient.fetch(siteSettingsQuery)
  const name = data?.siteName || 'BRAND（仮）'
  const links = data?.footerLinks ?? [
    {label:'編集ポリシー', href:'/policy'},
    {label:'FAQ', href:'/faq'},
  ]
  const note = data?.footerNote || '本サイトは一般情報の提供を目的とします。具体的な判断は医療機関で行われます。'
  return (
    <footer className="border-t">
      <div className="container py-10 text-sm text-neutral-600 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold">{name}</div>
          <p className="mt-2">{note}</p>
        </div>
        <div className="space-y-1">
          {links.map((l:any)=> <a className="block" key={l.href} href={l.href}>{l.label}</a>)}
        </div>
        <div className="text-xs">
          <p>© {new Date().getFullYear()} {name}</p>
          <p className="mt-2">当サイト経由で受診が成立した場合、医療機関から紹介料を受け取ることがあります。</p>
        </div>
      </div>
    </footer>
  )
}
