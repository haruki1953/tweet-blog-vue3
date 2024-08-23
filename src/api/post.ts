import type { PostGetByCursorQueryType, PostGetByCursorRes } from '@/types'
import { http } from '@/utils'

export const postGetByCursorApi = (
  cursorId: number,
  query?: PostGetByCursorQueryType
): PostGetByCursorRes => {
  return http.get(`/post/cursor/${cursorId}`, {
    params: query
  })
}
