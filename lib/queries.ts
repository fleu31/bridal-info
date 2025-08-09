import {groq} from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type=="site"][0]{
    siteName, footerNote,
    navItems[]{label, href},
    footerLinks[]{label, href},
    logo{..., alt}
  }`

export const articlesListQuery = groq`
  *[_type == "article"] | order(updatedAt desc) {
    title, "slug": slug.current, category, updatedAt
  }`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0]{
    title, "slug": slug.current, updatedAt, body
  }`

export const clinicsQuery = groq`
  *[_type == "clinic"] | order(kana asc){
    kana, name, area, labels, starts, concerns, dt, lastMinute, notes, url
  }`

export const pageBySlugQuery = groq`
  *[_type=="page" && slug.current==$slug][0]{
    title, "slug": slug.current, body
  }`

export const homeQuery = groq`
  *[_type=="home"][0]{
    heroTitle, heroLead, bullets,
    heroButtons[]{label, url},
    timeline[]{title, points},
    concerns[]{tag, title, points},
    disclaimer,
    heroImage{..., alt}
  }`

export const checkerSettingsQuery = groq`
  *[_type=="toolChecker"][0]{disclaimer}`

export const checklist72hQuery = groq`
  *[_type=="toolChecklist72h"][0]{intro, items}`
