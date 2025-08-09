import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: '記事',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'タイトル', type: 'string', validation: r=>r.required()}),
    defineField({name: 'slug', title: 'スラッグ', type: 'slug', options: {source: 'title'}, validation: r=>r.required()}),
    defineField({
      name: 'category', title: 'カテゴリ', type: 'string',
      options: {list: ['逆算','悩み','安全','当日']}, validation: r=>r.required()
    }),
    defineField({name: 'updatedAt', title: '更新日', type: 'datetime', initialValue: ()=>new Date().toISOString()}),
    defineField({name: 'body', title: '本文', type: 'array', of: [{type: 'block'}]})
  ]
})
