import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'page',
  title: '固定ページ',
  type: 'document',
  fields: [
    defineField({name:'title', title:'タイトル', type:'string', validation:r=>r.required()}),
    defineField({name:'slug', title:'スラッグ', type:'slug', options:{source:'title'}, validation:r=>r.required()}),
    defineField({name:'body', title:'本文', type:'array', of:[{type:'block'}]})
  ]
})
