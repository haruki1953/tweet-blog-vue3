import type {
  ImageGetByCursorQueryType,
  ImageGetByCursorRes,
  ImageUploadRes,
  ImageUpdateJsonType,
  ImageUpdateRes,
  ImageDeleteRes,
  ImageDeleteOriginalRes
} from '@/types'
import { http } from '@/utils'
import type { UploadRawFile } from 'element-plus'

export const imageUploadService = (
  imageRawFile: UploadRawFile
): ImageUploadRes => {
  const fd = new FormData()
  fd.append('image', imageRawFile)
  return http.post('/image', fd)
}

export const imageGetByCursorApi = (
  cursorId: number,
  query?: ImageGetByCursorQueryType
): ImageGetByCursorRes => {
  return http.get(`/image/cursor/${cursorId}`, {
    params: query
  })
}

export const imageUpdateApi = (json: ImageUpdateJsonType): ImageUpdateRes => {
  return http.patch('/image', json)
}

export const imageDeleteApi = (imageId: number): ImageDeleteRes => {
  return http.delete(`/image/id/${imageId}`)
}

export const imageDeleteOriginalApi = (
  imageId: number
): ImageDeleteOriginalRes => {
  return http.delete(`/image/original/id/${imageId}`)
}
