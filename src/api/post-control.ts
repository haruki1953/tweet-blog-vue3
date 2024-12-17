import type {
  PostControlDeleteImportDataRes,
  PostControlImportJsonType,
  PostControlImportRes
} from '@/types'
import { http } from '@/utils'

export const postControlImportApi = (
  json: PostControlImportJsonType
): PostControlImportRes => {
  return http.post('/post-control/import', json)
}

export const postControlDeleteImportDataApi = (
  id: string
): PostControlDeleteImportDataRes => {
  return http.delete(`/post-control/import-data/id/${id}`)
}
