import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'site',
  title: 'サイト設定',
  type: 'document',
  fields: [
    defineField({name:'siteName', title:'サイト名', type:'string'}),
    defineField({
      name:'logo', title:'ロゴ', type:'image', options:{hotspot:true},
      fields:[{name:'alt', title:'代替テキスト', type:'string'}]
    }),
    defineField({
      name:'navItems', title:'ナビゲーション', type:'array',
      of:[{type:'object', fields:[
        {name:'label', title:'ラベル', type:'string'},
        {name:'href', title:'URL', type:'string'}
      ]}]
    }),
    defineField({
      name:'footerLinks', title:'フッターリンク', type:'array',
      of:[{type:'object', fields:[
        {name:'label', title:'ラベル', type:'string'},
        {name:'href', title:'URL', type:'string'}
      ]}]
    }),
    defineField({name:'footerNote', title:'フッター注記', type:'text'})
  ]
})
