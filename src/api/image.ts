import type {
  ImageGetByCursorQueryType,
  ImageGetByCursorRes,
  ImageUploadRes
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
