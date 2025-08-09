import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'toolChecker',
  title: '逆算チェッカー設定',
  type: 'document',
  fields: [
    defineField({name:'disclaimer', title:'注記', type:'text'})
  ]
})
