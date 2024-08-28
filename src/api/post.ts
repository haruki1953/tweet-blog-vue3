import type {
  PostGetByCursorQueryType,
  PostGetByCursorRes,
  PostSendJsonType,
  PostSendRes
} from '@/types'
import { http } from '@/utils'

export const postGetByCursorApi = (
  cursorId: number,
  query?: PostGetByCursorQueryType
): PostGetByCursorRes => {
  return http.get(`/post/cursor/${cursorId}`, {
    params: query
  })
}

export const postSendApi = (json: PostSendJsonType): PostSendRes => {
  return http.post('/post', json)
}
