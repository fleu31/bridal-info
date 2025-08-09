import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import article from './schemas/article'
import clinic from './schemas/clinic'
import page from './schemas/page'
import home from './schemas/home'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'

export default defineConfig({
  name: 'default',
  title: 'Bridal CMS',
  projectId,
  dataset,
  apiVersion,
  basePath: '/studio',
  plugins: [deskTool()],
  schema: {types: [article, clinic, page, home]},
})
