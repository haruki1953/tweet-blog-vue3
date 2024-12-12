import type { PostControlImportJsonType } from '@/types'
import { http } from '@/utils'

export const postControlImportApi = (json: PostControlImportJsonType) => {
  return http.post('/post-control/import', json)
}
