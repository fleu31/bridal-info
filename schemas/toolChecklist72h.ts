import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'toolChecklist72h',
  title: '72時間前チェックリスト',
  type: 'document',
  fields: [
    defineField({name:'intro', title:'導入文', type:'text'}),
    defineField({name:'items', title:'項目', type:'array', of:[{type:'string'}]})
  ]
})
