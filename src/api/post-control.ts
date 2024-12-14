import type { PostControlImportJsonType, PostControlImportRes } from '@/types'
import { http } from '@/utils'

export const postControlImportApi = (
  json: PostControlImportJsonType
): PostControlImportRes => {
  return http.post('/post-control/import', json)
}
