import {groq} from 'next-sanity'

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

export const homeQuery = groq`
  *[_type=="home"][0]{
    heroTitle, heroLead, bullets,
    heroButtons[]{label, url},
    timeline[]{title, points},
    concerns[]{tag, title, points},
    disclaimer
  }`
