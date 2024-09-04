import type { Post, PostData } from '../data'
import type { ResData } from './base'

export type PostGetByCursorQueryType = {
  content?: string | undefined
  isDelete?: 'true' | 'false' | 'all' | undefined
}
export type PostGetByCursorData = PostData[]
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

export type PostGetByIdQueryType = {
  keepIsDetele?: 'true' | 'false' | undefined
}
export type PostGetByIdData = Post & {
  parentPost: Post | null
  replies: Array<
    Post & {
      replies: Post[]
    }
  >
}
export type PostGetByIdRes = ResData<PostGetByIdData>
