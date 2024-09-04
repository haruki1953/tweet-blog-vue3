import type {
  PostGetByCursorQueryType,
  PostGetByCursorRes,
  PostGetByIdQueryType,
  PostGetByIdRes,
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

export const postGetByIdApi = (
  postId: number,
  query?: PostGetByIdQueryType
): PostGetByIdRes => {
  return http.get(`/post/id/${postId}`, {
    params: query
  })
}
