import type { AxiosResponse } from 'axios'
import type { Post, Image } from './data'

// api方法返回值类型的，dataType为返回数据的类型
export type ResData<DataType = undefined> = Promise<
  AxiosResponse<{
    code: number
    message: string
    data: DataType
  }>
>

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
