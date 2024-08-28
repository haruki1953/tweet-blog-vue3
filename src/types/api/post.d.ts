import type { Post } from '../data'
import type { ResData } from './base'

export type PostGetByCursorQueryType = {
  content?: string | undefined
  isDelete?: 'true' | 'false' | 'all' | undefined
}
export type PostGetByCursorData = Array<
  Post & {
    parentPost: Post | null
  }
>
export type PostGetByCursorRes = ResData<PostGetByCursorData>

export type PostSendJsonType = {
  content?: string | undefined
  images?: number[] | undefined
  createdAt?: Date | undefined
  parentPostId?: number | null | undefined
  twitterId?: string | null | undefined
  twitterLink?: string | null | undefined
  isDeleted?: boolean | undefined
}
export type PostSendRes = ResData<Post>
