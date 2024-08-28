import type { ImageUploadRes } from '@/types'
import { http } from '@/utils'
import type { UploadRawFile } from 'element-plus'

export const imageUploadService = (
  imageRawFile: UploadRawFile
): ImageUploadRes => {
  const fd = new FormData()
  fd.append('image', imageRawFile)
  return http.post('/image', fd)
}
