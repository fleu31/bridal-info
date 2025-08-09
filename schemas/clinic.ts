import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'clinic',
  title: 'クリニック',
  type: 'document',
  fields: [
    defineField({name:'kana', title:'よみ（五十音用）', type:'string', validation:r=>r.required()}),
    defineField({name:'name', title:'名称', type:'string', validation:r=>r.required()}),
    defineField({name:'area', title:'エリア', type:'string'}),
    defineField({name:'labels', title:'表示タグ', type:'array', of:[{type:'string'}]}),
    defineField({
      name:'starts', title:'開始時期', type:'array',
      of:[{type:'string'}],
      options:{list:['6m','3m','8w','4w','lz']}
    }),
    defineField({
      name:'concerns', title:'悩み', type:'array',
      of:[{type:'string'}],
      options:{list:['tone','texture','acne','back']}
    }),
    defineField({
      name:'dt', title:'DT許容', type:'array',
      of:[{type:'string'}],
      options:{list:['none','light','mid']}
    }),
    defineField({name:'lastMinute', title:'直前対応（仕上げのみ）', type:'boolean'}),
    defineField({name:'notes', title:'メモ', type:'text'}),
    defineField({name:'url', title:'外部URL', type:'url'})
  ]
})
