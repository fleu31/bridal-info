import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'home',
  title: 'ホーム設定',
  type: 'document',
  fields: [
    defineField({name:'heroTitle', title:'ヒーロー見出し', type:'string'}),
    defineField({name:'heroLead', title:'リード文', type:'text'}),
    defineField({name:'bullets', title:'箇条書き', type:'array', of:[{type:'string'}]}),
    defineField({
      name:'heroButtons', title:'ボタン', type:'array',
      of:[{type:'object', fields:[
        {name:'label', title:'ラベル', type:'string'},
        {name:'url', title:'URL', type:'url'}
      ]}]
    }),
    defineField({
      name:'timeline', title:'タイムライン', type:'array',
      of:[{type:'object', fields:[
        {name:'title', title:'タイトル', type:'string'},
        {name:'points', title:'ポイント', type:'array', of:[{type:'string'}]}
      ]}]
    }),
    defineField({
      name:'concerns', title:'悩みカード', type:'array',
      of:[{type:'object', fields:[
        {name:'tag', title:'タグ', type:'string'},
        {name:'title', title:'見出し', type:'string'},
        {name:'points', title:'ポイント', type:'array', of:[{type:'string'}]}
      ]}]
    }),
    defineField({name:'disclaimer', title:'注記（フッター下の注意書きなど）', type:'text'})
  ]
})
