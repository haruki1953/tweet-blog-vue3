import type {
  Post,
  PostByIdData,
  PostData,
  PostGetByCursorData,
  PostGetByIdData
} from '@/types'
import { mergeArrays } from './base'

export const postGetByCursorDataHandle = (
  data: PostGetByCursorData
): PostData[][] => {
  // first handel data to `PostData[][]`

  // 将有关系的帖子合并在一起
  // 转为id二维数组
  const idTempGrid: number[][] = data.map((post) => {
    const idList: number[] = []
    if (post.parentPost != null) {
      idList.push(post.parentPost.id)
    }
    idList.push(post.id)
    return idList
  })
  // 合并有关系的数组
  const idRelationGrid = mergeArrays(idTempGrid)
  // 将合并后的数字二维数组转为帖子二维数组
  const postRelationGrid: PostData[][] = idRelationGrid.map((idList) => {
    return idList
      .map((id) => {
        let idPost: PostData | undefined
        data.some((post) => {
          if (post.id === id) {
            // 再
            idPost = post
            return true
          }
          if (idPost === undefined && post.parentPost?.id === id) {
            idPost = {
              ...post.parentPost,
              parentPost: null
            }
          }
        })
        return idPost
      })
      .filter((post) => post) as PostData[]
  })

  // 调整顺序，遍历postRelationGrid
  const postGroupList = postRelationGrid.map((postList) => {
    const postGroup: PostData[] = []
    // 1 找到主帖 parentPost === null
    const mainPost = postList.find((post) => post.parentPost === null)
    if (!mainPost) {
      // 出现错误，原样返回
      return postList
    }
    postGroup.push(mainPost)

    // 2 递归处理回复与回复的回复
    const recursionToHandleReplies = (parentId: number) => {
      // 查找
      const replies = postList.filter(
        (post) => post.parentPost?.id === parentId
      )
      // 排序，以日期 升序排序（最新的帖子在下）
      replies.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      // 递归查找回复的回复
      replies.forEach((repost) => {
        postGroup.push(repost)
        recursionToHandleReplies(repost.id)
      })
    }
    recursionToHandleReplies(mainPost.id)
    return postGroup
  })

  // 3 将postGroupList中的postGroup排序，
  // 以帖子数组中日期最新的帖子的日期 降序排序（最新的帖子组在上）
  // 好像即使不排序，处理后的数据顺序也是对的，那就先不管了

  // console.log(idTempGrid)
  // console.log(idRelationGrid)

  return postGroupList
}

// export const postGetByIdDataHandle = (data: PostGetByIdData): PostByIdData => {
//   const post = {
//     ...data,
//     replies: undefined
//   }
// }
