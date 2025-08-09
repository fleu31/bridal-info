import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './sanity.client'
const builder = imageUrlBuilder(sanityClient)
export function urlFor(src: any) {
  return builder.image(src)
}
