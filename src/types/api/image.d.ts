import type { Image, ImageStoreData } from '../data'
import type { ResData } from './base'

export type ImageUploadRes = ResData<Image>

export type ImageGetByCursorQueryType = {
  haveOriginal?: 'true' | 'false' | 'all' | undefined
  havePost?: 'true' | 'false' | 'all' | undefined
}
export type ImageGetByCursorRes = ResData<ImageStoreData[]>

export type imageUpdateJsonType = {
  id: number
  alt?: string | null | undefined
  twitterLargeImageLink?: string | null | undefined
}
