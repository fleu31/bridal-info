import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'inquiry',
  title: 'お問い合わせ',
  type: 'document',
  fields: [
    defineField({name:'name', title:'お名前', type:'string', validation:r=>r.required()}),
    defineField({name:'email', title:'メール', type:'string'}),
    defineField({name:'phone', title:'電話番号', type:'string'}),
    defineField({name:'category', title:'カテゴリ', type:'string'}),
    defineField({name:'message', title:'本文', type:'text', validation:r=>r.required()}),
    defineField({name:'consent', title:'同意', type:'boolean'}),
    defineField({name:'path', title:'送信元パス', type:'string'}),
    defineField({name:'ref', title:'リファラ', type:'string'}),
    defineField({name:'honey', title:'Honeypot', type:'boolean'}),
    defineField({name:'createdAt', title:'作成日時', type:'datetime', initialValue:()=>new Date().toISOString()}),
  ]
})
